'use client';

import { Component, type ReactNode } from 'react';
import dynamic from 'next/dynamic';

import * as S from './OAuthCallbackLoading.css';

const OAuthCallbackAnimationFallback = () => {
  return <span aria-hidden='true' className={S.fallbackSpinnerClassName} />;
};

const OAuthCallbackLottie = dynamic(
  () => import('./OAuthCallbackLottie').then((module) => module.OAuthCallbackLottie),
  {
    loading: OAuthCallbackAnimationFallback,
    ssr: false,
  },
);

interface OAuthCallbackLottieBoundaryProps {
  children: ReactNode;
}

interface OAuthCallbackLottieBoundaryState {
  hasError: boolean;
}

class OAuthCallbackLottieBoundary extends Component<
  OAuthCallbackLottieBoundaryProps,
  OAuthCallbackLottieBoundaryState
> {
  state: OAuthCallbackLottieBoundaryState = { hasError: false };

  static getDerivedStateFromError(): OAuthCallbackLottieBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <OAuthCallbackAnimationFallback />;
    }

    return this.props.children;
  }
}

export const OAuthCallbackLoading = () => {
  return (
    <main className={S.pageClassName}>
      <div aria-live='polite' className={S.statusClassName} role='status'>
        <OAuthCallbackLottieBoundary>
          <OAuthCallbackLottie />
        </OAuthCallbackLottieBoundary>
        <span className={S.visuallyHiddenClassName}>로그인 정보를 확인하고 있습니다.</span>
      </div>
    </main>
  );
};
