import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '@/test';

import { AsyncBoundary } from './AsyncBoundary';

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

describe('AsyncBoundary', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children when no route boundary state is active', () => {
    render(
      <AsyncBoundary>
        <p>라우트 화면</p>
      </AsyncBoundary>,
    );

    expect(screen.getByText('라우트 화면')).toBeInTheDocument();
  });

  it('renders the loading fallback while children suspend', () => {
    render(
      <AsyncBoundary>
        <SuspendedContent />
      </AsyncBoundary>,
    );

    expect(screen.getByRole('status')).toHaveTextContent('화면을 불러오는 중입니다.');
  });

  it('renders an accessible error fallback when children throw', () => {
    muteReactError();

    render(
      <AsyncBoundary>
        <BrokenContent />
      </AsyncBoundary>,
    );

    expect(
      screen.getByRole('heading', { name: '화면을 불러오지 못했습니다.' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument();
  });

  it('resets the error boundary through a custom fallback action', async () => {
    muteReactError();
    const user = userEvent.setup();

    const BoundaryResetExample = () => {
      const [shouldThrow, setShouldThrow] = useState(true);

      return (
        <AsyncBoundary
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
        </AsyncBoundary>
      );
    };

    render(<BoundaryResetExample />);

    await user.click(screen.getByRole('button', { name: '다시 불러오기' }));

    expect(screen.getByText('복구된 화면')).toBeInTheDocument();
  });

  it('resets the error boundary when resetKeys change', async () => {
    muteReactError();
    const user = userEvent.setup();

    const BoundaryResetKeysExample = () => {
      const [productId, setProductId] = useState('failed-product');

      return (
        <>
          <button onClick={() => setProductId('resolved-product')} type='button'>
            다른 상품 보기
          </button>
          <AsyncBoundary resetKeys={[productId]}>
            <RecoverableContent shouldThrow={productId === 'failed-product'} />
          </AsyncBoundary>
        </>
      );
    };

    render(<BoundaryResetKeysExample />);

    expect(
      screen.getByRole('heading', { name: '화면을 불러오지 못했습니다.' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '다른 상품 보기' }));

    expect(screen.getByText('복구된 화면')).toBeInTheDocument();
  });

  it('calls onError when children throw', () => {
    muteReactError();
    const onError = vi.fn();

    render(
      <AsyncBoundary onError={onError}>
        <BrokenContent />
      </AsyncBoundary>,
    );

    expect(
      screen.getByRole('heading', { name: '화면을 불러오지 못했습니다.' }),
    ).toBeInTheDocument();
    expect(onError).toHaveBeenCalledWith(expect.any(Error), expect.any(Object));
  });

  it('resets query errors before retrying the failed content', async () => {
    muteReactError();
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
        <AsyncBoundary>
          <QueryContent />
        </AsyncBoundary>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByRole('heading', { name: '화면을 불러오지 못했습니다.' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(await screen.findByText('복구된 데이터')).toBeInTheDocument();
    expect(queryFn).toHaveBeenCalledTimes(2);
  });
});
