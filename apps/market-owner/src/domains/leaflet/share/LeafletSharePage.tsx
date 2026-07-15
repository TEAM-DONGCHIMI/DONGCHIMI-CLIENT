import { useState } from 'react';
import { useNavigate } from 'react-router';
import { overlay } from 'overlay-kit';

import { IcCircleCheckFill, IcCircleExclamation } from '@dongchimi/design-system/icons';
import { useToast } from '@dongchimi/shared/toast';

import { isApiError } from '@/shared/api';
import { DesktopHeader } from '@/shared/components';
import { getMarketOwnerEnv } from '@/shared/config';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { useAuthStore } from '@/shared/stores/auth-store';

import { QrDownloadModal } from './components';
import { leafletShareFixture } from './fixtures/leaflet-share.fixture';
import { usePublishLeafletMutation } from './hooks';
import { LeafletConfirmSection, LeafletShareSection } from './sections';
import * as S from './LeafletSharePage.css';

type LeafletShareViewTypes = 'confirm' | 'share';

const TOAST_DURATION_MS = 3000;
const TOAST_ICON_SIZE = '2.4rem';
const QR_DOWNLOAD_MODAL_OVERLAY_ID = 'leaflet-share-qr-download-modal';
const LEAFLET_PUBLISH_ERROR_MESSAGE = '전단을 발행하지 못했습니다. 다시 시도해주세요.';
const MARKET_CONTEXT_ERROR_MESSAGE = '마트 정보를 확인할 수 없습니다. 다시 로그인해주세요.';

const toastIconProps = {
  'aria-hidden': true,
  height: TOAST_ICON_SIZE,
  width: TOAST_ICON_SIZE,
} as const;

export const LeafletSharePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const marketId = useAuthStore((state) => state.marketId);
  const publishLeafletMutation = usePublishLeafletMutation();
  const [shareView, setShareView] = useState<LeafletShareViewTypes>('confirm');
  const [shareUrl, setShareUrl] = useState('');
  const isConfirmView = shareView === 'confirm';

  const showPublishErrorToast = (message: string) => {
    toast.error(message, {
      durationMs: TOAST_DURATION_MS,
      icon: <IcCircleExclamation {...toastIconProps} className={S.errorIconClassName} />,
    });
  };
  const publishAndShowShareView = async () => {
    if (marketId == null) {
      showPublishErrorToast(MARKET_CONTEXT_ERROR_MESSAGE);
      return;
    }

    const { clientBaseUrl } = getMarketOwnerEnv();

    if (clientBaseUrl == null) {
      showPublishErrorToast(LEAFLET_PUBLISH_ERROR_MESSAGE);
      return;
    }

    try {
      const { slug } = await publishLeafletMutation.mutateAsync(marketId);

      setShareUrl(`${clientBaseUrl}/markets/${encodeURIComponent(slug)}`);
      setShareView('share');
    } catch (error) {
      showPublishErrorToast(isApiError(error) ? error.message : LEAFLET_PUBLISH_ERROR_MESSAGE);
    }
  };
  const showCopiedToast = () => {
    toast.completed('전단 링크가 복사되었습니다.', {
      durationMs: TOAST_DURATION_MS,
      icon: <IcCircleCheckFill {...toastIconProps} />,
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
      },
    );
  };
  const showDownloadErrorToast = () => {
    toast.error('QR 이미지 다운로드를 실패했습니다.', {
      durationMs: TOAST_DURATION_MS,
      icon: <IcCircleExclamation {...toastIconProps} className={S.errorIconClassName} />,
    });
  };
  const openQrModal = () => {
    overlay.open(
      ({ close, isOpen, unmount }) => {
        const closeQrModal = () => {
          close();
          unmount();
        };
        const handleDownloadQrCode = () => {
          closeQrModal();
          showDownloadErrorToast();
        };

        return (
          <QrDownloadModal
            imageLabel={leafletShareFixture.qrImageLabel}
            open={isOpen}
            onClose={closeQrModal}
            onDownload={handleDownloadQrCode}
          />
        );
      },
      { overlayId: QR_DOWNLOAD_MODAL_OVERLAY_ID },
    );
  };
  const goHome = () => navigate(MARKET_OWNER_ROUTES.home);

  return (
    <main className={S.pageRootClassName}>
      <DesktopHeader currentLabel='오늘의 전단 최종 확인' parentLabel='홈' />

      {isConfirmView ? (
        <LeafletConfirmSection
          isPublishing={publishLeafletMutation.isPending}
          leafletSummary={leafletShareFixture.summary}
          onShare={() => void publishAndShowShareView()}
        />
      ) : (
        <LeafletShareSection
          shareUrl={shareUrl}
          onCopyLinkError={showCopyErrorToast}
          onCopyLink={showCopiedToast}
          onGoHome={goHome}
          onOpenQrModal={openQrModal}
        />
      )}
    </main>
  );
};
