import { type ReactNode } from 'react';
import { ToastProvider } from '@dongchimi/shared/toast';
import { OverlayProvider } from 'overlay-kit';

import { QueryProvider } from '@/shared/query';

type AppProvidersProps = Readonly<{
  children: ReactNode;
}>;

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <QueryProvider>
      <ToastProvider offset='2.4rem' placement='top-right'>
        <OverlayProvider>{children}</OverlayProvider>
      </ToastProvider>
    </QueryProvider>
  );
};
