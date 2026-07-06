import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '@/test';

import { Boundary } from './Boundary';

const SuspendedContent = () => {
  throw new Promise(() => undefined);
};

const BrokenContent = () => {
  throw new Error('route render failed');
};

const RecoverableContent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('route render failed');
  }

  return <p>복구된 화면</p>;
};

const muteReactError = () => {
  return vi.spyOn(console, 'error').mockImplementation(() => undefined);
};

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        throwOnError: true,
      },
    },
  });
};

describe('Boundary', () => {
  it('renders children when no route boundary state is active', () => {
    render(
      <Boundary>
        <p>라우트 화면</p>
      </Boundary>,
    );

    expect(screen.getByText('라우트 화면')).toBeInTheDocument();
  });

  it('renders the loading fallback while children suspend', () => {
    render(
      <Boundary>
        <SuspendedContent />
      </Boundary>,
    );

    expect(screen.getByRole('status')).toHaveTextContent('화면을 불러오는 중입니다.');
  });

  it('renders an accessible error fallback when children throw', () => {
    const consoleError = muteReactError();

    render(
      <Boundary>
        <BrokenContent />
      </Boundary>,
    );

    expect(
      screen.getByRole('heading', { name: '화면을 불러오지 못했습니다.' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument();

    consoleError.mockRestore();
  });

  it('resets the error boundary through a custom fallback action', async () => {
    const consoleError = muteReactError();
    const user = userEvent.setup();

    const BoundaryResetExample = () => {
      const [shouldThrow, setShouldThrow] = useState(true);

      return (
        <Boundary
          errorFallback={({ resetErrorBoundary }) => (
            <button
              onClick={() => {
                setShouldThrow(false);
                resetErrorBoundary();
              }}
              type='button'
            >
              다시 불러오기
            </button>
          )}
        >
          <RecoverableContent shouldThrow={shouldThrow} />
        </Boundary>
      );
    };

    render(<BoundaryResetExample />);

    await user.click(screen.getByRole('button', { name: '다시 불러오기' }));

    expect(screen.getByText('복구된 화면')).toBeInTheDocument();

    consoleError.mockRestore();
  });

  it('resets query errors before retrying the failed content', async () => {
    const consoleError = muteReactError();
    const queryClient = createTestQueryClient();
    const queryFn = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error('query failed'))
      .mockResolvedValue('복구된 데이터');
    const user = userEvent.setup();

    const QueryContent = () => {
      const { data } = useQuery({
        queryFn,
        queryKey: ['boundary-reset'],
      });

      return <p>{data}</p>;
    };

    render(
      <QueryClientProvider client={queryClient}>
        <Boundary>
          <QueryContent />
        </Boundary>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByRole('heading', { name: '화면을 불러오지 못했습니다.' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(await screen.findByText('복구된 데이터')).toBeInTheDocument();
    expect(queryFn).toHaveBeenCalledTimes(2);

    consoleError.mockRestore();
  });
});
