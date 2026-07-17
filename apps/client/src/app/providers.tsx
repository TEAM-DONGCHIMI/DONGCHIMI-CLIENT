'use client';

import { type ReactNode } from 'react';
import { ToastProvider } from '@dongchimi/shared/toast';
import { OverlayProvider } from 'overlay-kit';

import { AuthRequiredRedirectHandler } from '@/shared/auth/AuthRequiredRedirectHandler';
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
          <AuthRequiredRedirectHandler />
          <OverlayProvider>{children}</OverlayProvider>
        </ToastProvider>
      </PwaInstallProvider>
    </QueryProvider>
  );
};
