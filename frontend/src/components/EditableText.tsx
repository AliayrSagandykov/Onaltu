'use client';

import {useEditMode} from '@/context/EditModeContext';
import {useState, useRef, useEffect} from 'react';

interface Props {
  contentKey: string;
  locale: string;
  value: string;
  className?: string;
  multiline?: boolean;
  tag?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
  id?: string;
}

export default function EditableText({contentKey, locale, value: initialValue, className = '', multiline = false, tag: Tag = 'p', id}: Props) {
  const {editMode} = useEditMode();
  const [value, setValue] = useState(initialValue);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setValue(initialValue);
    setDraft(initialValue);
  }, [initialValue]);

  const save = async () => {
    setSaving(true);
    await fetch('/api/admin/page-content', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({key: contentKey, locale, value: draft}),
    });
    setValue(draft);
    setSaving(false);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  if (!editMode) {
    return <Tag className={className} id={id}>{value}</Tag>;
  }

  if (editing) {
    return (
      <div className="relative my-1">
        {multiline ? (
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            autoFocus
            rows={4}
            className="w-full p-3 border-2 border-blue-500 rounded-lg resize-y text-base focus:outline-none bg-white text-gray-800"
          />
        ) : (
          <input
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            autoFocus
            className="w-full p-3 border-2 border-blue-500 rounded-lg text-base focus:outline-none bg-white text-gray-800"
          />
        )}
        <div className="flex gap-2 mt-2">
          <button onClick={save} disabled={saving} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Сохранение...' : '✓ Сохранить'}
          </button>
          <button onClick={cancel} className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-300">
            Отмена
          </button>
        </div>
      </div>
    );
  }

  return (
    <Tag
      className={`${className} relative outline-2 outline-dashed outline-blue-400 outline-offset-2 cursor-pointer hover:outline-blue-600 hover:bg-blue-50/30 rounded transition-all group`}
      onClick={() => setEditing(true)}
      id={id}
    >
      {value}
      <span className="absolute -top-7 left-0 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        ✏️ Нажмите для редактирования
      </span>
      {saved && (
        <span className="absolute -top-7 right-0 bg-green-600 text-white text-xs px-2 py-1 rounded">✓ Сохранено</span>
      )}
    </Tag>
  );
}
