'use client';

import { Button } from '@dongchimi/design-system';

import * as S from './OfflinePage.css';

interface OfflinePageProps {
  onRetry?: () => void;
}

export const OfflinePage = ({ onRetry }: OfflinePageProps) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
      return;
    }

    window.location.reload();
  };

  return (
    <main className={S.pageClassName}>
      <section aria-labelledby='offline-title' className={S.contentClassName}>
        <div className={S.messageClassName}>
          <p aria-hidden='true' className={S.statusClassName}>
            OFFLINE
          </p>
          <h1 className={S.titleClassName} id='offline-title'>
            인터넷 연결을 확인해주세요
          </h1>
          <p className={S.descriptionClassName}>
            네트워크 연결 후 다시 시도하면 요청한 화면으로 이동할 수 있어요.
          </p>
        </div>

        <Button className={S.retryButtonClassName} onClick={handleRetry} size='mobile'>
          다시 시도
        </Button>
      </section>
    </main>
  );
};
