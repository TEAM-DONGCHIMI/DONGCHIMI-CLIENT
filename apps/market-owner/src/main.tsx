import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@dongchimi/design-system/styles/reset.css';
import '@dongchimi/design-system/styles/fonts.css';

import { App } from '@/app/App';
import { configureDotLottieWasm, getSentryReactRootOptions, initSentry } from './shared/config';

initSentry();
configureDotLottieWasm();

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found.');
}

createRoot(rootElement, getSentryReactRootOptions()).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
