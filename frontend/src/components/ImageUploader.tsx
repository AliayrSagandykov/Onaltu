'use client';

import {useRef, useState} from 'react';
import {compressImage} from '@/lib/compressImage';

interface Props {
  value?: string | null;
  onChange: (dataUrl: string | null) => void;
  label?: string;
  maxWidth?: number;
  quality?: number;
}

export default function ImageUploader({
  value,
  onChange,
  label = 'Загрузите фото',
  maxWidth = 1400,
  quality = 0.85,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Можно загружать только изображения');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('Файл слишком большой (макс. 20 МБ)');
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const dataUrl = await compressImage(file, maxWidth, quality);
      onChange(dataUrl);
    } catch (e) {
      setError((e as Error).message || 'Не удалось обработать изображение');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => !uploading && !value && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl transition-all overflow-hidden ${
          dragOver
            ? 'border-blue-500 bg-blue-50'
            : value
              ? 'border-gray-200 bg-gray-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/40 cursor-pointer'
        }`}
      >
        {value ? (
          <div className="relative">
            <img
              src={value}
              alt="Предпросмотр"
              className="w-full max-h-72 object-contain bg-gray-100"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                className="bg-white/95 backdrop-blur text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm hover:bg-white transition-colors"
              >
                <i className="fas fa-redo-alt mr-1.5 text-gray-500" />
                Заменить
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
                className="bg-white/95 backdrop-blur text-red-600 text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm hover:bg-red-50 transition-colors"
              >
                <i className="fas fa-trash mr-1.5" />
                Удалить
              </button>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 text-2xl mb-3">
              <i className="fas fa-cloud-upload-alt" />
            </div>
            <p className="text-sm font-semibold text-gray-700">{label}</p>
            <p className="text-xs text-gray-500 mt-1">
              Перетащите файл сюда или нажмите для выбора
            </p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, до 20 МБ</p>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-sm flex items-center justify-center">
            <div className="flex items-center gap-2 text-blue-600 font-medium">
              <i className="fas fa-spinner fa-spin" /> Обработка...
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-600 mt-2">
          <i className="fas fa-exclamation-circle mr-1" />
          {error}
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}
