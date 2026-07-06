import { Suspense, type ReactNode } from 'react';
import { ErrorBoundary, type FallbackProps, type OnErrorCallback } from 'react-error-boundary';

import * as S from './Boundary.css';

export type BoundaryProps = Readonly<{
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

export const Boundary = ({
  children,
  errorFallback = DefaultErrorFallback,
  loadingFallback = <DefaultLoadingFallback />,
  onError,
  resetKeys,
}: BoundaryProps) => {
  return (
    <ErrorBoundary fallbackRender={errorFallback} onError={onError} resetKeys={resetKeys}>
      <Suspense fallback={loadingFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
};
