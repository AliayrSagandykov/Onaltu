'use client';

import {useTranslations} from 'next-intl';
import {usePathname} from 'next/navigation';
import Link from 'next/link';

export default function TopBar() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  const currentLocale = pathname.split('/')[1] || 'ru';
  const pathWithoutLocale = pathname.replace(/^\/(ru|kz|en)/, '') || '/';

  const locales = [
    {code: 'ru', label: 'Русский'},
    {code: 'kz', label: 'Қазақша'},
    {code: 'en', label: 'English'},
  ];

  return (
    <div className="bg-white border-b border-gray-200 py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center" />
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1">
            <i className="bi bi-telephone" />
            <span>{t('phone')}</span>
          </span>
          <span className="hidden md:flex items-center gap-1">
            <i className="bi bi-eye" />
            <a href="#" className="hover:text-blue-600">{t('accessibility')}</a>
          </span>
          <div className="relative group">
            <button className="border border-gray-800 rounded px-2 py-1 text-sm font-medium hover:bg-gray-50">
              🌐 {t('langLabel')}
            </button>
            <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg hidden group-hover:block z-50 min-w-[120px]">
              {locales.map((loc) => (
                <Link
                  key={loc.code}
                  href={`/${loc.code}${pathWithoutLocale}`}
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  {loc.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
