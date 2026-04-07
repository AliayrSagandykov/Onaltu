import {useTranslations} from 'next-intl';
import {prisma} from '@/lib/prisma';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export const dynamic = 'force-dynamic';

export default async function NewsPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = useTranslations('news');

  let articles: Array<{id: string; slug: string; title: string; excerpt: string | null; createdAt: Date; imageUrl: string | null}> = [];
  try {
    articles = await prisma.article.findMany({
      where: {locale, published: true},
      orderBy: {createdAt: 'desc'},
    });
  } catch {
    // DB not initialized yet
  }

  return (
    <>
      <TopBar />
      <Navbar />

      <div className="container mx-auto px-4 py-16 min-h-[60vh]">
        <h1 className="text-4xl font-bold text-[#2c3e50] mb-10 section-title-underline">{t('title')}</h1>

        {articles.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <i className="fas fa-newspaper text-6xl mb-4 opacity-30" />
            <p className="text-xl">{t('noArticles')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/${locale}/news/${article.slug}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group"
              >
                {article.imageUrl && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="text-sm text-gray-400 mb-2">
                    {new Date(article.createdAt).toLocaleDateString(locale === 'kz' ? 'kk-KZ' : locale === 'en' ? 'en-US' : 'ru-RU')}
                  </div>
                  <h2 className="text-xl font-bold text-[#2c3e50] mb-3 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="text-gray-500 line-clamp-3">{article.excerpt}</p>
                  )}
                  <span className="inline-block mt-4 text-blue-600 font-medium">
                    {t('readMore')} →
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
