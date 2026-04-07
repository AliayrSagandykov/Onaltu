'use client';

import {useEffect} from 'react';

declare global {
  interface Window {
    ymaps?: {
      ready: (fn: () => void) => void;
      Map: new (el: string, opts: Record<string, unknown>) => {
        geoObjects: {add: (p: unknown) => void};
        behaviors: {disable: (b: string) => void};
      };
      Placemark: new (
        coords: number[],
        props: Record<string, string>,
        opts: Record<string, unknown>
      ) => unknown;
    };
  }
}

export default function YandexMap() {
  useEffect(() => {
    const scriptId = 'yandex-maps-script';
    if (document.getElementById(scriptId)) {
      initMap();
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
    script.async = true;
    script.onload = () => initMap();
    document.head.appendChild(script);
  }, []);

  function initMap() {
    if (!window.ymaps) return;
    window.ymaps.ready(() => {
      const el = document.getElementById('footer-map');
      if (!el || el.children.length > 0) return;

      const coords: [number, number] = [51.120293, 71.404809];
      const map = new window.ymaps!.Map('footer-map', {
        center: coords,
        zoom: 16,
        controls: [],
      });

      const placemark = new window.ymaps!.Placemark(
        coords,
        {
          hintContent: 'Национальный центр детской реабилитации',
          balloonContent: 'Астана, ул. Турана, 36',
        },
        {
          iconLayout: 'default#image',
          iconImageHref: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          iconImageSize: [40, 40],
          iconImageOffset: [-20, -40],
        }
      );

      map.geoObjects.add(placemark);
      map.behaviors.disable('scrollZoom');
    });
  }

  return null;
}
