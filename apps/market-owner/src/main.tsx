import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { getSentryReactRootOptions, initSentry } from './shared/config/sentry';

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
