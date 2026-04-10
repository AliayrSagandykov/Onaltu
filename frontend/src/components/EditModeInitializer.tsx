'use client';

import {useEffect} from 'react';
import {useSearchParams} from 'next/navigation';
import {useSession} from 'next-auth/react';
import {useEditMode} from '@/context/EditModeContext';

export default function EditModeInitializer() {
  const searchParams = useSearchParams();
  const {data: session} = useSession();
  const {setEditMode} = useEditMode();

  useEffect(() => {
    if (searchParams.get('__adminEdit') === '1' && session) {
      setEditMode(true);
    } else {
      setEditMode(false);
    }
  }, [searchParams, session, setEditMode]);

  return null;
}
