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
  onSave: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}

export default function NewsEditor({article, onSave, onCancel}: Props) {
  const [title, setTitle] = useState(article?.title || '');
  const [slug, setSlug] = useState(article?.slug || '');
  const [content, setContent] = useState(article?.content || '');
  const [excerpt, setExcerpt] = useState(article?.excerpt || '');
  const [imageUrl, setImageUrl] = useState(article?.imageUrl || '');
  const [published, setPublished] = useState(article?.published || false);
  const [autoTranslate, setAutoTranslate] = useState(true);

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!article) setSlug(generateSlug(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      slug,
      content,
      excerpt,
      imageUrl: imageUrl || null,
      published,
      autoTranslate: !article ? autoTranslate : undefined,
    });
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
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Главное изображение (обложка)
        </label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="https://... или /images/photo.jpg"
        />
        {imageUrl && (
          <img
            src={imageUrl}
            alt=""
            className="mt-3 w-40 h-24 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Содержание
        </label>
        <p className="text-xs text-gray-500 mb-2">
          💡 Чтобы добавить несколько фото в новость — нажмите кнопку 🖼️ Фото в панели редактора и вставьте URL.
        </p>
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

      {!article && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <input
            type="checkbox"
            id="autoTranslate"
            checked={autoTranslate}
            onChange={(e) => setAutoTranslate(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded"
          />
          <label htmlFor="autoTranslate" className="text-sm font-medium text-gray-700">
            <i className="fas fa-language mr-1.5 text-blue-600" />
            Автоматически перевести на другие языки (RU ↔ KZ ↔ EN)
          </label>
        </div>
      )}

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
