'use client';

import { useState } from 'react';

import { BottomSheet } from '@dongchimi/design-system';
import {
  IcCircleCheckFillSizeSmall,
  IcCopySizeSmall,
  IcCopySizeXsmallColor50,
  IcLoginSizeSmall,
  IcLogoKakaoSizeSmall,
} from '@dongchimi/design-system/icons';
import { ToastProvider, useToast, type ToastStatusTypes } from '@dongchimi/shared/toast';

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

type MarketShareBottomSheetContentProps = Pick<
  MarketShareBottomSheetProps,
  'marketName' | 'onCopyLink' | 'onOpenQrCode' | 'onShareKakao' | 'shareUrl'
>;

const MARKET_SHARE_TOAST_ID = 'market-share-action-feedback';
const MARKET_SHARE_TOAST_DISMISS_MS = 2500;
const SHARE_COPY_SUCCESS_MESSAGE = '전단 링크가 복사되었습니다.';
const SHARE_COPY_ERROR_MESSAGE = '링크를 복사하지 못했습니다. 다시 시도해주세요.';
const SHARE_KAKAO_PENDING_MESSAGE = '아직 준비중인 기능이에요.';

const getShareToastIcon = (status: ToastStatusTypes) => {
  if (status === 'error') {
    return undefined;
  }

  return <IcCircleCheckFillSizeSmall className={S.toastIconClassName} />;
};

const copyToClipboard = async (shareUrl: string) => {
  if (typeof navigator === 'undefined' || navigator.clipboard == null) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(shareUrl);

    return true;
  } catch {
    return false;
  }
};

const MarketShareBottomSheetContent = ({
  marketName,
  onCopyLink,
  onOpenQrCode,
  onShareKakao,
  shareUrl,
}: MarketShareBottomSheetContentProps) => {
  const toast = useToast();
  const hasQrCodeAction = onOpenQrCode != null;

  const showShareToast = (message: string, status: ToastStatusTypes) => {
    const options = {
      durationMs: MARKET_SHARE_TOAST_DISMISS_MS,
      icon: getShareToastIcon(status),
      id: MARKET_SHARE_TOAST_ID,
    };

    if (status === 'error') {
      toast.error(message, options);

      return;
    }

    toast.completed(message, options);
  };

  const handleCopyLink = async () => {
    if (onCopyLink != null) {
      await onCopyLink();
      return;
    }

    const isCopied = await copyToClipboard(shareUrl);

    showShareToast(
      isCopied ? SHARE_COPY_SUCCESS_MESSAGE : SHARE_COPY_ERROR_MESSAGE,
      isCopied ? 'completed' : 'error',
    );
  };

  const handleShareKakao = async () => {
    if (onShareKakao != null) {
      await onShareKakao();
      return;
    }

    showShareToast(SHARE_KAKAO_PENDING_MESSAGE, 'error');
  };

  const handleOpenQrCode = () => {
    void onOpenQrCode?.();
  };

  return (
    <>
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
            onClick={() => {
              void handleCopyLink();
            }}
            type='button'
          >
            <IcCopySizeXsmallColor50 aria-hidden='true' />
          </button>
        </div>
        <div className={S.actionListClassName}>
          <button
            className={S.actionButtonClassName}
            onClick={() => {
              void handleCopyLink();
            }}
            type='button'
          >
            <span aria-hidden='true' className={S.actionIconClassName}>
              <IcCopySizeSmall />
            </span>
            링크 복사
          </button>
          <button
            className={S.actionButtonClassName}
            onClick={() => {
              void handleShareKakao();
            }}
            type='button'
          >
            <span aria-hidden='true' className={S.actionIconClassName}>
              <IcLogoKakaoSizeSmall />
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
              <IcLoginSizeSmall />
            </span>
            QR 코드 보기
          </button>
        </div>
      </BottomSheet.Body>
      <BottomSheet.Footer>
        <BottomSheet.Close>닫기</BottomSheet.Close>
      </BottomSheet.Footer>
    </>
  );
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
  const [sheetElement, setSheetElement] = useState<HTMLDialogElement | null>(null);

  return (
    <BottomSheet>
      <BottomSheet.Trigger className={triggerClassName ?? S.triggerClassName}>
        {triggerLabel}
      </BottomSheet.Trigger>
      <BottomSheet.Content ref={setSheetElement} className={S.sheetClassName}>
        <ToastProvider placement='bottom-center' portalContainer={sheetElement}>
          <MarketShareBottomSheetContent
            marketName={marketName}
            onCopyLink={onCopyLink}
            onOpenQrCode={onOpenQrCode}
            onShareKakao={onShareKakao}
            shareUrl={shareUrl}
          />
        </ToastProvider>
      </BottomSheet.Content>
    </BottomSheet>
  );
};
