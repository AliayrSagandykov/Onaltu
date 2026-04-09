'use client';

import {useSession} from 'next-auth/react';
import {useEditMode} from '@/context/EditModeContext';
import Link from 'next/link';

export default function EditModeBar() {
  const {data: session} = useSession();
  const {editMode, setEditMode} = useEditMode();

  if (!session) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between px-6 py-2 text-sm transition-all ${
      editMode ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-100'
    }`}>
      <div className="flex items-center gap-3">
        <i className="fas fa-pencil-alt" />
        {editMode ? (
          <span className="font-medium">Режим редактирования — нажмите на любой выделенный элемент</span>
        ) : (
          <span>Вы вошли как администратор</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setEditMode(!editMode)}
          className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
            editMode
              ? 'bg-white text-blue-600 hover:bg-blue-50'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {editMode ? 'Выйти из редактора' : '✏️ Редактировать страницу'}
        </button>
        <Link href="/admin" className="px-4 py-1 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
          Панель управления
        </Link>
      </div>
    </div>
  );
}
