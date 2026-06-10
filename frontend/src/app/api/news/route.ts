import {NextRequest} from 'next/server';
import {prisma} from '@/lib/prisma';
import {auth} from '@/lib/auth';
import {SUPPORTED_LOCALES, translate} from '@/lib/translate';

export async function GET(request: NextRequest) {
  const {searchParams} = request.nextUrl;
  const locale = searchParams.get('locale') || 'ru';
  const all = searchParams.get('all') === 'true';

  const session = await auth();
  const where = all && session ? {locale} : {locale, published: true};

  const articles = await prisma.article.findMany({
    where,
    orderBy: {createdAt: 'desc'},
  });

  return Response.json(articles);
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-zа-яё0-9]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return Response.json({error: 'Unauthorized'}, {status: 401});

  const body = await request.json();
  const {
    title,
    content,
    excerpt,
    locale,
    slug,
    imageUrl,
    images,
    published,
    autoTranslate,
  } = body as {
    title: string;
    content: string;
    excerpt?: string;
    locale?: string;
    slug?: string;
    imageUrl?: string | null;
    images?: string[];
    published?: boolean;
    autoTranslate?: boolean;
  };

  const sourceLocale = locale || 'ru';
  const baseSlug = (slug && slug.trim()) || slugify(title);
  const imageList = Array.isArray(images) ? images.filter((u) => u && u.trim()) : [];

  const article = await prisma.article.create({
    data: {
      title,
      content,
      excerpt: excerpt || '',
      locale: sourceLocale,
      slug: baseSlug,
      imageUrl: imageUrl || null,
      images: imageList,
      published: published ?? false,
    },
  });

  if (autoTranslate !== false) {
    const otherLocales = SUPPORTED_LOCALES.filter((l) => l !== sourceLocale);
    await Promise.all(
      otherLocales.map(async (targetLocale) => {
        try {
          const existing = await prisma.article.findFirst({
            where: {slug: baseSlug, locale: targetLocale},
          });
          if (existing) return;

          const [tTitle, tContent, tExcerpt] = await Promise.all([
            translate(title, sourceLocale, targetLocale),
            translate(content, sourceLocale, targetLocale),
            excerpt ? translate(excerpt, sourceLocale, targetLocale) : Promise.resolve(''),
          ]);

          await prisma.article.create({
            data: {
              title: tTitle,
              content: tContent,
              excerpt: tExcerpt,
              locale: targetLocale,
              slug: baseSlug,
              imageUrl: imageUrl || null,
              images: imageList,
              published: published ?? false,
            },
          });
        } catch (e) {
          console.error(`Auto-translate ${sourceLocale}→${targetLocale} failed:`, e);
        }
      }),
    );
  }

  return Response.json(article);
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) return Response.json({error: 'Unauthorized'}, {status: 401});

  const body = await request.json();
  const {id, images, ...rest} = body as {id: string; images?: string[]} & Record<string, unknown>;

  const data: Record<string, unknown> = {...rest};
  if (Array.isArray(images)) {
    data.images = images.filter((u): u is string => typeof u === 'string' && !!u.trim());
  }

  const article = await prisma.article.update({
    where: {id},
    data,
  });

  return Response.json(article);
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session) return Response.json({error: 'Unauthorized'}, {status: 401});

  const {searchParams} = request.nextUrl;
  const id = searchParams.get('id');
  if (!id) return Response.json({error: 'Missing id'}, {status: 400});

  await prisma.article.delete({where: {id}});
  return Response.json({success: true});
}
