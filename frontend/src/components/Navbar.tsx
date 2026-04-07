'use client';

import {useTranslations} from 'next-intl';
import {usePathname} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {useState} from 'react';

export default function Navbar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'ru';
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    {href: `/${locale}`, label: t('home'), key: 'home'},
    {href: `/${locale}/about`, label: t('about'), key: 'about'},
    {href: `/${locale}/membership`, label: t('membership'), key: 'membership'},
    {href: `/${locale}/news`, label: t('news'), key: 'news'},
    {href: `/${locale}/contacts`, label: t('contacts'), key: 'contacts'},
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 flex items-center justify-between py-2">
        <Link href={`/${locale}`} className="flex items-center">
          <Image src="/images/onaltu_logo.png" alt="ONALTU" width={128} height={128} className="h-20 w-auto" />
        </Link>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'} text-xl`} />
        </button>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-8 mx-auto">
          {links.map((link) => (
            <li key={link.key}>
              <Link
                href={link.href}
                className={`text-lg font-medium px-3 py-2 rounded-lg transition-all hover:text-blue-600 hover:bg-blue-50 ${
                  isActive(link.href)
                    ? 'text-blue-600 border-b-[3px] border-blue-600'
                    : 'text-gray-800'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <ul className="flex flex-col py-2">
            {links.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-6 py-3 text-lg font-medium transition-all ${
                    isActive(link.href) ? 'text-blue-600 bg-blue-50' : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
