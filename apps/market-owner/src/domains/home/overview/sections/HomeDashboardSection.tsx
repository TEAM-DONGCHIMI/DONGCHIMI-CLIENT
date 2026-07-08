import { HomeProductSummarySection } from './HomeProductSummarySection';
import { HomeShareSection, type HomeShareSectionProps } from './HomeShareSection';
import * as S from '../HomePage.css';

interface HomeDashboardSectionProps {
  onCopyLinkResult: HomeShareSectionProps['onCopyLinkResult'];
  onQrCodePreparing: HomeShareSectionProps['onQrCodePreparing'];
}

export const HomeDashboardSection = ({
  onCopyLinkResult,
  onQrCodePreparing,
}: HomeDashboardSectionProps) => {
  return (
    <div className={S.dashboardGridClassName}>
      <HomeProductSummarySection />
      <HomeShareSection onCopyLinkResult={onCopyLinkResult} onQrCodePreparing={onQrCodePreparing} />
    </div>
  );
};
