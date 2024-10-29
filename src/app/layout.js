import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: '실시간 김치프리미엄 계산기',
  description: '업비트와 바이낸스의 실시간 가격을 비교하여 김치프리미엄을 계산합니다.',
  keywords: '김치프리미엄, 업비트, 바이낸스, 비트코인, 암호화폐, 실시간시세, 코인시세',
  openGraph: {
    title: '실시간 김치프리미엄 계산기',
    description: '업비트와 바이낸스의 실시간 가격을 비교하여 김치프리미엄을 계산합니다.',
    url: 'https://kimchi-compare.vercel.app/',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}