'use client';

import {useEffect, useRef} from 'react';
import Link from 'next/link';

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  createdAt: string;
  imageUrl: string | null;
}

interface Props {
  locale: string;
  title: string;
  readMoreLabel: string;
  articles: NewsItem[];
}

export default function NewsCarousel({locale, title, readMoreLabel, articles}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let isHovering = false;

    const interval = setInterval(() => {
      if (!isDown && !isHovering) {
        track.scrollLeft += 1;
        if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 5) {
          setTimeout(() => {
            track.scrollLeft = 0;
          }, 1500);
        }
      }
    }, 40);

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      track.classList.add('grabbing');
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    };
    const onMouseUp = () => {
      isDown = false;
      track.classList.remove('grabbing');
    };
    const onMouseLeave = () => {
      isDown = false;
      isHovering = false;
      track.classList.remove('grabbing');
    };
    const onMouseEnter = () => {
      isHovering = true;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX) * 1.5;
    };
    const onTouchStart = (e: TouchEvent) => {
      isDown = true;
      startX = e.touches[0].pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    };
    const onTouchEnd = () => {
      isDown = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX) * 1.5;
    };

    track.addEventListener('mousedown', onMouseDown);
    track.addEventListener('mouseup', onMouseUp);
    track.addEventListener('mouseleave', onMouseLeave);
    track.addEventListener('mouseenter', onMouseEnter);
    track.addEventListener('mousemove', onMouseMove);
    track.addEventListener('touchstart', onTouchStart);
    track.addEventListener('touchend', onTouchEnd);
    track.addEventListener('touchmove', onTouchMove);

    return () => {
      clearInterval(interval);
      track.removeEventListener('mousedown', onMouseDown);
      track.removeEventListener('mouseup', onMouseUp);
      track.removeEventListener('mouseleave', onMouseLeave);
      track.removeEventListener('mouseenter', onMouseEnter);
      track.removeEventListener('mousemove', onMouseMove);
      track.removeEventListener('touchstart', onTouchStart);
      track.removeEventListener('touchend', onTouchEnd);
      track.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  if (articles.length === 0) return null;

  const dateLocale = locale === 'kz' ? 'kk-KZ' : locale === 'en' ? 'en-US' : 'ru-RU';

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-[#2c3e50] section-title-underline centered">
          {title}
        </h2>

        <div ref={trackRef} className="news-track">
          {articles.map((article) => (
            <div
              key={article.id}
              className="news-card flex-shrink-0 bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {article.imageUrl ? (
                <div className="aspect-video w-full overflow-hidden bg-gray-100">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
              ) : (
                <div className="aspect-video w-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                  <i className="fas fa-newspaper text-4xl text-blue-300" />
                </div>
              )}
              <div className="p-4 sm:p-5 flex flex-col flex-grow">
                <div className="text-xs text-gray-400 mb-2">
                  {new Date(article.createdAt).toLocaleDateString(dateLocale)}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#2c3e50] mb-2 line-clamp-2">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-sm text-gray-500 line-clamp-3 mb-4">{article.excerpt}</p>
                )}
                <Link
                  href={`/${locale}/news/${article.slug}`}
                  className="mt-auto inline-block self-start bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  {readMoreLabel}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
