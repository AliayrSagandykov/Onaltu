'use client';

import {signOut} from 'next-auth/react';

export default function AdminSignOut() {
  return (
    <button
      onClick={() => signOut({callbackUrl: '/admin/login'})}
      className="text-red-500 hover:text-red-700 font-medium transition-colors"
    >
      <i className="fas fa-sign-out-alt mr-1" /> Выйти
    </button>
  );
}
