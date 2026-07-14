import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@dongchimi/design-system/styles/reset.css';
import '@dongchimi/design-system/styles/fonts.css';

import { App } from '@/app/App';
import { getMarketOwnerEnv } from '@/shared/config';

import { getSentryReactRootOptions, initSentry } from './shared/config/sentry';

const enableMocking = async () => {
  if (!import.meta.env.DEV || !getMarketOwnerEnv().enableMsw) {
    return;
  }

  const { worker } = await import('./mocks/browser');

  await worker.start({ onUnhandledRequest: 'bypass' });
};

const bootstrap = async () => {
  await enableMocking();

  initSentry();

  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error('Root element not found.');
  }

  createRoot(rootElement, getSentryReactRootOptions()).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

void bootstrap();
