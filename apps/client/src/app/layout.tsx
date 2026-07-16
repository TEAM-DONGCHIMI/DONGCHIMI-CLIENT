import type { Metadata, Viewport } from 'next';
import '@dongchimi/design-system/styles/reset.css';
import '@dongchimi/design-system/styles/fonts.css';
import './globals.css';

import { AppProviders } from './providers';

export const metadata: Metadata = {
  applicationName: '동치미',
  title: '동치미',
  description: '동치미 모바일 웹',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '동치미',
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
