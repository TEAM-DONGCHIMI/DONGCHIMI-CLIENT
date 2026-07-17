import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { overlay } from 'overlay-kit';

import { IcCircleCheckFill, IcCircleExclamation } from '@dongchimi/design-system/icons';
import { useToast } from '@dongchimi/shared/toast';

import { useConfirmPreparedProductDraftsMutation } from '@/domains/product/hooks';
import { isApiError } from '@/shared/api';
import { DesktopHeader, QrDownloadModal } from '@/shared/components';
import { getMarketOwnerEnv } from '@/shared/config';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { useAuthStore } from '@/shared/stores/auth-store';
import { downloadQrCodeImage, getQrCodeImageSource } from '@/shared/utils/qr-code-image.utils';

import { leafletShareFixture } from './fixtures/leaflet-share.fixture';
import {
  useIssueQrCodeMutation,
  usePeriodicPreviewQuery,
  usePublishLeafletMutation,
} from './hooks';
import { createLeafletPreviewViewModel } from './model/leaflet-preview-view-model';
import { LeafletConfirmSection, LeafletShareSection } from './sections';
import * as S from './LeafletSharePage.css';

type LeafletShareViewTypes = 'confirm' | 'share';

const TOAST_DURATION_MS = 3000;
const TOAST_ICON_SIZE = '2.4rem';
const COPY_FEEDBACK_TOAST_ID = 'leaflet-share-copy-feedback';
const QR_DOWNLOAD_MODAL_OVERLAY_ID = 'leaflet-share-qr-download-modal';
const QR_DOWNLOAD_FILENAME = 'market-leaflet-qr.png';
const QR_ISSUE_ERROR_MESSAGE = 'QR 코드를 불러오지 못했습니다. 다시 시도해주세요.';
const PRODUCT_CONFIRM_ERROR_MESSAGE = '상품을 최종 저장하지 못했습니다. 다시 시도해주세요.';
const LEAFLET_PUBLISH_ERROR_MESSAGE = '전단을 발행하지 못했습니다. 다시 시도해주세요.';
const MARKET_CONTEXT_ERROR_MESSAGE = '마트 정보를 확인할 수 없습니다. 다시 로그인해주세요.';

const toastIconProps = {
  'aria-hidden': true,
  height: TOAST_ICON_SIZE,
  width: TOAST_ICON_SIZE,
} as const;

const getLeafletShareBaseUrl = () => {
  const { clientBaseUrl } = getMarketOwnerEnv();

  return clientBaseUrl ?? window.location.origin;
};

export const LeafletSharePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const marketId = useAuthStore((state) => state.marketId);
  const issueQrCodeMutation = useIssueQrCodeMutation();
  const periodicPreviewQuery = usePeriodicPreviewQuery({ marketId });
  const confirmPreparedProductDraftsMutation = useConfirmPreparedProductDraftsMutation();
  const publishLeafletMutation = usePublishLeafletMutation();
  const confirmedMarketIdRef = useRef<number | undefined>(undefined);
  const shareFlowInFlightRef = useRef(false);
  const [shareView, setShareView] = useState<LeafletShareViewTypes>('confirm');
  const [shareUrl, setShareUrl] = useState('');
  const [isShareFlowPending, setIsShareFlowPending] = useState(false);
  const isConfirmView = shareView === 'confirm';
  const leafletPreview = useMemo(() => {
    if (periodicPreviewQuery.data == null) {
      return undefined;
    }

    return createLeafletPreviewViewModel(periodicPreviewQuery.data);
  }, [periodicPreviewQuery.data]);

  const showShareFlowErrorToast = (message: string) => {
    toast.error(message, {
      durationMs: TOAST_DURATION_MS,
      icon: <IcCircleExclamation {...toastIconProps} className={S.errorIconClassName} />,
    });
  };
  const finalizeProductsAndPublishLeaflet = async () => {
    if (shareFlowInFlightRef.current) {
      return;
    }

    if (marketId == null) {
      showShareFlowErrorToast(MARKET_CONTEXT_ERROR_MESSAGE);
      return;
    }

    shareFlowInFlightRef.current = true;
    setIsShareFlowPending(true);

    try {
      if (confirmedMarketIdRef.current !== marketId) {
        try {
          await confirmPreparedProductDraftsMutation.mutateAsync(marketId);
          confirmedMarketIdRef.current = marketId;
        } catch (error) {
          showShareFlowErrorToast(
            isApiError(error) ? error.message : PRODUCT_CONFIRM_ERROR_MESSAGE,
          );
          return;
        }
      }

      try {
        const { slug } = await publishLeafletMutation.mutateAsync(marketId);

        setShareUrl(`${getLeafletShareBaseUrl()}/markets/${encodeURIComponent(slug)}`);
        setShareView('share');
      } catch (error) {
        showShareFlowErrorToast(isApiError(error) ? error.message : LEAFLET_PUBLISH_ERROR_MESSAGE);
      }
    } finally {
      shareFlowInFlightRef.current = false;
      setIsShareFlowPending(false);
    }
  };
  const showCopiedToast = () => {
    toast.completed('전단 링크가 복사되었습니다.', {
      durationMs: TOAST_DURATION_MS,
      icon: <IcCircleCheckFill {...toastIconProps} />,
      id: COPY_FEEDBACK_TOAST_ID,
    });
  };
  const showCopyErrorToast = () => {
    toast.error(
      <>
        링크를 복사하지 못했습니다.
        <br />
        다시 시도해주세요.
      </>,
      {
        durationMs: TOAST_DURATION_MS,
        icon: <IcCircleExclamation {...toastIconProps} className={S.errorIconClassName} />,
        id: COPY_FEEDBACK_TOAST_ID,
      },
    );
  };
  const showDownloadErrorToast = () => {
    toast.error('QR 이미지 다운로드를 실패했습니다.', {
      durationMs: TOAST_DURATION_MS,
      icon: <IcCircleExclamation {...toastIconProps} className={S.errorIconClassName} />,
    });
  };
  const showQrIssueErrorToast = (message: string) => {
    toast.error(message, {
      durationMs: TOAST_DURATION_MS,
      icon: <IcCircleExclamation {...toastIconProps} className={S.errorIconClassName} />,
    });
  };
  const openQrModal = (imageSource: string) => {
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
            showDownloadErrorToast();
          }
        };

        return (
          <QrDownloadModal
            imageLabel={leafletShareFixture.qrImageLabel}
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
  const issueQrCodeAndOpenModal = async () => {
    if (marketId == null) {
      showQrIssueErrorToast(MARKET_CONTEXT_ERROR_MESSAGE);
      return;
    }

    try {
      const { qrCode } = await issueQrCodeMutation.mutateAsync(marketId);

      openQrModal(getQrCodeImageSource(qrCode));
    } catch (error) {
      showQrIssueErrorToast(isApiError(error) ? error.message : QR_ISSUE_ERROR_MESSAGE);
    }
  };
  const goHome = () => navigate(MARKET_OWNER_ROUTES.home);
  const editLeafletProducts = () => navigate(MARKET_OWNER_ROUTES.registrationResult);

  return (
    <main className={S.pageRootClassName}>
      <DesktopHeader
        currentLabel='오늘의 전단 최종 확인'
        parentLabel='행사 할인 상품 등록'
        showSearchBar={false}
      />

      {isConfirmView ? (
        <LeafletConfirmSection
          isPreviewError={periodicPreviewQuery.isError}
          isPreviewPending={periodicPreviewQuery.isLoading}
          isPublishing={isShareFlowPending}
          leafletPreview={leafletPreview}
          onEdit={editLeafletProducts}
          onPreviewRetry={() => void periodicPreviewQuery.refetch()}
          onShare={() => void finalizeProductsAndPublishLeaflet()}
        />
      ) : (
        <LeafletShareSection
          isQrCodePending={issueQrCodeMutation.isPending}
          shareUrl={shareUrl}
          onCopyLinkError={showCopyErrorToast}
          onCopyLink={showCopiedToast}
          onGoHome={goHome}
          onOpenQrModal={() => void issueQrCodeAndOpenModal()}
        />
      )}
    </main>
  );
};
