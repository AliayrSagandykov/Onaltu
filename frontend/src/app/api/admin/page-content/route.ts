import {NextRequest} from 'next/server';
import {prisma} from '@/lib/prisma';
import {auth} from '@/lib/auth';

export async function GET(request: NextRequest) {
  const {searchParams} = request.nextUrl;
  const locale = searchParams.get('locale') || 'ru';

  const items = await prisma.pageContent.findMany({where: {locale}});
  const result: Record<string, string> = {};
  for (const item of items) {
    result[item.key] = item.value;
  }
  return Response.json(result);
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) return Response.json({error: 'Unauthorized'}, {status: 401});

  const {key, locale, value} = await request.json();
  if (!key || !locale) return Response.json({error: 'Missing key or locale'}, {status: 400});

  const item = await prisma.pageContent.upsert({
    where: {key_locale: {key, locale}},
    update: {value},
    create: {key, locale, value},
  });

  return Response.json(item);
}
