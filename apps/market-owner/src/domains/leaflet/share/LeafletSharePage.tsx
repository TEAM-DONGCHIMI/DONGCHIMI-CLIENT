import { useState } from 'react';
import { useNavigate } from 'react-router';

import { IcCircleCheckFill, IcCircleExclamation } from '@dongchimi/design-system/icons';

import { DesktopHeader } from '@/shared/components';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

import { ShareToast } from './components/ShareToast';
import * as ShareToastStyles from './components/ShareToast.css';
import { leafletShareFixture } from './fixtures/leaflet-share.fixture';
import { LeafletConfirmSection, LeafletShareSection } from './sections';
import * as S from './LeafletSharePage.css';

type LeafletShareViewTypes = 'confirm' | 'share';
type LeafletShareToastStatusTypes = 'copied' | 'copyError' | 'downloadError' | null;

export const LeafletSharePage = () => {
  const navigate = useNavigate();
  const [shareView, setShareView] = useState<LeafletShareViewTypes>('confirm');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [toastStatus, setToastStatus] = useState<LeafletShareToastStatusTypes>(null);
  const isConfirmView = shareView === 'confirm';

  const showShareView = () => setShareView('share');
  const showCopiedToast = () => setToastStatus('copied');
  const showCopyErrorToast = () => setToastStatus('copyError');
  const openQrModal = () => setIsQrModalOpen(true);
  const closeQrModal = () => setIsQrModalOpen(false);
  const hideToast = () => setToastStatus(null);
  const showDownloadErrorToast = () => {
    setIsQrModalOpen(false);
    setToastStatus('downloadError');
  };
  const goHome = () => navigate(MARKET_OWNER_ROUTES.home);

  return (
    <main className={S.pageRootClassName}>
      <DesktopHeader currentLabel='오늘의 전단 최종 확인' parentLabel='홈' />

      {toastStatus === 'copied' && (
        <ShareToast
          icon={<IcCircleCheckFill aria-hidden='true' />}
          onAnimationEnd={hideToast}
          status='completed'
        >
          전단 링크가 복사되었습니다.
        </ShareToast>
      )}

      {toastStatus === 'downloadError' && (
        <ShareToast
          icon={
            <IcCircleExclamation
              aria-hidden='true'
              className={ShareToastStyles.errorIconClassName}
            />
          }
          onAnimationEnd={hideToast}
          status='error'
        >
          QR 이미지 다운로드를 실패했습니다.
        </ShareToast>
      )}

      {toastStatus === 'copyError' && (
        <ShareToast
          icon={<IcCircleExclamation aria-hidden='true' />}
          onAnimationEnd={hideToast}
          status='error'
        >
          링크를 복사하지 못했습니다.
          <br />
          다시 시도해주세요.
        </ShareToast>
      )}

      {isConfirmView ? (
        <LeafletConfirmSection
          leafletSummary={leafletShareFixture.summary}
          onShare={showShareView}
        />
      ) : (
        <LeafletShareSection
          isQrModalOpen={isQrModalOpen}
          qrImageLabel={leafletShareFixture.qrImageLabel}
          shareUrl={leafletShareFixture.shareUrl}
          onCloseQrModal={closeQrModal}
          onCopyLinkError={showCopyErrorToast}
          onCopyLink={showCopiedToast}
          onDownloadQrCode={showDownloadErrorToast}
          onGoHome={goHome}
          onOpenQrModal={openQrModal}
        />
      )}
    </main>
  );
};
