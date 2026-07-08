import { DesktopHeader } from '@/shared/components';

import { fileAnalysisConfirmFixture } from './fixtures';
import { FileAnalysisConfirmSection } from './sections';
import * as S from './EventDiscountRegistrationPage.css';

const noop = () => undefined;

export const EventDiscountRegistrationPage = () => {
  return (
    <main className={S.pageRootClassName}>
      <DesktopHeader
        currentLabel='등록 파일 분석'
        parentLabel='행사 할인 상품 등록'
        showSearchBar={false}
      />

      <FileAnalysisConfirmSection
        analysisItems={fileAnalysisConfirmFixture.analysisItems}
        fileName={fileAnalysisConfirmFixture.fileName}
        onCancel={noop}
        onStartAnalysis={noop}
      />
    </main>
  );
};
