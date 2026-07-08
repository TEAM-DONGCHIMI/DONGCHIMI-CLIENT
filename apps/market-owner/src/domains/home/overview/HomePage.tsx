import { useEffect, useState } from 'react';

import { Toast } from '@dongchimi/design-system';
import {
  IcCircleCheckFillSizeSmall,
  IcCircleExclamationFillColor0,
} from '@dongchimi/design-system/icons';

import { DesktopHeader } from '@/shared/components';

import { HomeSearchPanel } from './components/home-search-panel';
import * as S from './HomePage.css';
import { HomeDashboardSection, HomeHeroSection } from './sections';

const HOME_TOAST_DISMISS_MS = 2500;
const SHARE_COPY_SUCCESS_MESSAGE = '전단 링크가 복사되었습니다.';
const SHARE_COPY_ERROR_MESSAGE = '링크를 복사하지 못했습니다. 다시 시도해주세요.';
const SEARCH_PRODUCT_LOAD_ERROR_MESSAGE = '상품 정보를 불러오지 못했어요.';
const QR_CODE_PREPARING_MESSAGE = 'QR코드 보기 기능은 준비 중입니다.';

interface HomeToastTypes {
  id: number;
  message: string;
  status: 'completed' | 'error';
}

const getHomeToastIcon = (status: HomeToastTypes['status']) => {
  if (status === 'error') {
    return <IcCircleExclamationFillColor0 className={S.homeToastIconClassName} />;
  }

  return <IcCircleCheckFillSizeSmall className={S.homeToastIconClassName} />;
};

export const HomePage = () => {
  const [homeToast, setHomeToast] = useState<HomeToastTypes | null>(null);

  useEffect(() => {
    if (homeToast == null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setHomeToast(null);
    }, HOME_TOAST_DISMISS_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [homeToast]);

  const handleCopyLinkResult = (isCopied: boolean) => {
    setHomeToast({
      id: Date.now(),
      message: isCopied ? SHARE_COPY_SUCCESS_MESSAGE : SHARE_COPY_ERROR_MESSAGE,
      status: isCopied ? 'completed' : 'error',
    });
  };

  const handleProductLoadError = () => {
    setHomeToast({
      id: Date.now(),
      message: SEARCH_PRODUCT_LOAD_ERROR_MESSAGE,
      status: 'error',
    });
  };

  const handleQrCodePreparing = () => {
    setHomeToast({
      id: Date.now(),
      message: QR_CODE_PREPARING_MESSAGE,
      status: 'completed',
    });
  };

  return (
    <main className={S.pageRootClassName}>
      <h1 className={S.visuallyHiddenHeadingClassName}>동치미 홈</h1>
      {homeToast && (
        <div className={S.homeToastLayerClassName}>
          <Toast
            key={homeToast.id}
            icon={getHomeToastIcon(homeToast.status)}
            status={homeToast.status}
          >
            {homeToast.message}
          </Toast>
        </div>
      )}
      <DesktopHeader
        className={S.pageHeaderClassName}
        homeLabel='동치미 홈'
        searchSlot={<HomeSearchPanel onProductLoadError={handleProductLoadError} />}
        showSearchBar
        variant='onlyHome'
      />

      <div className={S.contentSectionClassName}>
        <HomeHeroSection />
        <HomeDashboardSection
          onCopyLinkResult={handleCopyLinkResult}
          onQrCodePreparing={handleQrCodePreparing}
        />
      </div>
    </main>
  );
};
