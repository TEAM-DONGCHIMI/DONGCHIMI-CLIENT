import { Flex, Grid } from '@dongchimi/design-system/components';

import { LeafletSummaryCard, PhonePreviewFrame } from '../components';
import type { LeafletSummaryFixture } from '../fixtures/leaflet-share.fixture';
import * as S from './LeafletConfirmSection.css';

export interface LeafletConfirmSectionProps {
  isPublishing?: boolean;
  leafletSummary: LeafletSummaryFixture;
  onShare: () => void;
}

export const LeafletConfirmSection = ({
  isPublishing = false,
  leafletSummary,
  onShare,
}: LeafletConfirmSectionProps) => {
  return (
    <Grid aria-labelledby='leaflet-confirm-title' as='section' className={S.sectionClassName}>
      <Flex className={S.headingGroupClassName} direction='column'>
        <h1 className={S.titleClassName} id='leaflet-confirm-title'>
          오늘의 전단 최종 확인
        </h1>
        <p className={S.descriptionClassName}>공유하기 전에 전단 내용을 한 번 더 확인해주세요.</p>
      </Flex>

      <Grid align='start' className={S.contentClassName}>
        <LeafletSummaryCard
          isPublishing={isPublishing}
          leafletSummary={leafletSummary}
          onShare={onShare}
        />
        <PhonePreviewFrame />
      </Grid>
    </Grid>
  );
};
