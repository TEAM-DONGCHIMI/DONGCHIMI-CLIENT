import { useState, type ReactNode } from 'react';
import { IcCircleCheckFill, IcCircleExclamationFillColor0 } from '@dongchimi/design-system/icons';
import { useToast } from '@dongchimi/shared/toast';

import { DesktopHeader, UploadModal } from '@/shared/components';

import { PosExcelGuidePanel } from './components/PosExcelGuidePanel';
import { fileAnalysisConfirmFixture } from './fixtures/file-analysis-confirm.fixture';
import { fileAnalysisProgressFixtures } from './fixtures/file-analysis-progress.fixture';
import { useExcelUploadFlow } from './hooks/useExcelUploadFlow';
import { FileAnalysisConfirmSection } from './sections/FileAnalysisConfirmSection';
import { FileAnalysisProgressSection } from './sections/FileAnalysisProgressSection';
import { RegistrationMethodSection } from './sections/RegistrationMethodSection';
import * as S from './EventDiscountRegistrationPage.css';

const EXCEL_UPLOAD_ACCEPT = '.xlsx,.csv';
const ACTION_FEEDBACK_TOAST_ID = 'event-discount-registration-action-feedback';
const TOAST_ICON_SIZE = '2.4rem';

const toastIconProps = {
  height: TOAST_ICON_SIZE,
  width: TOAST_ICON_SIZE,
} as const;

export const EventDiscountRegistrationPage = () => {
  const toast = useToast();
  const [isPosGuideOpen, setIsPosGuideOpen] = useState(false);
  const {
    cancelFileAnalysisConfirmation,
    cancelFileAnalysisProgress,
    excelUploadModal,
    handleExcelFileChange,
    handleExcelUploadModalOpenChange,
    openExcelUpload,
    registrationView,
    startFileAnalysis,
    uploadExcelFile,
    uploadedExcelFileName,
  } = useExcelUploadFlow();
  const headerLabels =
    registrationView === 'method'
      ? {
          currentLabel: '행사 할인 상품 등록',
          parentLabel: '홈',
        }
      : {
          currentLabel: '등록 파일 분석',
          parentLabel: '행사 할인 상품 등록',
        };

  const handleDownloadExcelTemplate = () => {
    toast.completed('엑셀 양식 다운로드 완료', {
      id: ACTION_FEEDBACK_TOAST_ID,
      icon: <IcCircleCheckFill {...toastIconProps} />,
    });
  };

  const handleUploadLeaflet = () => {
    toast.error('아직 준비중인 기능이에요.', {
      id: ACTION_FEEDBACK_TOAST_ID,
      icon: <IcCircleExclamationFillColor0 {...toastIconProps} />,
    });
  };

  let registrationContent: ReactNode = null;

  if (registrationView === 'method') {
    registrationContent = (
      <RegistrationMethodSection
        onDownloadExcelTemplate={handleDownloadExcelTemplate}
        onOpenExcelUpload={openExcelUpload}
        onOpenPosGuide={() => setIsPosGuideOpen(true)}
        onUploadLeaflet={handleUploadLeaflet}
      />
    );
  } else if (registrationView === 'progress') {
    registrationContent = (
      <FileAnalysisProgressSection
        onCancel={cancelFileAnalysisProgress}
        progressPercentage={fileAnalysisProgressFixtures.processing.progressPercentage}
        steps={fileAnalysisProgressFixtures.processing.steps}
      />
    );
  } else if (uploadedExcelFileName != null) {
    registrationContent = (
      <FileAnalysisConfirmSection
        analysisItems={fileAnalysisConfirmFixture.analysisItems}
        fileName={uploadedExcelFileName}
        onCancel={cancelFileAnalysisConfirmation}
        onStartAnalysis={startFileAnalysis}
      />
    );
  }

  return (
    <main className={S.pageRootClassName}>
      <DesktopHeader
        currentLabel={headerLabels.currentLabel}
        parentLabel={headerLabels.parentLabel}
        showSearchBar={false}
      />

      {registrationContent}

      <UploadModal
        accept={EXCEL_UPLOAD_ACCEPT}
        className={S.excelUploadModalClassName}
        description={excelUploadModal.state === 'upload' ? '선택한 파일' : undefined}
        heading='엑셀 파일 업로드'
        fileSelectTooltipLabel={
          excelUploadModal.state === 'default' ? '지원 파일은 .xlsx, .csv예요.' : undefined
        }
        label={'상품이 등록된 엑셀 파일을 선택해주세요.\n업로드하면 상품이 자동으로 등록됩니다.'}
        onFileChange={handleExcelFileChange}
        onOpenChange={handleExcelUploadModalOpenChange}
        onUpload={uploadExcelFile}
        open={excelUploadModal.open}
        selectedFileText={excelUploadModal.selectedFileName ?? '선택된 파일이 없습니다.'}
        state={excelUploadModal.state}
      />

      <PosExcelGuidePanel onClose={() => setIsPosGuideOpen(false)} open={isPosGuideOpen} />
    </main>
  );
};
