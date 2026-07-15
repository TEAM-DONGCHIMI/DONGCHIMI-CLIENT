import { useState } from 'react';
import { useNavigate } from 'react-router';
import { overlay } from 'overlay-kit';
import { useToast, type ToastStatusTypes } from '@dongchimi/shared/toast';
import {
  IcCircleCheckFillSizeSmall,
  IcCircleExclamationFillColor0,
} from '@dongchimi/design-system/icons';

import {
  DesktopHeader,
  ProductHeaderSearch,
  type ProductHeaderSearchProductTypes,
  QrDownloadModal,
} from '@/shared/components';
import { useProductSearchQuery } from '@/domains/product/hooks';
import { useAuthStore } from '@/shared/stores/auth-store';
import { createProductEditTargetPath } from '@/shared/utils/product-edit-target-path.utils';
import { downloadQrCodeImage, getQrCodeImageSource } from '@/shared/utils/qr-code-image.utils';

import * as S from './HomePage.css';
import { HomeDashboardSection, HomeHeroSection } from './sections';

const HOME_TOAST_DISMISS_MS = 2500;
const SHARE_COPY_SUCCESS_MESSAGE = '전단 링크가 복사되었습니다.';
const SHARE_COPY_ERROR_MESSAGE = '링크를 복사하지 못했습니다. 다시 시도해주세요.';
const QR_CODE_UNAVAILABLE_MESSAGE = 'QR 코드를 불러오지 못했습니다. 다시 시도해주세요.';
const QR_DOWNLOAD_ERROR_MESSAGE = 'QR 이미지 다운로드를 실패했습니다.';
const QR_DOWNLOAD_FILENAME = 'market-leaflet-qr.png';
const QR_DOWNLOAD_MODAL_OVERLAY_ID = 'home-qr-download-modal';
const QR_IMAGE_LABEL = '매장 고유 QR코드';
const PRODUCT_SEARCH_RESULT_SIZE = 10;

const getHomeToastIcon = (status: ToastStatusTypes) => {
  if (status === 'error') {
    return <IcCircleExclamationFillColor0 className={S.homeToastIconClassName} />;
  }

  return <IcCircleCheckFillSizeSmall className={S.homeToastIconClassName} />;
};

export const HomePage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [productSearchKeyword, setProductSearchKeyword] = useState('');
  const marketId = useAuthStore((state) => state.marketId);
  const productSearchQuery = useProductSearchQuery({
    keyword: productSearchKeyword,
    marketId,
    size: PRODUCT_SEARCH_RESULT_SIZE,
  });
  const productSearchProducts = productSearchQuery.data?.data?.products ?? [];

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

  const handleSelectProduct = (product: ProductHeaderSearchProductTypes) => {
    navigate(createProductEditTargetPath(product));
  };

  const handleOpenQrCode = (qrCode?: string | null) => {
    const normalizedQrCode = qrCode?.trim();

    if (normalizedQrCode == null || normalizedQrCode.length === 0) {
      showHomeToast(QR_CODE_UNAVAILABLE_MESSAGE, 'error');
      return;
    }

    const imageSource = getQrCodeImageSource(normalizedQrCode);

    overlay.open(
      ({ close, isOpen, unmount }) => {
        const closeQrModal = () => {
          close();
          unmount();
        };
        const handleDownloadQrCode = () => {
          try {
            downloadQrCodeImage(imageSource, QR_DOWNLOAD_FILENAME);
            closeQrModal();
          } catch {
            showHomeToast(QR_DOWNLOAD_ERROR_MESSAGE, 'error');
          }
        };

        return (
          <QrDownloadModal
            imageLabel={QR_IMAGE_LABEL}
            imageSrc={imageSource}
            open={isOpen}
            onClose={closeQrModal}
            onDownload={handleDownloadQrCode}
          />
        );
      },
      { overlayId: QR_DOWNLOAD_MODAL_OVERLAY_ID },
    );
  };

  return (
    <main className={S.pageRootClassName}>
      <h1 className={S.visuallyHiddenHeadingClassName}>동치미 홈</h1>
      <DesktopHeader
        className={S.pageHeaderClassName}
        homeLabel='동치미 홈'
        searchSlot={
          <ProductHeaderSearch
            isPending={productSearchQuery.isFetching}
            onQueryChange={setProductSearchKeyword}
            onSelectProduct={handleSelectProduct}
            products={productSearchProducts}
            status={productSearchQuery.isError ? 'error' : 'default'}
          />
        }
        showSearchBar
        variant='onlyHome'
      />

      <div className={S.contentSectionClassName}>
        <HomeHeroSection />
        <HomeDashboardSection
          onCopyLinkResult={handleCopyLinkResult}
          onOpenQrCode={handleOpenQrCode}
        />
      </div>
    </main>
  );
};
