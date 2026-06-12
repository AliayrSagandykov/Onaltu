'use client';

import {useEditor, EditorContent} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import {useEffect, useRef, useState} from 'react';
import {compressImage} from '@/lib/compressImage';

interface Props {
  content: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({content, onChange}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({HTMLAttributes: {class: 'article-inline-image'}}),
    ],
    content,
    onUpdate: ({editor}) => onChange(editor.getHTML()),
  });

  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content]);

  if (!editor) return null;

  const btn = (active: boolean) =>
    `px-2 py-1 rounded text-sm font-medium border transition-colors ${
      active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
    }`;

  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 20 * 1024 * 1024) {
      alert('Файл слишком большой (макс. 20 МБ)');
      return;
    }
    setUploading(true);
    try {
      const dataUrl = await compressImage(file, 1200, 0.82);
      editor.chain().focus().setImage({src: dataUrl}).run();
    } catch (e) {
      console.error(e);
      alert('Не удалось загрузить изображение');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="tiptap-editor">
      <div className="flex flex-wrap gap-1 pb-3 mb-3 border-b border-gray-200">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))}>
          <b>B</b>
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))}>
          <i>I</i>
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={btn(editor.isActive('strike'))}>
          <s>S</s>
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()} className={btn(editor.isActive('heading', {level: 2}))}>
          H2
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()} className={btn(editor.isActive('heading', {level: 3}))}>
          H3
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive('bulletList'))}>
          • Список
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive('orderedList'))}>
          1. Список
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive('blockquote'))}>
          &ldquo; Цитата
        </button>
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btn(false)}>
          ─ Линия
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          disabled={uploading}
          className={`${btn(false)} disabled:opacity-60 disabled:cursor-wait`}
          title="Загрузить фото в текст"
        >
          {uploading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-1" /> Загрузка
            </>
          ) : (
            <>🖼️ Фото</>
          )}
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btn(false)}>
          ↩ Отменить
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btn(false)}>
          ↪ Повторить
        </button>
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageFile(file);
          e.target.value = '';
        }}
      />

      <EditorContent editor={editor} />
    </div>
  );
}
