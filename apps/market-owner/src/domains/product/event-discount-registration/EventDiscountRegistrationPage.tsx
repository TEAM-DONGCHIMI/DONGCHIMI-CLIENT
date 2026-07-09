import { useState } from 'react';

import { DesktopHeader } from '@/shared/components';

import { fileAnalysisConfirmFixture, fileAnalysisProgressFixtures } from './fixtures';
import { FileAnalysisConfirmSection, FileAnalysisProgressSection } from './sections';
import * as S from './EventDiscountRegistrationPage.css';

const noop = () => undefined;
type FileAnalysisViewTypes = 'confirm' | 'progress';

export const EventDiscountRegistrationPage = () => {
  const [fileAnalysisView, setFileAnalysisView] = useState<FileAnalysisViewTypes>('confirm');
  const shouldShowProgress = fileAnalysisView === 'progress';

  return (
    <main className={S.pageRootClassName}>
      <DesktopHeader
        className={S.pageHeaderClassName}
        currentLabel='등록 파일 분석'
        parentLabel='행사 할인 상품 등록'
        showSearchBar={false}
      />

      {shouldShowProgress ? (
        <FileAnalysisProgressSection
          onCancel={() => setFileAnalysisView('confirm')}
          progressPercentage={fileAnalysisProgressFixtures.processing.progressPercentage}
          steps={fileAnalysisProgressFixtures.processing.steps}
        />
      ) : (
        <FileAnalysisConfirmSection
          analysisItems={fileAnalysisConfirmFixture.analysisItems}
          fileName={fileAnalysisConfirmFixture.fileName}
          onCancel={noop}
          onStartAnalysis={() => setFileAnalysisView('progress')}
        />
      )}
    </main>
  );
};
