'use client';

import { type ReactNode } from 'react';
import { ToastProvider } from '@dongchimi/shared/toast';
import { OverlayProvider } from 'overlay-kit';

import { QueryProvider } from '@/shared/query';
import { PwaInstallProvider } from '@/shared/pwa';

type AppProvidersProps = Readonly<{
  children: ReactNode;
}>;

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <QueryProvider>
      <PwaInstallProvider>
        <ToastProvider placement='bottom-center'>
          <OverlayProvider>{children}</OverlayProvider>
        </ToastProvider>
      </PwaInstallProvider>
    </QueryProvider>
  );
};
