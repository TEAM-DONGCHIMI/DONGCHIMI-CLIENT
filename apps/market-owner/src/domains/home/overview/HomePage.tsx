import { useToast, type ToastStatusTypes } from '@dongchimi/shared/toast';
import {
  IcCircleCheckFillSizeSmall,
  IcCircleExclamationFillColor0,
} from '@dongchimi/design-system/icons';

import { DesktopHeader, ProductHeaderSearch } from '@/shared/components';

import * as S from './HomePage.css';
import { getHomeSearchProductsByQuery, homeSearchProducts } from './fixtures';
import { HomeDashboardSection, HomeHeroSection } from './sections';

const HOME_TOAST_DISMISS_MS = 2500;
const SHARE_COPY_SUCCESS_MESSAGE = '전단 링크가 복사되었습니다.';
const SHARE_COPY_ERROR_MESSAGE = '링크를 복사하지 못했습니다. 다시 시도해주세요.';
const SEARCH_PRODUCT_LOAD_ERROR_MESSAGE = '상품 정보를 불러오지 못했어요.';
const QR_CODE_PREPARING_MESSAGE = 'QR코드 보기 기능은 준비 중입니다.';

const getHomeToastIcon = (status: ToastStatusTypes) => {
  if (status === 'error') {
    return <IcCircleExclamationFillColor0 className={S.homeToastIconClassName} />;
  }

  return <IcCircleCheckFillSizeSmall className={S.homeToastIconClassName} />;
};

export const HomePage = () => {
  const toast = useToast();

  const showHomeToast = (message: string, status: ToastStatusTypes) => {
    const options = {
      durationMs: HOME_TOAST_DISMISS_MS,
      icon: getHomeToastIcon(status),
    };

    if (status === 'error') {
      toast.error(message, options);

      return;
    }

    toast.completed(message, options);
  };

  const handleCopyLinkResult = (isCopied: boolean) => {
    showHomeToast(
      isCopied ? SHARE_COPY_SUCCESS_MESSAGE : SHARE_COPY_ERROR_MESSAGE,
      isCopied ? 'completed' : 'error',
    );
  };

  const handleProductLoadError = () => {
    showHomeToast(SEARCH_PRODUCT_LOAD_ERROR_MESSAGE, 'error');
  };

  const handleQrCodePreparing = () => {
    showHomeToast(QR_CODE_PREPARING_MESSAGE, 'completed');
  };

  return (
    <main className={S.pageRootClassName}>
      <h1 className={S.visuallyHiddenHeadingClassName}>동치미 홈</h1>
      <DesktopHeader
        className={S.pageHeaderClassName}
        homeLabel='동치미 홈'
        searchSlot={
          <ProductHeaderSearch
            getProductsByQuery={getHomeSearchProductsByQuery}
            products={homeSearchProducts}
            onProductLoadError={handleProductLoadError}
          />
        }
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
