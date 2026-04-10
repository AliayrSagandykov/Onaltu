'use client';

import {useEditMode} from '@/context/EditModeContext';
import {useSearchParams} from 'next/navigation';

export default function EditModeBar() {
  const {editMode} = useEditMode();
  const searchParams = useSearchParams();
  const isAdminEdit = searchParams.get('__adminEdit') === '1';

  if (!isAdminEdit || !editMode) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-blue-600 text-white text-sm px-6 py-2 flex items-center justify-center gap-3 shadow-lg">
      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      <span>Режим редактирования активен — нажмите на любой выделенный элемент для изменения</span>
    </div>
  );
}
