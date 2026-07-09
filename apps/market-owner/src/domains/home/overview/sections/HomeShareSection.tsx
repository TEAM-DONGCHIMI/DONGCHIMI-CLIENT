import { LeafletShareCard } from '@/shared/components';

import { homeShare } from '../fixtures';
import * as S from '../HomePage.css';

export interface HomeShareSectionProps {
  onCopyLinkResult: (isCopied: boolean) => void;
  onQrCodePreparing: () => void;
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
}: HomeShareSectionProps) => {
  const handleCopyShareUrl = async () => {
    const isCopied = await copyToClipboard(homeShare.url);

    onCopyLinkResult(isCopied);
  };

  const handleOpenQrCode = () => {
    onQrCodePreparing();
  };

  return (
    <LeafletShareCard
      className={S.shareCardClassName}
      description={homeShare.description}
      onCopyLink={handleCopyShareUrl}
      onOpenQrCode={handleOpenQrCode}
      shareUrl={homeShare.url}
      title={homeShare.title}
    />
  );
};
