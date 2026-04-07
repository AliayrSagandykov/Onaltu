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

export default function AdminNewsPage() {
  const {data: session, status} = useSession();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [editing, setEditing] = useState<Article | null>(null);
  const [creating, setCreating] = useState(false);
  const [locale, setLocale] = useState('ru');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  useEffect(() => {
    fetchArticles();
  }, [locale]);

  const fetchArticles = async () => {
    const res = await fetch(`/api/news?locale=${locale}&all=true`);
    const data = await res.json();
    setArticles(data);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить статью?')) return;
    await fetch(`/api/news?id=${id}`, {method: 'DELETE'});
    fetchArticles();
  };

  const handleSave = async (data: Partial<Article>) => {
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

  if (status === 'loading') return <div className="p-10 text-center">Загрузка...</div>;
  if (!session) return null;

  if (creating || editing) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#2a5298]">
              {editing ? 'Редактирование статьи' : 'Новая статья'}
            </h1>
            <button onClick={() => { setEditing(null); setCreating(false); }} className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-times text-xl" />
            </button>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-6 py-10">
          <NewsEditor article={editing} onSave={handleSave} onCancel={() => { setEditing(null); setCreating(false); }} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-arrow-left" />
            </Link>
            <h1 className="text-2xl font-bold text-[#2a5298]">Управление новостями</h1>
          </div>
          <button
            onClick={() => setCreating(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-plus mr-2" /> Создать статью
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Locale filter */}
        <div className="flex gap-2 mb-6">
          {['ru', 'kz', 'en'].map((l) => (
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

        {/* Articles list */}
        {articles.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <i className="fas fa-newspaper text-5xl mb-4" />
            <p className="text-lg">Нет статей на языке {locale.toUpperCase()}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-sm p-6 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      article.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {article.published ? 'Опубликовано' : 'Черновик'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(article.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{article.title}</h3>
                  {article.excerpt && <p className="text-gray-500 text-sm mt-1">{article.excerpt}</p>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(article)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                    title="Редактировать"
                  >
                    <i className="fas fa-edit" />
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="text-red-500 hover:text-red-700 p-2"
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
