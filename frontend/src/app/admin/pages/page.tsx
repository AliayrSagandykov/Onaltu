'use client';

import {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import RichTextEditor from '@/components/RichTextEditor';

const EDITABLE_FIELDS: Array<{key: string; label: string; page: string; multiline?: boolean; rich?: boolean}> = [
  // About page
  {key: 'about.presidentName', label: 'Имя президента', page: 'О нас'},
  {key: 'about.intro', label: 'Вводный текст', page: 'О нас', multiline: true},
  {key: 'about.historyText1', label: 'История (абзац 1)', page: 'О нас', multiline: true},
  {key: 'about.historyText2', label: 'История (абзац 2)', page: 'О нас', multiline: true},
  // Home page
  {key: 'hero.title', label: 'Заголовок главной', page: 'Главная'},
  {key: 'hero.description', label: 'Описание главной', page: 'Главная', multiline: true},
  {key: 'aboutSection.lead', label: 'Об ассоциации (вводная)', page: 'Главная', multiline: true},
  {key: 'aboutSection.body', label: 'Об ассоциации (основной)', page: 'Главная', multiline: true},
  // Contacts
  {key: 'footer.addressLine1', label: 'Адрес (строка 1)', page: 'Контакты'},
  {key: 'footer.addressLine2', label: 'Адрес (строка 2)', page: 'Контакты'},
  {key: 'footer.phone1', label: 'Телефон 1', page: 'Контакты'},
  {key: 'footer.phone2', label: 'Телефон 2', page: 'Контакты'},
  {key: 'footer.email', label: 'Email', page: 'Контакты'},
];

export default function AdminPagesPage() {
  const {data: session, status} = useSession();
  const router = useRouter();
  const [locale, setLocale] = useState('ru');
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  useEffect(() => {
    fetch(`/api/admin/page-content?locale=${locale}`)
      .then(r => r.json())
      .then(data => setValues(data));
  }, [locale]);

  const handleSave = async (key: string) => {
    setLoading(l => ({...l, [key]: true}));
    await fetch('/api/admin/page-content', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({key, locale, value: values[key] || ''}),
    });
    setLoading(l => ({...l, [key]: false}));
    setSaved(s => ({...s, [key]: true}));
    setTimeout(() => setSaved(s => ({...s, [key]: false})), 2000);
  };

  if (status === 'loading') return <div className="p-10 text-center">Загрузка...</div>;
  if (!session) return null;

  const pages = [...new Set(EDITABLE_FIELDS.map(f => f.page))];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-arrow-left" />
            </Link>
            <h1 className="text-2xl font-bold text-[#2a5298]">
              <i className="fas fa-file-edit mr-2" />
              Редактор страниц
            </h1>
          </div>
          <div className="flex gap-2">
            {['ru', 'kz', 'en'].map(l => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  locale === l ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 text-sm">
          <i className="fas fa-info-circle mr-2" />
          Изменения сохраняются в базе данных и сразу отображаются на сайте. Если поле пустое — используется значение по умолчанию.
        </div>

        {pages.map(page => (
          <div key={page}>
            <h2 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b border-gray-200">
              {page}
            </h2>
            <div className="space-y-6">
              {EDITABLE_FIELDS.filter(f => f.page === page).map(field => (
                <div key={field.key} className="bg-white rounded-lg shadow-sm p-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {field.label}
                    <span className="ml-2 text-xs text-gray-400 font-mono">{field.key}</span>
                  </label>
                  {field.rich ? (
                    <RichTextEditor
                      content={values[field.key] || ''}
                      onChange={val => setValues(v => ({...v, [field.key]: val}))}
                    />
                  ) : field.multiline ? (
                    <textarea
                      value={values[field.key] || ''}
                      onChange={e => setValues(v => ({...v, [field.key]: e.target.value}))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 min-h-[100px] resize-y"
                    />
                  ) : (
                    <input
                      type="text"
                      value={values[field.key] || ''}
                      onChange={e => setValues(v => ({...v, [field.key]: e.target.value}))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  )}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => handleSave(field.key)}
                      disabled={loading[field.key]}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
                    >
                      {loading[field.key] ? 'Сохранение...' : saved[field.key] ? '✓ Сохранено!' : 'Сохранить'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
