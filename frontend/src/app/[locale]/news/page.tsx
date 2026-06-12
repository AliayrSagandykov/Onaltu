import {getTranslations} from 'next-intl/server';
import {prisma} from '@/lib/prisma';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export const dynamic = 'force-dynamic';

export default async function NewsPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'news'});

  let articles: Array<{id: string; slug: string; title: string; excerpt: string | null; createdAt: Date; imageUrl: string | null}> = [];
  try {
    articles = await prisma.article.findMany({
      where: {locale, published: true},
      orderBy: {createdAt: 'desc'},
    });
  } catch {
    // DB not initialized yet
  }

  const dateLocale = locale === 'kz' ? 'kk-KZ' : locale === 'en' ? 'en-US' : 'ru-RU';

  return (
    <>
      <TopBar />
      <Navbar />

      <div className="container mx-auto px-4 py-10 sm:py-14 min-h-[60vh]">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#2c3e50] mb-8 sm:mb-10 section-title-underline">
          {t('title')}
        </h1>

        {articles.length === 0 ? (
          <div className="text-center text-gray-400 py-16 sm:py-24 bg-gray-50 rounded-2xl">
            <i className="fas fa-newspaper text-5xl sm:text-6xl mb-4 opacity-40" />
            <p className="text-lg sm:text-xl">{t('noArticles')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/${locale}/news/${article.slug}`}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                {article.imageUrl ? (
                  <div className="aspect-video w-full overflow-hidden bg-gray-100">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                    <i className="fas fa-newspaper text-5xl text-blue-300" />
                  </div>
                )}
                <div className="p-5 sm:p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                    <i className="far fa-calendar-alt" />
                    {new Date(article.createdAt).toLocaleDateString(dateLocale, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#2c3e50] mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="text-gray-500 line-clamp-3 text-sm">{article.excerpt}</p>
                  )}
                  <span className="inline-flex items-center gap-1.5 mt-4 text-blue-600 font-medium text-sm group-hover:gap-2.5 transition-all">
                    {t('readMore')}
                    <i className="fas fa-arrow-right text-xs" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
      <ScrollToTop />
    </>
  );
}
