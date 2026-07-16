'use client';

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
      <ToastProvider placement='top-center'>
        <OverlayProvider>{children}</OverlayProvider>
      </ToastProvider>
    </QueryProvider>
  );
};
