'use client';

import {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const {data: session, status} = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [creating, setCreating] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users');
    if (res.ok) setUsers(await res.json());
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password, name}),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Error creating user');
    } else {
      setCreating(false);
      setEmail('');
      setPassword('');
      setName('');
      fetchUsers();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, userEmail: string) => {
    if (!confirm(`Удалить администратора ${userEmail}?`)) return;
    const res = await fetch(`/api/admin/users?id=${id}`, {method: 'DELETE'});
    const data = await res.json();
    if (!res.ok) {
      alert(data.error);
    } else {
      fetchUsers();
    }
  };

  if (status === 'loading') return <div className="p-10 text-center">Загрузка...</div>;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-arrow-left" />
            </Link>
            <h1 className="text-2xl font-bold text-[#2a5298]">
              <i className="fas fa-users-cog mr-2" />
              Управление администраторами
            </h1>
          </div>
          <button
            onClick={() => { setCreating(true); setError(''); }}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-plus mr-2" /> Добавить администратора
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">

        {/* Create form */}
        {creating && (
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Новый администратор</h2>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
            )}
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Имя (необязательно)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Имя администратора"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Пароль</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Минимум 6 символов"
                  minLength={6}
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Создание...' : <><i className="fas fa-save mr-2" />Создать</>}
                </button>
                <button
                  type="button"
                  onClick={() => { setCreating(false); setError(''); }}
                  className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users list */}
        <div className="space-y-3">
          {users.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <i className="fas fa-users text-5xl mb-4" />
              <p>Нет администраторов</p>
            </div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="bg-white rounded-lg shadow-sm p-5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {(user.name || user.email)[0].toUpperCase()}
                  </div>
                  <div>
                    {user.name && <div className="font-semibold text-gray-800">{user.name}</div>}
                    <div className="text-gray-500 text-sm">{user.email}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Добавлен: {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                    {user.role}
                  </span>
                  {user.email === session.user?.email ? (
                    <span className="text-xs text-gray-400 px-2">вы</span>
                  ) : (
                    <button
                      onClick={() => handleDelete(user.id, user.email)}
                      className="text-red-500 hover:text-red-700 p-2 transition-colors"
                      title="Удалить"
                    >
                      <i className="fas fa-trash" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
