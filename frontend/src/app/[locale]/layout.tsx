import {NextIntlClientProvider} from 'next-intl';
import {routing} from '@/i18n/routing';
import {notFound} from 'next/navigation';
import {Suspense} from 'react';
import "../globals.css";
import SessionProvider from '@/components/SessionProvider';
import {EditModeProvider} from '@/context/EditModeContext';
import EditModeBar from '@/components/EditModeBar';
import EditModeInitializer from '@/components/EditModeInitializer';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!routing.locales.includes(locale as 'ru' | 'kz' | 'en')) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" type="image/png" href="/images/onaltu_logo.png" />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col" style={{fontFamily: '"Segoe UI", sans-serif'}}>
        <SessionProvider>
          <EditModeProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <Suspense fallback={null}>
                <EditModeInitializer />
                <EditModeBar />
              </Suspense>
              {children}
            </NextIntlClientProvider>
          </EditModeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
