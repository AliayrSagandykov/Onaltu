import {auth} from '@/lib/auth';
import {redirect} from 'next/navigation';
import Link from 'next/link';
import {prisma} from '@/lib/prisma';
import AdminSignOut from '@/components/AdminSignOut';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await auth();
  if (!session) redirect('/admin/login');

  let articleCount = 0;
  try {
    articleCount = await prisma.article.count();
  } catch {
    // DB not yet initialized
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#2a5298]">
            <i className="fas fa-cog mr-2" />
            ONALTU Admin
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              <i className="fas fa-user mr-1" /> {session.user?.email}
            </span>
            <AdminSignOut />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* News management */}
          <Link href="/admin/news" className="bg-white rounded-xl shadow-md p-8 hover:-translate-y-1 hover:shadow-lg transition-all group">
            <div className="text-4xl text-blue-500 mb-4">
              <i className="fas fa-newspaper" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600">Управление новостями</h2>
            <p className="text-gray-500">Создание, редактирование и публикация новостей</p>
            <div className="mt-4 text-3xl font-bold text-blue-600">{articleCount}</div>
            <div className="text-sm text-gray-400">статей в базе</div>
          </Link>

          {/* Quick stats */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="text-4xl text-green-500 mb-4">
              <i className="fas fa-globe" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Мультиязычность</h2>
            <p className="text-gray-500">Сайт доступен на 3 языках</p>
            <div className="flex gap-2 mt-4">
              {['RU', 'KZ', 'EN'].map((lang) => (
                <span key={lang} className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">{lang}</span>
              ))}
            </div>
          </div>

          {/* Visual editor */}
          <Link href="/admin/editor" className="bg-white rounded-xl shadow-md p-8 hover:-translate-y-1 hover:shadow-lg transition-all group">
            <div className="text-4xl text-green-500 mb-4">
              <i className="fas fa-paint-brush" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600">Визуальный редактор</h2>
            <p className="text-gray-500">Редактировать текст и изображения прямо на сайте</p>
          </Link>

          {/* Admin users */}
          <Link href="/admin/users" className="bg-white rounded-xl shadow-md p-8 hover:-translate-y-1 hover:shadow-lg transition-all group">
            <div className="text-4xl text-orange-500 mb-4">
              <i className="fas fa-users-cog" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600">Администраторы</h2>
            <p className="text-gray-500">Добавление и удаление администраторов</p>
          </Link>

          {/* Site link */}
          <Link href="/ru" className="bg-white rounded-xl shadow-md p-8 hover:-translate-y-1 hover:shadow-lg transition-all group">
            <div className="text-4xl text-purple-500 mb-4">
              <i className="fas fa-external-link-alt" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600">Перейти на сайт</h2>
            <p className="text-gray-500">Открыть главную страницу сайта</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
