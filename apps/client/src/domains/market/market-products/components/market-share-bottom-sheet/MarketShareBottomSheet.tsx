'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';

import { BottomSheet } from '@dongchimi/design-system';
import {
  IcCircleCheckFillSizeSmall,
  IcCopySizeSmall,
  IcCopySizeXsmallColor50,
  IcLogoKakaoSizeSmall,
  IcShareIos,
} from '@dongchimi/design-system/icons';
import { ToastProvider, useToast, type ToastStatusTypes } from '@dongchimi/shared/toast';

import { usePwaInstall } from '@/shared/pwa';

import * as S from './MarketShareBottomSheet.css';
import installGuideImage from './assets/pwa-install-guide.svg';

type MarketShareActionHandlerTypes = () => void | Promise<void>;

export interface MarketShareBottomSheetProps {
  marketName: string;
  onCopyLink?: MarketShareActionHandlerTypes;
  onShareKakao?: MarketShareActionHandlerTypes;
  shareUrl: string;
  triggerClassName?: string;
  triggerLabel?: string;
}

type MarketShareBottomSheetContentProps = Pick<
  MarketShareBottomSheetProps,
  'marketName' | 'onCopyLink' | 'onShareKakao' | 'shareUrl'
> & {
  onOpenInstallGuide: () => void;
};

type MarketShareSheetViewTypes = 'install' | 'share';

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
  onOpenInstallGuide,
  onShareKakao,
  shareUrl,
}: MarketShareBottomSheetContentProps) => {
  const toast = useToast();

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
          <button className={S.actionButtonClassName} onClick={onOpenInstallGuide} type='button'>
            <span aria-hidden='true' className={S.actionIconClassName}>
              <IcShareIos />
            </span>
            앱으로 전단보기
          </button>
        </div>
      </BottomSheet.Body>
      <BottomSheet.Footer>
        <BottomSheet.Close className={S.shareCloseButtonClassName}>닫기</BottomSheet.Close>
      </BottomSheet.Footer>
    </>
  );
};

interface PwaInstallGuideContentProps {
  onClose: () => void;
}

const PwaInstallGuideContent = ({ onClose }: PwaInstallGuideContentProps) => {
  const { requestInstall } = usePwaInstall();

  const handleInstall = async () => {
    const result = await requestInstall();

    if (result === 'accepted' || result === 'dismissed') {
      onClose();
    }
  };

  return (
    <>
      <BottomSheet.Handle />
      <BottomSheet.Title className={S.visuallyHiddenClassName}>
        홈 화면에 추가하기 안내
      </BottomSheet.Title>
      <BottomSheet.Body className={S.installBodyClassName}>
        <Image
          alt='동치미 앱 아이콘이 표시된 홈 화면 예시'
          className={S.installImageClassName}
          height={177}
          src={installGuideImage}
          width={263}
        />
        <BottomSheet.Description className={S.installDescriptionClassName}>
          홈 화면에 추가하기 버튼을 누르면
          <br />
          마트 할인 정보를 빠르게 확인할 수 있어요.
        </BottomSheet.Description>
        <button
          autoFocus
          className={S.installButtonClassName}
          onClick={() => {
            void handleInstall();
          }}
          type='button'
        >
          홈 화면에 추가하기
        </button>
      </BottomSheet.Body>
      <BottomSheet.Close className={S.installLaterButtonClassName}>다음에 하기</BottomSheet.Close>
    </>
  );
};

export const MarketShareBottomSheet = ({
  marketName,
  onCopyLink,
  onShareKakao,
  shareUrl,
  triggerClassName,
  triggerLabel = '전단 공유하기',
}: MarketShareBottomSheetProps) => {
  const [open, setOpen] = useState(false);
  const [sheetElement, setSheetElement] = useState<HTMLDialogElement | null>(null);
  const [view, setView] = useState<MarketShareSheetViewTypes>('share');

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setView('share');
    }
  }, []);

  return (
    <BottomSheet onOpenChange={handleOpenChange} open={open}>
      <BottomSheet.Trigger className={triggerClassName ?? S.triggerClassName}>
        {triggerLabel}
      </BottomSheet.Trigger>
      <BottomSheet.Content
        ref={setSheetElement}
        className={view === 'install' ? S.installSheetClassName : S.sheetClassName}
      >
        <ToastProvider placement='bottom-center' portalContainer={sheetElement}>
          {view === 'share' ? (
            <MarketShareBottomSheetContent
              marketName={marketName}
              onCopyLink={onCopyLink}
              onOpenInstallGuide={() => setView('install')}
              onShareKakao={onShareKakao}
              shareUrl={shareUrl}
            />
          ) : (
            <PwaInstallGuideContent onClose={() => handleOpenChange(false)} />
          )}
        </ToastProvider>
      </BottomSheet.Content>
    </BottomSheet>
  );
};
