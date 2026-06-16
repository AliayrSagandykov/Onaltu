import {NextRequest} from 'next/server';
import {prisma} from '@/lib/prisma';
import {auth} from '@/lib/auth';
import {slugify} from '@/lib/slug';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

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

  const body = await request.json();
  const {title, content, excerpt, locale, slug, imageUrl, published} = body as {
    title: string;
    content: string;
    excerpt?: string;
    locale?: string;
    slug?: string;
    imageUrl?: string | null;
    published?: boolean;
  };

  const sourceLocale = locale || 'ru';
  const baseSlug = (slug && slug.trim()) || slugify(title);
  const finalSlug = await uniqueSlug(baseSlug);

  const article = await prisma.article.create({
    data: {
      title,
      content,
      excerpt: excerpt || '',
      locale: sourceLocale,
      slug: finalSlug,
      imageUrl: imageUrl || null,
      published: published ?? false,
    },
  });

  return Response.json(article);
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) return Response.json({error: 'Unauthorized'}, {status: 401});

  const body = await request.json();
  const {id, ...data} = body as {id: string} & Record<string, unknown>;

  delete (data as Record<string, unknown>).autoTranslate;

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
