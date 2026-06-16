'use client';

import {useState} from 'react';
import RichTextEditor from './RichTextEditor';
import ImageUploader from './ImageUploader';

interface Article {
  id: string;
  slug: string;
  locale?: string;
  title: string;
  content: string;
  excerpt: string | null;
  imageUrl: string | null;
  published: boolean;
}

interface Props {
  article: Article | null;
  sourceLocale: string;
  onSave: (data: Record<string, unknown>) => Promise<Article>;
  onDone: () => void;
  onCancel: () => void;
}

const LOCALE_LABEL: Record<string, string> = {
  ru: 'русский',
  kz: 'қазақша',
  en: 'английский',
};

const LOCALE_BADGE: Record<string, string> = {
  ru: 'RU',
  kz: 'KZ',
  en: 'EN',
};

const ALL_LOCALES = ['ru', 'kz', 'en'] as const;

type Phase =
  | {kind: 'idle'}
  | {kind: 'saving'}
  | {kind: 'translating'; target: string}
  | {kind: 'done'}
  | {kind: 'error'; message: string};

type TranslationStatus = 'pending' | 'running' | 'success' | 'failed';

export default function NewsEditor({article, sourceLocale, onSave, onDone, onCancel}: Props) {
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  const [excerpt, setExcerpt] = useState(article?.excerpt || '');
  const [imageUrl, setImageUrl] = useState<string | null>(article?.imageUrl || null);
  const [published, setPublished] = useState(article?.published || false);
  const [autoTranslate, setAutoTranslate] = useState(true);

  const [phase, setPhase] = useState<Phase>({kind: 'idle'});
  const [translations, setTranslations] = useState<Record<string, TranslationStatus>>({});

  const isCreate = !article;
  const targets = ALL_LOCALES.filter((l) => l !== sourceLocale);

  const busy = phase.kind === 'saving' || phase.kind === 'translating';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;

    setPhase({kind: 'saving'});
    setTranslations({});

    let saved: Article;
    try {
      saved = await onSave({
        title,
        content,
        excerpt,
        imageUrl,
        published,
      });
    } catch (err) {
      setPhase({
        kind: 'error',
        message: (err as Error).message || 'Не удалось сохранить статью',
      });
      return;
    }

    if (isCreate && autoTranslate && targets.length > 0) {
      const initial: Record<string, TranslationStatus> = {};
      targets.forEach((t) => {
        initial[t] = 'pending';
      });
      setTranslations(initial);

      for (const target of targets) {
        setPhase({kind: 'translating', target});
        setTranslations((prev) => ({...prev, [target]: 'running'}));
        try {
          const res = await fetch('/api/news/translate', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({sourceId: saved.id, targetLocale: target}),
          });
          setTranslations((prev) => ({
            ...prev,
            [target]: res.ok ? 'success' : 'failed',
          }));
        } catch {
          setTranslations((prev) => ({...prev, [target]: 'failed'}));
        }
      }
    }

    setPhase({kind: 'done'});
    setTimeout(() => onDone(), 500);
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
          disabled={busy}
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
          disabled={busy}
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
            disabled={busy}
          />
          <span className="text-sm font-medium text-gray-700">
            Опубликовать сразу после сохранения
          </span>
        </label>
        {isCreate && (
          <label className="flex items-center gap-3 cursor-pointer pt-3 border-t border-gray-100">
            <input
              type="checkbox"
              checked={autoTranslate}
              onChange={(e) => setAutoTranslate(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded"
              disabled={busy}
            />
            <span className="text-sm font-medium text-gray-700">
              <i className="fas fa-language mr-1.5 text-blue-600" />
              Автоматически перевести на другие языки (
              {targets.map((t, i) => (
                <span key={t}>
                  {i > 0 && ', '}
                  <span className="font-mono">{LOCALE_BADGE[t]}</span>
                </span>
              ))}
              )
            </span>
          </label>
        )}
      </div>

      {(phase.kind === 'translating' || phase.kind === 'done' || Object.keys(translations).length > 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
          <div className="text-sm font-semibold text-blue-900 mb-1">
            <i className="fas fa-language mr-2" />
            Переводы
          </div>
          {targets.map((t) => {
            const s = translations[t];
            return (
              <div key={t} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">
                  <span className="inline-block font-mono bg-white border border-gray-200 rounded px-1.5 py-0.5 text-xs mr-2">
                    {LOCALE_BADGE[t]}
                  </span>
                  {LOCALE_LABEL[t]}
                </span>
                <span>
                  {s === 'pending' && (
                    <span className="text-gray-400">
                      <i className="fas fa-clock mr-1" /> в очереди
                    </span>
                  )}
                  {s === 'running' && (
                    <span className="text-blue-600 font-medium">
                      <i className="fas fa-spinner fa-spin mr-1" /> переводим…
                    </span>
                  )}
                  {s === 'success' && (
                    <span className="text-green-600 font-medium">
                      <i className="fas fa-check mr-1" /> готово
                    </span>
                  )}
                  {s === 'failed' && (
                    <span className="text-red-600 font-medium">
                      <i className="fas fa-times mr-1" /> ошибка
                    </span>
                  )}
                  {!s && <span className="text-gray-300">—</span>}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex gap-3 pt-2 items-center">
        <button
          type="submit"
          disabled={busy}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-wait flex items-center"
        >
          {phase.kind === 'saving' && (
            <>
              <i className="fas fa-spinner fa-spin mr-2" /> Сохраняем…
            </>
          )}
          {phase.kind === 'translating' && (
            <>
              <i className="fas fa-spinner fa-spin mr-2" /> Переводим на{' '}
              {LOCALE_LABEL[phase.target]}…
            </>
          )}
          {phase.kind === 'done' && (
            <>
              <i className="fas fa-check mr-2" /> Готово
            </>
          )}
          {(phase.kind === 'idle' || phase.kind === 'error') && (
            <>
              <i className="fas fa-save mr-2" /> Сохранить
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-60"
        >
          Отмена
        </button>
        {phase.kind === 'error' && (
          <span className="text-sm text-red-600">
            <i className="fas fa-exclamation-circle mr-1" />
            {phase.message}
          </span>
        )}
      </div>
    </form>
  );
}
