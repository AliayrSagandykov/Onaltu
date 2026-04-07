'use client';

import {useTranslations} from 'next-intl';
import {useEffect, useRef} from 'react';
import Image from 'next/image';

const partners = [
  {src: 'https://www.nccr.kz/images/banners/logo.png', alt: 'NCCR'},
  {src: '/images/AqbulakNCCR.jpg', alt: 'Aqbulak'},
  {src: 'https://altynshipager.kz/rehabilitation-conference/assets/img/favicon.png', alt: 'Altyn Shipager'},
  {src: 'https://via.placeholder.com/200x100?text=Partner+4', alt: 'Partner 4'},
  {src: 'https://via.placeholder.com/200x100?text=Partner+5', alt: 'Partner 5'},
  {src: 'https://via.placeholder.com/200x100?text=Partner+6', alt: 'Partner 6'},
  {src: 'https://via.placeholder.com/200x100?text=Partner+7', alt: 'Partner 7'},
  {src: 'https://via.placeholder.com/200x100?text=Partner+8', alt: 'Partner 8'},
];

export default function PartnersCarousel() {
  const t = useTranslations('partners');
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
        track.scrollLeft += 2;
        if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 10) {
          setTimeout(() => { track.scrollLeft = 0; }, 1000);
        }
      }
    }, 30);

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      track.classList.add('grabbing');
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    };
    const onMouseUp = () => { isDown = false; track.classList.remove('grabbing'); };
    const onMouseLeave = () => { isDown = false; isHovering = false; track.classList.remove('grabbing'); };
    const onMouseEnter = () => { isHovering = true; };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX) * 2;
    };

    const onTouchStart = (e: TouchEvent) => {
      isDown = true;
      startX = e.touches[0].pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    };
    const onTouchEnd = () => { isDown = false; };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX) * 2;
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

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <h2 className="text-center text-4xl font-bold mb-12 text-gray-800">
        {t('title')}
      </h2>
      <div className="max-w-[1200px] mx-auto px-4">
        <div ref={trackRef} className="partners-track">
          {partners.map((p, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[250px] h-[250px] bg-white rounded-2xl flex items-center justify-center p-6 hover:-translate-y-2.5 hover:shadow-xl transition-all scroll-snap-align-start"
            >
              <Image
                src={p.src}
                alt={p.alt}
                width={200}
                height={100}
                className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-400"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
