'use client';

import {useState} from 'react';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';

const PAGES = [
  {value: '/', label: 'Главная'},
  {value: '/about', label: 'О нас'},
  {value: '/membership', label: 'Членство'},
  {value: '/contacts', label: 'Контакты'},
];

const LOCALES = [
  {value: 'ru', label: '🇷🇺 Русский'},
  {value: 'kz', label: '🇰🇿 Казахский'},
  {value: 'en', label: '🇬🇧 English'},
];

export default function AdminEditorPage() {
  const {data: session, status} = useSession();
  const router = useRouter();
  const [locale, setLocale] = useState('ru');
  const [page, setPage] = useState('/');
  const [key, setKey] = useState(0);

  if (status === 'loading') return <div className="p-10 text-center">Загрузка...</div>;
  if (!session) {
    router.push('/admin/login');
    return null;
  }

  const iframeSrc = `/${locale}${page}?__adminEdit=1`;

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-6 py-3 bg-gray-800 border-b border-gray-700 flex-shrink-0">
        <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
          <i className="fas fa-arrow-left mr-2" />
          Панель
        </Link>

        <div className="w-px h-6 bg-gray-600" />

        <span className="text-gray-300 text-sm font-medium">Страница:</span>
        <div className="flex gap-1">
          {PAGES.map(p => (
            <button
              key={p.value}
              onClick={() => setPage(p.value)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                page === p.value ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-gray-600" />

        <span className="text-gray-300 text-sm font-medium">Язык:</span>
        <div className="flex gap-1">
          {LOCALES.map(l => (
            <button
              key={l.value}
              onClick={() => setLocale(l.value)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                locale === l.value ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="flex items-center gap-2 text-sm text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Нажмите на выделенный элемент для редактирования
          </span>
          <button
            onClick={() => setKey(k => k + 1)}
            className="px-3 py-1.5 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded text-sm transition-colors"
            title="Перезагрузить"
          >
            <i className="fas fa-sync-alt" />
          </button>
        </div>
      </div>

      {/* iframe */}
      <iframe
        key={key}
        src={iframeSrc}
        className="flex-1 w-full border-0 bg-white"
        title="Page Editor"
      />
    </div>
  );
}
