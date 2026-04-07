import '../globals.css';
import SessionProvider from '@/components/SessionProvider';

export default function AdminLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ru">
      <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-gray-100" style={{fontFamily: '"Segoe UI", sans-serif'}}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
