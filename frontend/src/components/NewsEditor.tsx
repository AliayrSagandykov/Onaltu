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
  images?: string[];
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
  const [images, setImages] = useState<string[]>(article?.images || []);
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
    const cleanImages = images.map((s) => s.trim()).filter(Boolean);
    onSave({
      title,
      slug,
      content,
      excerpt,
      imageUrl: imageUrl || null,
      images: cleanImages,
      published,
      autoTranslate: !article ? autoTranslate : undefined,
    });
  };

  const addImage = () => setImages([...images, '']);
  const removeImage = (idx: number) => setImages(images.filter((_, i) => i !== idx));
  const updateImage = (idx: number, value: string) =>
    setImages(images.map((u, i) => (i === idx ? value : u)));

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
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-gray-700">
            Дополнительные фотографии ({images.length})
          </label>
          <button
            type="button"
            onClick={addImage}
            className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100"
          >
            <i className="fas fa-plus mr-1" /> Добавить фото
          </button>
        </div>
        {images.length === 0 ? (
          <p className="text-sm text-gray-400 italic">Нет дополнительных фотографий</p>
        ) : (
          <div className="space-y-2">
            {images.map((url, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <span className="text-xs text-gray-400 w-6 text-center">{idx + 1}</span>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => updateImage(idx, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="https://... или /images/photo.jpg"
                />
                {url && (
                  <img
                    src={url}
                    alt=""
                    className="w-12 h-12 object-cover rounded border border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="text-red-500 hover:text-red-700 px-2"
                  title="Удалить"
                >
                  <i className="fas fa-trash" />
                </button>
              </div>
            ))}
          </div>
        )}
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
