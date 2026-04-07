import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ONALTU - Национальная Ассоциация Реабилитационных Центров",
  description: "Объединение реабилитационных центров Казахстана",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
