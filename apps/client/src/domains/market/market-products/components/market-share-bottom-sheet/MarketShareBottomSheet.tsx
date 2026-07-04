'use client';

import { BottomSheet } from '@dongchimi/design-system';
import { cn } from '@dongchimi/design-system/styles';

import * as S from './MarketShareBottomSheet.css';

type MarketShareActionHandlerTypes = () => void | Promise<void>;

export interface MarketShareBottomSheetProps {
  marketName: string;
  onCopyLink?: MarketShareActionHandlerTypes;
  onOpenQrCode?: MarketShareActionHandlerTypes;
  onShareKakao?: MarketShareActionHandlerTypes;
  shareUrl: string;
  triggerClassName?: string;
  triggerLabel?: string;
}

const fallbackCopyLink = (shareUrl: string) => {
  if (typeof navigator === 'undefined' || navigator.clipboard == null) {
    return;
  }

  void navigator.clipboard.writeText(shareUrl);
};

const fallbackShare = (marketName: string, shareUrl: string) => {
  if (typeof navigator === 'undefined' || navigator.share == null) {
    fallbackCopyLink(shareUrl);
    return;
  }

  void navigator.share({
    text: `${marketName} 전단을 공유해보세요.`,
    title: `${marketName} 전단`,
    url: shareUrl,
  });
};

export const MarketShareBottomSheet = ({
  marketName,
  onCopyLink,
  onOpenQrCode,
  onShareKakao,
  shareUrl,
  triggerClassName,
  triggerLabel = '전단 공유하기',
}: MarketShareBottomSheetProps) => {
  const hasQrCodeAction = onOpenQrCode != null;

  const handleCopyLink = () => {
    if (onCopyLink != null) {
      void onCopyLink();
      return;
    }

    fallbackCopyLink(shareUrl);
  };

  const handleShareKakao = () => {
    if (onShareKakao != null) {
      void onShareKakao();
      return;
    }

    fallbackShare(marketName, shareUrl);
  };

  const handleOpenQrCode = () => {
    void onOpenQrCode?.();
  };

  return (
    <BottomSheet>
      <BottomSheet.Trigger className={cn(S.triggerClassName, triggerClassName)}>
        {triggerLabel}
      </BottomSheet.Trigger>
      <BottomSheet.Content className={S.sheetClassName}>
        <BottomSheet.Handle />
        <BottomSheet.Header>
          <BottomSheet.Title>전단 공유하기</BottomSheet.Title>
          <BottomSheet.Description>{marketName} 전단을 공유해보세요.</BottomSheet.Description>
        </BottomSheet.Header>
        <BottomSheet.Body className={S.bodyClassName}>
          <div className={S.linkFieldClassName}>
            <span className={S.linkTextClassName}>{shareUrl}</span>
            <button
              aria-label='전단 링크 복사'
              className={S.linkCopyButtonClassName}
              onClick={handleCopyLink}
              type='button'
            >
              <span aria-hidden='true' className={S.blankIconClassName} />
            </button>
          </div>
          <div className={S.actionListClassName}>
            <button className={S.actionButtonClassName} onClick={handleCopyLink} type='button'>
              <span aria-hidden='true' className={S.actionIconClassName}>
                <span className={S.blankIconClassName} />
              </span>
              링크 복사
            </button>
            <button className={S.actionButtonClassName} onClick={handleShareKakao} type='button'>
              <span aria-hidden='true' className={S.actionIconClassName}>
                <span className={S.blankIconClassName} />
              </span>
              카카오톡으로 공유
            </button>
            <button
              className={S.actionButtonClassName}
              disabled={!hasQrCodeAction}
              onClick={handleOpenQrCode}
              type='button'
            >
              <span aria-hidden='true' className={S.actionIconClassName}>
                <span className={S.blankIconClassName} />
              </span>
              QR 코드 보기
            </button>
          </div>
        </BottomSheet.Body>
        <BottomSheet.Footer>
          <BottomSheet.Close>닫기</BottomSheet.Close>
        </BottomSheet.Footer>
      </BottomSheet.Content>
    </BottomSheet>
  );
};
