import type { Metadata } from 'next';
import '@dongchimi/design-system/styles/reset.css';
import '@dongchimi/design-system/styles/fonts.css';
import './globals.css';

import { AppProviders } from './providers';

export const metadata: Metadata = {
  title: '동치미',
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
        <div className='client-app-shell'>
          <AppProviders>{children}</AppProviders>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
