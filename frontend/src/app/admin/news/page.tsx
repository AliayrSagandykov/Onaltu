'use client';

import {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import NewsEditor from '@/components/NewsEditor';

interface Article {
  id: string;
  slug: string;
  locale: string;
  title: string;
  content: string;
  excerpt: string | null;
  imageUrl: string | null;
  published: boolean;
  createdAt: string;
}

const LOCALE_LABEL: Record<string, string> = {ru: 'Русский', kz: 'Қазақша', en: 'English'};

export default function AdminNewsPage() {
  const {data: session, status} = useSession();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [editing, setEditing] = useState<Article | null>(null);
  const [creating, setCreating] = useState(false);
  const [locale, setLocale] = useState('ru');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  useEffect(() => {
    fetchArticles();
  }, [locale]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/news?locale=${locale}&all=true`);
      const data = await res.json();
      setArticles(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить статью? Это действие нельзя отменить.')) return;
    await fetch(`/api/news?id=${id}`, {method: 'DELETE'});
    fetchArticles();
  };

  const handleSave = async (data: Record<string, unknown>) => {
    if (editing) {
      await fetch('/api/news', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: editing.id, ...data}),
      });
    } else {
      await fetch('/api/news', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...data, locale}),
      });
    }
    setEditing(null);
    setCreating(false);
    fetchArticles();
  };

  const closeEditor = () => {
    setEditing(null);
    setCreating(false);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <i className="fas fa-spinner fa-spin mr-2" /> Загрузка…
      </div>
    );
  }
  if (!session) return null;

  if (creating || editing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={closeEditor}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                title="Назад"
              >
                <i className="fas fa-arrow-left" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-[#2a5298]">
                {editing ? 'Редактирование статьи' : 'Новая статья'}
              </h1>
            </div>
            <div className="text-xs text-gray-400 hidden sm:block">
              {LOCALE_LABEL[editing ? editing.locale : locale]}
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <NewsEditor article={editing} onSave={handleSave} onCancel={closeEditor} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <i className="fas fa-arrow-left" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-[#2a5298]">Управление новостями</h1>
          </div>
          <button
            onClick={() => setCreating(true)}
            className="bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
          >
            <i className="fas fa-plus mr-2" />
            <span className="hidden sm:inline">Создать статью</span>
            <span className="sm:hidden">Создать</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex gap-2 mb-6">
          {['ru', 'kz', 'en'].map((l) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                locale === l
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">
            <i className="fas fa-spinner fa-spin text-3xl" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
            <i className="fas fa-newspaper text-5xl mb-4 opacity-40" />
            <p className="text-lg">Нет статей на языке {locale.toUpperCase()}</p>
            <button
              onClick={() => setCreating(true)}
              className="mt-4 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i className="fas fa-plus mr-2" /> Создать первую
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 flex gap-3 sm:gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                  {article.imageUrl ? (
                    <img src={article.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <i className="fas fa-newspaper text-2xl text-blue-300" />
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        article.published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      <i
                        className={`fas ${
                          article.published ? 'fa-check-circle' : 'fa-clock'
                        } mr-1 text-[10px]`}
                      />
                      {article.published ? 'Опубликовано' : 'Черновик'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(article.createdAt).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-1">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-gray-500 text-xs sm:text-sm mt-1 line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-start">
                  <button
                    onClick={() => setEditing(article)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Редактировать"
                  >
                    <i className="fas fa-edit" />
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                    title="Удалить"
                  >
                    <i className="fas fa-trash" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
