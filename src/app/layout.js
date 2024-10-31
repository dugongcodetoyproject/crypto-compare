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
  title: '실시간 김치프리미엄 계산기 - 한국 가상화폐 프리미엄 비교',
  description: '한국의 업비트와 글로벌 거래소인 바이낸스의 실시간 가격을 비교하여 김치프리미엄을 계산하는 사이트입니다. 한국의 비트코인, 이더리움 등 가상화폐 가격 프리미엄을 확인하세요.',
  keywords: '김치프리미엄, 업비트, 바이낸스, 비트코인, 암호화폐, 실시간 시세, 코인 시세, 한국 프리미엄, 가상화폐 가격 비교, 실시간 김치프리미엄 계산',
  openGraph: {
    title: '실시간 김치프리미엄 계산기 - 한국 가상화폐 프리미엄 비교',
    description: '한국의 업비트와 글로벌 거래소인 바이낸스의 실시간 가격을 비교하여 김치프리미엄을 계산하는 사이트입니다. 한국의 비트코인, 이더리움 등 가상화폐 가격 프리미엄을 확인하세요.',
    url: 'https://kimchi-compare.vercel.app/',
    type: 'website',
    images: [
      {
        url: 'https://kimchi-compare.vercel.app/og-image.jpg', // 미리보기 이미지 URL
        width: 1200,
        height: 630,
        alt: '실시간 김치프리미엄 계산기 - 한국 가상화폐 프리미엄 비교',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@your_twitter_handle', // 자신의 트위터 핸들로 교체
    title: '실시간 김치프리미엄 계산기 - 한국 가상화폐 프리미엄 비교',
    description: '한국의 업비트와 바이낸스 가상화폐 가격 차이를 실시간으로 비교하여 김치프리미엄을 확인할 수 있습니다.',
    image: 'https://kimchi-compare.vercel.app/og-image.jpg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        <meta property="og:image:width" content={metadata.openGraph.images[0].width} />
        <meta property="og:image:height" content={metadata.openGraph.images[0].height} />
        <meta property="og:image:alt" content={metadata.openGraph.images[0].alt} />
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:site" content={metadata.twitter.site} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
        <meta name="twitter:image" content={metadata.twitter.image} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
