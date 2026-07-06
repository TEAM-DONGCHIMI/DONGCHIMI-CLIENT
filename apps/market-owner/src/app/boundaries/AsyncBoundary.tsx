import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense, type ReactNode } from 'react';
import { ErrorBoundary, type FallbackProps, type OnErrorCallback } from 'react-error-boundary';

import * as S from './AsyncBoundary.css';

export type AsyncBoundaryProps = Readonly<{
  children: ReactNode;
  errorFallback?: (props: FallbackProps) => ReactNode;
  loadingFallback?: ReactNode;
  onError?: OnErrorCallback;
  resetKeys?: unknown[];
}>;

const DefaultLoadingFallback = () => {
  return (
    <div aria-live='polite' className={S.fallbackRootClassName} role='status'>
      <div className={S.fallbackPanelClassName}>
        <p className={S.fallbackTitleClassName}>화면을 불러오는 중입니다.</p>
        <p className={S.fallbackDescriptionClassName}>잠시만 기다려주세요.</p>
      </div>
    </div>
  );
};

const DefaultErrorFallback = ({ resetErrorBoundary }: FallbackProps) => {
  return (
    <div className={S.fallbackRootClassName} role='alert'>
      <div className={S.fallbackPanelClassName}>
        <h2 className={S.fallbackTitleClassName}>화면을 불러오지 못했습니다.</h2>
        <p className={S.fallbackDescriptionClassName}>잠시 후 다시 시도해주세요.</p>
        <button
          className={S.retryButtonClassName}
          onClick={() => resetErrorBoundary()}
          type='button'
        >
          다시 시도
        </button>
      </div>
    </div>
  );
};

export const AsyncBoundary = ({
  children,
  errorFallback = DefaultErrorFallback,
  loadingFallback = <DefaultLoadingFallback />,
  onError,
  resetKeys,
}: AsyncBoundaryProps) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          fallbackRender={errorFallback}
          onError={onError}
          onReset={reset}
          resetKeys={resetKeys}
        >
          <Suspense fallback={loadingFallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
