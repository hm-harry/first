import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'First Main',
  description: 'First Main - Full Stack Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
