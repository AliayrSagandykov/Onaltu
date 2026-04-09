'use client';

import {createContext, useContext, useState} from 'react';

const EditModeContext = createContext<{
  editMode: boolean;
  setEditMode: (v: boolean) => void;
}>({editMode: false, setEditMode: () => {}});

export function EditModeProvider({children}: {children: React.ReactNode}) {
  const [editMode, setEditMode] = useState(false);
  return (
    <EditModeContext.Provider value={{editMode, setEditMode}}>
      {children}
    </EditModeContext.Provider>
  );
}

export const useEditMode = () => useContext(EditModeContext);
