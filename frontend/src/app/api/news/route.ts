import {NextRequest} from 'next/server';
import {prisma} from '@/lib/prisma';
import {auth} from '@/lib/auth';

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

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return Response.json({error: 'Unauthorized'}, {status: 401});

  const body = await request.json();
  const {title, content, excerpt, locale, slug, imageUrl, published} = body;

  const article = await prisma.article.create({
    data: {
      title,
      content,
      excerpt: excerpt || '',
      locale: locale || 'ru',
      slug: slug || title.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, '-').replace(/-+/g, '-'),
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
  const {id, ...data} = body;

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
