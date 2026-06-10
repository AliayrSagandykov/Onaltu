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

  const gallery = (article.images || []).filter((u) => u && u.trim());

  return (
    <>
      <TopBar />
      <Navbar />

      <div className="container mx-auto px-4 py-10 sm:py-16 max-w-4xl min-h-[60vh]">
        <Link href={`/${locale}/news`} className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
          ← {t('backToNews')}
        </Link>

        <article>
          <div className="text-sm text-gray-400 mb-3">
            {new Date(article.createdAt).toLocaleDateString(locale === 'kz' ? 'kk-KZ' : locale === 'en' ? 'en-US' : 'ru-RU')}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2c3e50] mb-6 sm:mb-8 break-words">{article.title}</h1>

          {article.imageUrl && (
            <div className="article-cover mb-6 sm:mb-8">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover rounded-xl shadow-lg"
              />
            </div>
          )}

          <div
            className="article-content prose prose-sm sm:prose-base max-w-none"
            dangerouslySetInnerHTML={{__html: article.content}}
          />

          {gallery.length > 0 && (
            <div className="mt-10 sm:mt-12">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#2c3e50] mb-4 sm:mb-6">
                {t('gallery')}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {gallery.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="article-gallery-item block bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>

      <Footer />
      <ScrollToTop />
    </>
  );
}
