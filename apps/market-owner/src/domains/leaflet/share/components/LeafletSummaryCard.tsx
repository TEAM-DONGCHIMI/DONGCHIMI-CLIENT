import { Button, Flex, Stack } from '@dongchimi/design-system/components';

import type { LeafletSummaryViewModel } from '../model/leaflet-preview-view-model';
import * as S from './LeafletSummaryCard.css';

export interface LeafletSummaryCardProps {
  isPublishing?: boolean;
  leafletSummary: LeafletSummaryViewModel;
  onEdit: () => void;
  onShare: () => void;
}

export const LeafletSummaryCard = ({
  isPublishing = false,
  leafletSummary,
  onEdit,
  onShare,
}: LeafletSummaryCardProps) => {
  return (
    <Stack
      aria-labelledby='leaflet-summary-title'
      as='section'
      className={S.cardClassName}
      gap='none'
    >
      <h2 className={S.titleClassName} id='leaflet-summary-title'>
        전단 요약
      </h2>

      <Stack as='dl' className={S.summaryListClassName}>
        <Flex align='center' as='div' justify='between'>
          <dt className={S.summaryTermClassName}>오늘의 특가</dt>
          <dd className={S.summaryDescriptionClassName}>
            {leafletSummary.todaySpecialProductCount}개
          </dd>
        </Flex>
        <Flex align='center' as='div' justify='between'>
          <dt className={S.summaryTermClassName}>행사 할인 상품</dt>
          <dd className={S.summaryDescriptionClassName}>
            {leafletSummary.eventDiscountProductCount}개
          </dd>
        </Flex>
      </Stack>

      <Stack className={S.actionGroupClassName}>
        <Button color='assistiveLight' onClick={onEdit} size='medium' variant='outlined'>
          전단 수정하기
        </Button>
        <Button disabled={isPublishing} onClick={onShare} size='medium'>
          {isPublishing ? '전단 발행 중' : '전단 공유하기'}
        </Button>
      </Stack>
    </Stack>
  );
};
