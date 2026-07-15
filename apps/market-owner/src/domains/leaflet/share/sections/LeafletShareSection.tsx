import { Flex, Grid } from '@dongchimi/design-system/components';

import { ShareLinkBox } from '../components';
import * as S from './LeafletShareSection.css';

export interface LeafletShareSectionProps {
  isQrCodePending?: boolean;
  shareUrl: string;
  onCopyLink: () => void;
  onCopyLinkError: () => void;
  onGoHome: () => void;
  onOpenQrModal: () => void;
}

export const LeafletShareSection = ({
  isQrCodePending = false,
  shareUrl,
  onCopyLink,
  onCopyLinkError,
  onGoHome,
  onOpenQrModal,
}: LeafletShareSectionProps) => {
  return (
    <Grid aria-labelledby='leaflet-share-title' as='section' className={S.sectionClassName}>
      <Flex className={S.headingGroupClassName} direction='column'>
        <h1 className={S.titleClassName} id='leaflet-share-title'>
          오늘의 전단 공유
        </h1>
        <p className={S.descriptionClassName}>
          공유 링크 또는 QR 코드로 손님들에게 전단을 전달해보세요.
        </p>
      </Flex>

      <Flex align='start' justify='center'>
        <ShareLinkBox
          isQrCodePending={isQrCodePending}
          shareUrl={shareUrl}
          onCopyLink={onCopyLink}
          onCopyLinkError={onCopyLinkError}
          onGoHome={onGoHome}
          onOpenQrModal={onOpenQrModal}
        />
      </Flex>
    </Grid>
  );
};
