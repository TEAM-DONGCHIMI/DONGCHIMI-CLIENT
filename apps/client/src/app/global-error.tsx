'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const GlobalError = ({ error, reset }: GlobalErrorProps) => {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang='ko'>
      <body>
        <main>
          <section aria-labelledby='global-error-title'>
            <h1 id='global-error-title'>문제가 발생했습니다.</h1>
            <button type='button' onClick={reset}>
              다시 시도
            </button>
          </section>
        </main>
      </body>
    </html>
  );
};

export default GlobalError;
