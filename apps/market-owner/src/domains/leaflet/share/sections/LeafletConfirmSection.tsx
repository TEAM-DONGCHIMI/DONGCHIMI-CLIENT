import { Button, Flex, Grid } from '@dongchimi/design-system/components';

import { LeafletSummaryCard, PhonePreviewFrame } from '../components';
import type { LeafletPreviewViewModel } from '../model/leaflet-preview-view-model';
import * as S from './LeafletConfirmSection.css';

export interface LeafletConfirmSectionProps {
  isPreviewError?: boolean;
  isPreviewPending?: boolean;
  isPublishing?: boolean;
  leafletPreview?: LeafletPreviewViewModel;
  onPreviewRetry: () => void;
  onShare: () => void;
}

export const LeafletConfirmSection = ({
  isPreviewError = false,
  isPreviewPending = false,
  isPublishing = false,
  leafletPreview,
  onPreviewRetry,
  onShare,
}: LeafletConfirmSectionProps) => {
  const shouldRenderPreview = leafletPreview != null && !isPreviewPending && !isPreviewError;

  return (
    <Grid aria-labelledby='leaflet-confirm-title' as='section' className={S.sectionClassName}>
      <Flex className={S.headingGroupClassName} direction='column'>
        <h1 className={S.titleClassName} id='leaflet-confirm-title'>
          오늘의 전단 최종 확인
        </h1>
        <p className={S.descriptionClassName}>공유하기 전에 전단 내용을 한 번 더 확인해주세요.</p>
      </Flex>

      {isPreviewPending ? (
        <Flex align='center' className={S.stateClassName} justify='center'>
          전단 미리보기를 불러오는 중입니다.
        </Flex>
      ) : null}

      {isPreviewError ? (
        <Flex align='center' className={S.stateClassName} direction='column' justify='center'>
          <p className={S.stateMessageClassName}>전단 미리보기를 불러오지 못했습니다.</p>
          <Button color='assistiveLight' size='medium' variant='outlined' onClick={onPreviewRetry}>
            다시 불러오기
          </Button>
        </Flex>
      ) : null}

      {shouldRenderPreview ? (
        <Grid align='start' className={S.contentClassName}>
          <LeafletSummaryCard
            isPublishing={isPublishing}
            leafletSummary={leafletPreview.summary}
            onShare={onShare}
          />
          <PhonePreviewFrame preview={leafletPreview.phonePreview} />
        </Grid>
      ) : null}
    </Grid>
  );
};
