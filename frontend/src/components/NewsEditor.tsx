'use client';

import {useState} from 'react';
import RichTextEditor from './RichTextEditor';

interface Article {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  imageUrl: string | null;
  published: boolean;
}

interface Props {
  article: Article | null;
  onSave: (data: Partial<Article>) => void;
  onCancel: () => void;
}

export default function NewsEditor({article, onSave, onCancel}: Props) {
  const [title, setTitle] = useState(article?.title || '');
  const [slug, setSlug] = useState(article?.slug || '');
  const [content, setContent] = useState(article?.content || '');
  const [excerpt, setExcerpt] = useState(article?.excerpt || '');
  const [imageUrl, setImageUrl] = useState(article?.imageUrl || '');
  const [published, setPublished] = useState(article?.published || false);

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!article) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({title, slug, content, excerpt, imageUrl: imageUrl || null, published});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Заголовок</label>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">URL (slug)</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-mono text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Краткое описание</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 min-h-[80px]"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">URL изображения</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Содержание</label>
        <RichTextEditor content={content} onChange={setContent} />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="w-5 h-5 text-blue-600 rounded"
        />
        <label htmlFor="published" className="text-sm font-medium text-gray-700">
          Опубликовать
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          <i className="fas fa-save mr-2" /> Сохранить
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
