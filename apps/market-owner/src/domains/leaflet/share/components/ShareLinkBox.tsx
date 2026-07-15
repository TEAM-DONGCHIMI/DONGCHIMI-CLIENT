import { Button, Flex, IconButton, Stack } from '@dongchimi/design-system/components';
import { IcCopy, IcCopyColor50, IcLogin } from '@dongchimi/design-system/icons';

import * as S from './ShareLinkBox.css';

export interface ShareLinkBoxProps {
  isQrCodePending?: boolean;
  shareUrl: string;
  onCopyLink: () => void;
  onCopyLinkError: () => void;
  onGoHome: () => void;
  onOpenQrModal: () => void;
}

export const ShareLinkBox = ({
  isQrCodePending = false,
  shareUrl,
  onCopyLink,
  onCopyLinkError,
  onGoHome,
  onOpenQrModal,
}: ShareLinkBoxProps) => {
  const handleCopyLink = () => {
    if (navigator.clipboard == null) {
      onCopyLinkError();
      return;
    }

    void navigator.clipboard.writeText(shareUrl).then(onCopyLink).catch(onCopyLinkError);
  };

  return (
    <Stack
      aria-labelledby='leaflet-share-card-title'
      as='section'
      className={S.cardClassName}
      gap='none'
    >
      <Stack className={S.headerClassName}>
        <h2 className={S.titleClassName} id='leaflet-share-card-title'>
          전단 공유하기
        </h2>
        <p className={S.descriptionClassName}>
          카카오톡, 문자로 공유하거나 마트 입구에 QR을 붙여보세요.
        </p>
      </Stack>

      <Flex align='center' className={S.linkFieldClassName} justify='between'>
        <span className={S.linkTextClassName}>{shareUrl}</span>
        <IconButton
          aria-label='전단 공유 링크 복사'
          className={S.linkCopyButtonClassName}
          color='assistive'
          icon={<IcCopyColor50 />}
          onClick={handleCopyLink}
          variant='ghost'
        />
      </Flex>

      <Stack className={S.actionListClassName}>
        <button className={S.actionItemClassName} onClick={handleCopyLink} type='button'>
          <span className={S.actionIconClassName}>
            <IcCopy aria-hidden='true' className={S.actionSvgClassName} />
          </span>
          <span className={S.actionTextClassName}>링크 복사</span>
        </button>
        <button
          className={S.actionItemClassName}
          disabled={isQrCodePending}
          onClick={onOpenQrModal}
          type='button'
        >
          <span className={S.actionIconClassName}>
            <IcLogin aria-hidden='true' className={S.actionSvgClassName} />
          </span>
          <span className={S.actionTextClassName}>
            {isQrCodePending ? 'QR코드 발급 중' : '매장 고유 QR코드 보기'}
          </span>
        </button>
      </Stack>

      <Button color='assistive' onClick={onGoHome} size='medium' variant='solid'>
        홈으로 돌아가기
      </Button>
    </Stack>
  );
};
