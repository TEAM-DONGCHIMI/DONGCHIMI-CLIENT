import { useEffect, useLayoutEffect, useState } from 'react';

import {
  clearMarketProductsScrollRestoration,
  consumePendingMarketProductsScrollRestoration,
  peekPendingMarketProductsScrollRestoration,
} from './market-products-scroll-restoration';

const ANCHOR_WAIT_TIMEOUT_MS = 3_000;
const RESTORATION_STABLE_FRAME_COUNT = 2;
const SCROLL_POSITION_TOLERANCE_PX = 1;

const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export const useMarketProductsScrollRestoration = (marketSlug: string) => {
  const [restorationState, setRestorationState] = useState(() => {
    return peekPendingMarketProductsScrollRestoration(marketSlug);
  });

  useEffect(() => {
    const restorePendingState = () => {
      const pendingState = consumePendingMarketProductsScrollRestoration(marketSlug);

      if (pendingState == null) {
        return;
      }

      setRestorationState((currentState) => {
        return currentState?.restorationId === pendingState.restorationId
          ? currentState
          : pendingState;
      });
    };

    restorePendingState();
    window.addEventListener('popstate', restorePendingState);

    return () => {
      window.removeEventListener('popstate', restorePendingState);
    };
  }, [marketSlug]);

  useBrowserLayoutEffect(() => {
    if (restorationState == null) {
      return;
    }

    const startedAt = Date.now();
    let animationFrameId = 0;
    let stableFrameCount = 0;

    const finishRestoration = () => {
      clearMarketProductsScrollRestoration(marketSlug);
      setRestorationState(null);
    };

    const restoreScrollPosition = () => {
      const anchor = document.getElementById(restorationState.anchorId);

      if (anchor != null) {
        const scrollDifference = anchor.getBoundingClientRect().top - restorationState.viewportTop;

        if (Math.abs(scrollDifference) > SCROLL_POSITION_TOLERANCE_PX) {
          stableFrameCount = 0;
          window.scrollBy({ behavior: 'auto', left: 0, top: scrollDifference });
        } else {
          stableFrameCount += 1;

          if (stableFrameCount >= RESTORATION_STABLE_FRAME_COUNT) {
            finishRestoration();
            return;
          }
        }
      }

      if (Date.now() - startedAt >= ANCHOR_WAIT_TIMEOUT_MS) {
        window.scrollTo({ behavior: 'auto', left: 0, top: restorationState.scrollY });
        finishRestoration();
        return;
      }

      animationFrameId = window.requestAnimationFrame(restoreScrollPosition);
    };

    animationFrameId = window.requestAnimationFrame(restoreScrollPosition);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [marketSlug, restorationState]);

  return restorationState;
};
