'use client';

import {useEditMode} from '@/context/EditModeContext';
import {useState} from 'react';
import Image from 'next/image';

interface Props {
  contentKey: string;
  locale: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export default function EditableImage({contentKey, locale, src: initialSrc, alt, width, height, className = ''}: Props) {
  const {editMode} = useEditMode();
  const [src, setSrc] = useState(initialSrc);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialSrc);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await fetch('/api/admin/page-content', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({key: contentKey, locale, value: draft}),
    });
    setSrc(draft);
    setSaving(false);
    setEditing(false);
  };

  if (!editMode) {
    return <Image src={src} alt={alt} width={width} height={height} className={className} unoptimized />;
  }

  return (
    <div className="relative group">
      <Image src={src} alt={alt} width={width} height={height} className={`${className} outline-2 outline-dashed outline-orange-400 outline-offset-2`} unoptimized />
      {!editing && (
        <div
          onClick={() => setEditing(true)}
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded"
        >
          <span className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium">
            🖼️ Изменить изображение
          </span>
        </div>
      )}
      {editing && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-4 rounded z-50">
          <p className="text-white text-sm mb-2 font-medium">URL изображения (или /images/filename.jpg):</p>
          <input
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            autoFocus
            className="w-full p-2 rounded-lg text-sm mb-3 focus:outline-none"
            placeholder="https://... или /images/photo.jpg"
          />
          <div className="flex gap-2">
            <button onClick={save} disabled={saving} className="bg-orange-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50">
              {saving ? 'Сохранение...' : '✓ Сохранить'}
            </button>
            <button onClick={() => setEditing(false)} className="bg-gray-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium">
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
