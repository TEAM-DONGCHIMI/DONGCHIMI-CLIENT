'use client';

import { type ReactNode } from 'react';

import { QueryProvider } from '@/shared/query';

type AppProvidersProps = Readonly<{
  children: ReactNode;
}>;

export const AppProviders = ({ children }: AppProvidersProps) => {
  return <QueryProvider>{children}</QueryProvider>;
};
