import { useState } from 'react';
import { useNavigate } from 'react-router';
import { overlay } from 'overlay-kit';

import { IcCircleCheckFill, IcCircleExclamation } from '@dongchimi/design-system/icons';
import { useToast } from '@dongchimi/shared/toast';

import { DesktopHeader } from '@/shared/components';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

import { QrDownloadModal } from './components';
import { leafletShareFixture } from './fixtures/leaflet-share.fixture';
import { LeafletConfirmSection, LeafletShareSection } from './sections';
import * as S from './LeafletSharePage.css';

type LeafletShareViewTypes = 'confirm' | 'share';

const TOAST_DURATION_MS = 3000;
const QR_DOWNLOAD_MODAL_OVERLAY_ID = 'leaflet-share-qr-download-modal';

export const LeafletSharePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [shareView, setShareView] = useState<LeafletShareViewTypes>('confirm');
  const isConfirmView = shareView === 'confirm';

  const showShareView = () => setShareView('share');
  const showCopiedToast = () => {
    toast.completed('전단 링크가 복사되었습니다.', {
      durationMs: TOAST_DURATION_MS,
      icon: <IcCircleCheckFill aria-hidden='true' />,
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
        icon: <IcCircleExclamation aria-hidden='true' className={S.errorIconClassName} />,
      },
    );
  };
  const showDownloadErrorToast = () => {
    toast.error('QR 이미지 다운로드를 실패했습니다.', {
      durationMs: TOAST_DURATION_MS,
      icon: <IcCircleExclamation aria-hidden='true' className={S.errorIconClassName} />,
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
          leafletSummary={leafletShareFixture.summary}
          onShare={showShareView}
        />
      ) : (
        <LeafletShareSection
          shareUrl={leafletShareFixture.shareUrl}
          onCopyLinkError={showCopyErrorToast}
          onCopyLink={showCopiedToast}
          onGoHome={goHome}
          onOpenQrModal={openQrModal}
        />
      )}
    </main>
  );
};
