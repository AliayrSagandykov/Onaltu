import {prisma} from '@/lib/prisma';
import {notFound} from 'next/navigation';
import {getTranslations} from 'next-intl/server';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export const dynamic = 'force-dynamic';

export default async function ArticlePage({params}: {params: Promise<{locale: string; slug: string}>}) {
  const {locale, slug} = await params;
  const t = await getTranslations({locale, namespace: 'news'});

  let article;
  try {
    article = await prisma.article.findFirst({
      where: {slug, locale, published: true},
    });
  } catch {
    notFound();
  }

  if (!article) notFound();

  return (
    <>
      <TopBar />
      <Navbar />

      <div className="container mx-auto px-4 py-16 max-w-4xl min-h-[60vh]">
        <Link href={`/${locale}/news`} className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
          ← {t('backToNews')}
        </Link>

        <article>
          <div className="text-sm text-gray-400 mb-3">
            {new Date(article.createdAt).toLocaleDateString(locale === 'kz' ? 'kk-KZ' : locale === 'en' ? 'en-US' : 'ru-RU')}
          </div>
          <h1 className="text-4xl font-bold text-[#2c3e50] mb-8">{article.title}</h1>

          {article.imageUrl && (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full rounded-xl mb-8 shadow-lg"
            />
          )}

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{__html: article.content}}
          />
        </article>
      </div>

      <Footer />
      <ScrollToTop />
    </>
  );
}
