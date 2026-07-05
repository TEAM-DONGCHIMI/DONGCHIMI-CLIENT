import { type ReactNode } from 'react';
import { OverlayProvider } from 'overlay-kit';

import { QueryProvider } from '@/shared/query';

type AppProvidersProps = Readonly<{
  children: ReactNode;
}>;

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <OverlayProvider>
      <QueryProvider>{children}</QueryProvider>
    </OverlayProvider>
  );
};
