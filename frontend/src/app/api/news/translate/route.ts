import {NextRequest} from 'next/server';
import {prisma} from '@/lib/prisma';
import {auth} from '@/lib/auth';
import {SUPPORTED_LOCALES, translate} from '@/lib/translate';
import {slugify} from '@/lib/slug';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

async function uniqueSlug(base: string): Promise<string> {
  let candidate = base || 'article';
  let i = 1;
  while (await prisma.article.findUnique({where: {slug: candidate}})) {
    candidate = `${base}-${++i}`;
  }
  return candidate;
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return Response.json({error: 'Unauthorized'}, {status: 401});

  let body: {sourceId?: string; targetLocale?: string};
  try {
    body = await request.json();
  } catch {
    return Response.json({error: 'Invalid JSON'}, {status: 400});
  }

  const {sourceId, targetLocale} = body;
  if (!sourceId || !targetLocale) {
    return Response.json({error: 'Missing sourceId or targetLocale'}, {status: 400});
  }
  if (!SUPPORTED_LOCALES.includes(targetLocale as 'ru' | 'kz' | 'en')) {
    return Response.json({error: 'Unsupported locale'}, {status: 400});
  }

  const source = await prisma.article.findUnique({where: {id: sourceId}});
  if (!source) return Response.json({error: 'Source article not found'}, {status: 404});
  if (source.locale === targetLocale) {
    return Response.json({error: 'Source and target locale match'}, {status: 400});
  }

  try {
    const [tTitle, tContent, tExcerpt] = await Promise.all([
      translate(source.title, source.locale, targetLocale),
      translate(source.content, source.locale, targetLocale),
      source.excerpt
        ? translate(source.excerpt, source.locale, targetLocale)
        : Promise.resolve(''),
    ]);

    const baseSlug = slugify(tTitle) || `${source.slug}-${targetLocale}`;
    const finalSlug = await uniqueSlug(baseSlug);

    const translated = await prisma.article.create({
      data: {
        title: tTitle,
        content: tContent,
        excerpt: tExcerpt,
        locale: targetLocale,
        slug: finalSlug,
        imageUrl: source.imageUrl,
        published: source.published,
      },
    });

    return Response.json({success: true, article: translated});
  } catch (e) {
    console.error(`[translate] ${source.locale}→${targetLocale} failed:`, e);
    return Response.json(
      {error: 'Translation failed', detail: (e as Error).message},
      {status: 502},
    );
  }
}
