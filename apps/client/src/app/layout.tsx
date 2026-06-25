import type { Metadata } from 'next';
import './globals.css';

import { AppProviders } from './providers';

export const metadata: Metadata = {
  title: 'DONGCHIMI Client',
  description: 'DONGCHIMI client app',
  icons: {
    icon: '/favicon.svg',
  },
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang='ko'>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
};

export default RootLayout;
