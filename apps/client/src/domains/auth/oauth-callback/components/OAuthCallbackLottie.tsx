'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { DotLottieReact, setWasmUrl } from '@lottiefiles/dotlottie-react';
import type { DotLottie } from '@lottiefiles/dotlottie-web';
import dotLottieWasmUrl from '@lottiefiles/dotlottie-web/dotlottie-player.wasm';

import * as S from './OAuthCallbackLoading.css';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const SPINNER_LOTTIE_SRC = '/lottie/spinner.lottie';

setWasmUrl(dotLottieWasmUrl);

const getPrefersReducedMotion = () => {
  return typeof window.matchMedia === 'function' && window.matchMedia(REDUCED_MOTION_QUERY).matches;
};

const subscribeToReducedMotion = (onStoreChange: () => void) => {
  if (typeof window.matchMedia !== 'function') {
    return () => undefined;
  }

  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener('change', onStoreChange);

  return () => {
    mediaQuery.removeEventListener('change', onStoreChange);
  };
};

export const OAuthCallbackLottie = () => {
  const dotLottieRef = useRef<DotLottie | null>(null);
  const [hasPlayerError, setHasPlayerError] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getPrefersReducedMotion,
    () => true,
  );
  const handlePlayerError = useCallback(() => {
    setHasPlayerError(true);
  }, []);
  const handleDotLottieRef = useCallback(
    (dotLottie: DotLottie | null) => {
      dotLottieRef.current?.removeEventListener('loadError', handlePlayerError);
      dotLottieRef.current?.removeEventListener('renderError', handlePlayerError);
      dotLottieRef.current = dotLottie;

      dotLottie?.addEventListener('loadError', handlePlayerError);
      dotLottie?.addEventListener('renderError', handlePlayerError);

      if (prefersReducedMotion) {
        dotLottie?.pause();
      }
    },
    [handlePlayerError, prefersReducedMotion],
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      dotLottieRef.current?.pause();

      return;
    }

    dotLottieRef.current?.play();
  }, [prefersReducedMotion]);

  if (hasPlayerError) {
    return <span aria-hidden='true' className={S.fallbackSpinnerClassName} />;
  }

  return (
    <>
      {prefersReducedMotion ? (
        <span aria-hidden='true' className={S.fallbackSpinnerClassName} />
      ) : null}
      <DotLottieReact
        aria-hidden='true'
        autoplay={!prefersReducedMotion}
        className={prefersReducedMotion ? S.hiddenLottieClassName : S.lottieClassName}
        dotLottieRefCallback={handleDotLottieRef}
        loop={!prefersReducedMotion}
        src={SPINNER_LOTTIE_SRC}
      />
    </>
  );
};
