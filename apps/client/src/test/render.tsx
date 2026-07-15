import { QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import { ToastProvider } from '@dongchimi/shared/toast';
import type { ReactElement, ReactNode } from 'react';

import { createQueryClient } from '@/shared/query';

type TestRenderOptionsTypes = Omit<RenderOptions, 'wrapper'> & {
  queryClient?: ReturnType<typeof createQueryClient>;
};

type TestRenderResultTypes = RenderResult & {
  queryClient: ReturnType<typeof createQueryClient>;
};

export const renderWithProviders = (
  ui: ReactElement,
  { queryClient = createQueryClient(), ...renderOptions }: TestRenderOptionsTypes = {},
): TestRenderResultTypes => {
  const Wrapper = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
      <QueryClientProvider client={queryClient}>
        <ToastProvider placement='bottom-center'>{children}</ToastProvider>
      </QueryClientProvider>
    );
  };

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
};

export * from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';
