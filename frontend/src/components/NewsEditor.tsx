'use client';

import {useState} from 'react';
import RichTextEditor from './RichTextEditor';
import ImageUploader from './ImageUploader';

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
  onSave: (data: Record<string, unknown>) => Promise<void> | void;
  onCancel: () => void;
}

export default function NewsEditor({article, onSave, onCancel}: Props) {
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  const [excerpt, setExcerpt] = useState(article?.excerpt || '');
  const [imageUrl, setImageUrl] = useState<string | null>(article?.imageUrl || null);
  const [published, setPublished] = useState(article?.published || false);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      await onSave({
        title,
        content,
        excerpt,
        imageUrl,
        published,
        ...(article ? {} : {autoTranslate}),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Заголовок <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Например: Открытие нового реабилитационного центра"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Краткое описание
        </label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="1–2 предложения, которые увидят в карточке новости"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 min-h-[80px] resize-y"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Обложка новости
        </label>
        <ImageUploader value={imageUrl} onChange={setImageUrl} label="Загрузите обложку" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Текст статьи <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          <i className="fas fa-info-circle mr-1 text-blue-500" />
          Чтобы добавить фото внутрь статьи — нажмите кнопку{' '}
          <span className="font-medium">🖼️ Фото</span> в панели редактора.
        </p>
        <RichTextEditor content={content} onChange={setContent} />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            Опубликовать сразу после сохранения
          </span>
        </label>
        {!article && (
          <label className="flex items-center gap-3 cursor-pointer pt-3 border-t border-gray-100">
            <input
              type="checkbox"
              checked={autoTranslate}
              onChange={(e) => setAutoTranslate(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              <i className="fas fa-language mr-1.5 text-blue-600" />
              Автоматически перевести на другие языки (RU&nbsp;↔&nbsp;KZ&nbsp;↔&nbsp;EN)
            </span>
          </label>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-wait flex items-center"
        >
          {saving ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2" /> Сохраняем...
            </>
          ) : (
            <>
              <i className="fas fa-save mr-2" /> Сохранить
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-60"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
