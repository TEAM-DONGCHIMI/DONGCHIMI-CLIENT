import { TextButton } from '@dongchimi/design-system/components';

import { useOwnerHomeQuery } from '@/domains/home/hooks/use-owner-home-query';

import { HomeProductSummarySection } from './HomeProductSummarySection';
import { HomeShareSection, type HomeShareSectionProps } from './HomeShareSection';
import { createHomeDashboardViewModel } from '../model/home-dashboard-view-model';
import * as S from '../HomePage.css';

interface HomeDashboardSectionProps {
  onCopyLinkResult: HomeShareSectionProps['onCopyLinkResult'];
  onQrCodePreparing: HomeShareSectionProps['onQrCodePreparing'];
}

export const HomeDashboardSection = ({
  onCopyLinkResult,
  onQrCodePreparing,
}: HomeDashboardSectionProps) => {
  const { data, isError, isPending, refetch } = useOwnerHomeQuery();

  if (isPending) {
    return (
      <div className={S.dashboardQueryStateClassName} role='status'>
        홈 정보를 불러오는 중입니다.
      </div>
    );
  }

  if (isError || data === undefined) {
    return (
      <div className={S.dashboardQueryStateClassName} role='alert'>
        <p className={S.dashboardQueryErrorMessageClassName}>홈 정보를 불러오지 못했어요.</p>
        <TextButton onClick={() => void refetch()}>다시 불러오기</TextButton>
      </div>
    );
  }

  const { sections, share } = createHomeDashboardViewModel(data);

  return (
    <div className={S.dashboardGridClassName}>
      <HomeProductSummarySection sections={sections} />
      <HomeShareSection
        onCopyLinkResult={onCopyLinkResult}
        onQrCodePreparing={onQrCodePreparing}
        share={share}
      />
    </div>
  );
};
