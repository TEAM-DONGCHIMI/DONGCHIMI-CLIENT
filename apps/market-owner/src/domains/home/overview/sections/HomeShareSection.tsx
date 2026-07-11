import { LeafletShareCard } from '@/shared/components';

import { homeShare, type HomeShareFixtureTypes } from '../fixtures';
import * as S from '../HomePage.css';

const EMPTY_FLYER_MESSAGE = '전단을 공유하려면\n상품을 먼저 등록해주세요.';

export interface HomeShareSectionProps {
  onCopyLinkResult: (isCopied: boolean) => void;
  onQrCodePreparing: () => void;
  share?: HomeShareFixtureTypes;
}

const copyToClipboard = async (text: string) => {
  if (typeof navigator === 'undefined' || navigator.clipboard == null) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);

    return true;
  } catch {
    return false;
  }
};

export const HomeShareSection = ({
  onCopyLinkResult,
  onQrCodePreparing,
  share = homeShare,
}: HomeShareSectionProps) => {
  const isFlyerUnavailable = share.flyer === null;

  const handleCopyShareUrl = async () => {
    if (isFlyerUnavailable) {
      return;
    }

    const isCopied = await copyToClipboard(share.url);

    onCopyLinkResult(isCopied);
  };

  const handleOpenQrCode = () => {
    if (isFlyerUnavailable) {
      return;
    }

    onQrCodePreparing();
  };

  return (
    <div className={S.dashboardCardContainerClassName}>
      <LeafletShareCard
        className={S.shareCardClassName}
        description={share.description}
        disabled={isFlyerUnavailable}
        onCopyLink={handleCopyShareUrl}
        onOpenQrCode={handleOpenQrCode}
        shareUrl={isFlyerUnavailable ? '' : share.url}
        title={share.title}
      />

      {isFlyerUnavailable && (
        <div className={S.dashboardCardEmptyOverlayClassName}>
          <p className={S.dashboardCardEmptyMessageClassName}>{EMPTY_FLYER_MESSAGE}</p>
        </div>
      )}
    </div>
  );
};
