import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "ONALTU - Национальная Ассоциация Реабилитационных Центров",
  description: "Объединение реабилитационных центров Казахстана",
  icons: {
    icon: '/images/onaltu_logo.png',
    shortcut: '/images/onaltu_logo.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
