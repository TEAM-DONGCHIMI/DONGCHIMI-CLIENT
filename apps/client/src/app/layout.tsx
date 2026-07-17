import type { Metadata, Viewport } from 'next';
import '@dongchimi/design-system/styles/reset.css';
import '@dongchimi/design-system/styles/fonts.css';
import './globals.css';

import { AppProviders } from './providers';

export const SITE_URL = 'https://app.dongchiimi.com';
export const SITE_TITLE = '동치미';
export const SITE_DESCRIPTION = '우리 동네 마트 오늘 할인 정보, 마트 가기 전에 먼저 확인하세요.';

const OG_IMAGE = {
  url: '/images/og-image.png',
  width: 3200,
  height: 1600,
  alt: '동네 마트의 특가 전단을 동치미에서 받아 보세요',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_TITLE,
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: SITE_TITLE,
  },
  icons: {
    icon: '/favicon.svg',
    apple: [
      {
        url: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#FFFFFF',
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang='ko'>
      <body>
        <div className='client-app-shell'>
          <AppProviders>{children}</AppProviders>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
