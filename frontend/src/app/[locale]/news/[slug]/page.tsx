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

  const [olderArticle, newerArticle] = await Promise.all([
    prisma.article
      .findFirst({
        where: {locale, published: true, createdAt: {lt: article.createdAt}},
        orderBy: {createdAt: 'desc'},
        select: {slug: true, title: true},
      })
      .catch(() => null),
    prisma.article
      .findFirst({
        where: {locale, published: true, createdAt: {gt: article.createdAt}},
        orderBy: {createdAt: 'asc'},
        select: {slug: true, title: true},
      })
      .catch(() => null),
  ]);

  const dateLocale = locale === 'kz' ? 'kk-KZ' : locale === 'en' ? 'en-US' : 'ru-RU';

  return (
    <>
      <TopBar />
      <Navbar />

      <div className="container mx-auto px-4 py-10 sm:py-14 max-w-4xl min-h-[60vh]">
        <Link
          href={`/${locale}/news`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 text-sm font-medium group"
        >
          <i className="fas fa-arrow-left transition-transform group-hover:-translate-x-1" />
          {t('backToNews')}
        </Link>

        <article>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <i className="far fa-calendar-alt text-gray-400" />
            {new Date(article.createdAt).toLocaleDateString(dateLocale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2c3e50] mb-6 sm:mb-8 break-words leading-tight">
            {article.title}
          </h1>

          {article.imageUrl && (
            <div className="article-cover mb-6 sm:mb-8">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div
            className="article-content prose prose-sm sm:prose-base max-w-none text-gray-700"
            dangerouslySetInnerHTML={{__html: article.content}}
          />
        </article>

        {(newerArticle || olderArticle) && (
          <nav className="mt-12 sm:mt-16 pt-8 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {newerArticle ? (
              <Link
                href={`/${locale}/news/${newerArticle.slug}`}
                className="group block bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                  <i className="fas fa-arrow-left transition-transform group-hover:-translate-x-1" />
                  {t('newer')}
                </div>
                <div className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 line-clamp-2">
                  {newerArticle.title}
                </div>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}
            {olderArticle ? (
              <Link
                href={`/${locale}/news/${olderArticle.slug}`}
                className="group block bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-md sm:text-right"
              >
                <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold mb-1.5 uppercase tracking-wide sm:justify-end">
                  {t('older')}
                  <i className="fas fa-arrow-right transition-transform group-hover:translate-x-1" />
                </div>
                <div className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 line-clamp-2">
                  {olderArticle.title}
                </div>
              </Link>
            ) : null}
          </nav>
        )}
      </div>

      <Footer />
      <ScrollToTop />
    </>
  );
}
