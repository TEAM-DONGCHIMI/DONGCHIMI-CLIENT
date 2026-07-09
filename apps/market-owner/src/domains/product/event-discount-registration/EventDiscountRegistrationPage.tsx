import { useEffect, useState, type ChangeEventHandler } from 'react';

import { Toast } from '@dongchimi/design-system/components';

import { DesktopHeader, UploadModal } from '@/shared/components';

import { PosExcelGuidePanel } from './components';
import {
  fileAnalysisConfirmFixture,
  fileAnalysisProgressFixtures,
  registrationMethodFixture,
} from './fixtures';
import {
  FileAnalysisConfirmSection,
  FileAnalysisProgressSection,
  RegistrationMethodSection,
} from './sections';
import * as S from './EventDiscountRegistrationPage.css';

type EventDiscountRegistrationViewTypes = 'method' | 'confirm' | 'progress';
type ExcelUploadStateTypes = 'default' | 'upload';
type ToastFeedbackTypes = {
  message: string;
  status: 'completed' | 'error';
} | null;

const EXCEL_UPLOAD_ACCEPT = '.xlsx,.csv';
const TOAST_DURATION_MS = 3000;

export const EventDiscountRegistrationPage = () => {
  const [registrationView, setRegistrationView] =
    useState<EventDiscountRegistrationViewTypes>('method');
  const [isExcelUploadModalOpen, setIsExcelUploadModalOpen] = useState(false);
  const [excelUploadState, setExcelUploadState] = useState<ExcelUploadStateTypes>('default');
  const [selectedExcelFileName, setSelectedExcelFileName] = useState<string>();
  const [uploadedExcelFileName, setUploadedExcelFileName] = useState<string>(
    fileAnalysisConfirmFixture.fileName,
  );
  const [isPosGuideOpen, setIsPosGuideOpen] = useState(false);
  const [toastFeedback, setToastFeedback] = useState<ToastFeedbackTypes>(null);
  const shouldShowMethod = registrationView === 'method';
  const shouldShowProgress = registrationView === 'progress';
  const headerLabels = shouldShowMethod
    ? {
        currentLabel: '행사 할인 상품 등록',
        parentLabel: '홈',
      }
    : {
        currentLabel: '등록 파일 분석',
        parentLabel: '행사 할인 상품 등록',
      };

  useEffect(() => {
    if (toastFeedback == null) {
      return;
    }

    const toastDismissTimer = setTimeout(() => setToastFeedback(null), TOAST_DURATION_MS);

    return () => clearTimeout(toastDismissTimer);
  }, [toastFeedback]);

  const resetExcelUploadModal = () => {
    setExcelUploadState('default');
    setSelectedExcelFileName(undefined);
  };

  const closeExcelUploadModal = () => {
    setIsExcelUploadModalOpen(false);
    resetExcelUploadModal();
  };

  const handleExcelUploadModalOpenChange = (open: boolean) => {
    setIsExcelUploadModalOpen(open);

    if (!open) {
      resetExcelUploadModal();
    }
  };

  const handleOpenExcelUpload = () => {
    resetExcelUploadModal();
    setIsExcelUploadModalOpen(true);
  };

  const handleExcelFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.currentTarget.files?.[0];

    if (file == null) {
      return;
    }

    setSelectedExcelFileName(file.name);
    setExcelUploadState('upload');
  };

  const handleUploadExcelFile = () => {
    if (excelUploadState !== 'upload' || selectedExcelFileName == null) {
      return;
    }

    setUploadedExcelFileName(selectedExcelFileName);
    closeExcelUploadModal();
    setRegistrationView('confirm');
  };

  const showToast = (toastFeedback: NonNullable<ToastFeedbackTypes>) => {
    setToastFeedback(toastFeedback);
  };

  const handleDownloadExcelTemplate = () => {
    showToast({
      message: registrationMethodFixture.toast.downloadSuccess,
      status: 'completed',
    });
  };

  const handleUploadLeaflet = () => {
    showToast({
      message: registrationMethodFixture.toast.leafletUnavailable,
      status: 'error',
    });
  };

  return (
    <main className={S.pageRootClassName}>
      <DesktopHeader
        className={S.pageHeaderClassName}
        currentLabel={headerLabels.currentLabel}
        parentLabel={headerLabels.parentLabel}
        showSearchBar={false}
      />

      {toastFeedback != null && (
        <div className={S.toastSlotClassName}>
          <Toast status={toastFeedback.status}>{toastFeedback.message}</Toast>
        </div>
      )}

      {shouldShowMethod ? (
        <RegistrationMethodSection
          fixture={registrationMethodFixture}
          onDownloadExcelTemplate={handleDownloadExcelTemplate}
          onOpenExcelUpload={handleOpenExcelUpload}
          onOpenPosGuide={() => setIsPosGuideOpen(true)}
          onUploadLeaflet={handleUploadLeaflet}
        />
      ) : shouldShowProgress ? (
        <FileAnalysisProgressSection
          onCancel={() => setRegistrationView('confirm')}
          progressPercentage={fileAnalysisProgressFixtures.processing.progressPercentage}
          steps={fileAnalysisProgressFixtures.processing.steps}
        />
      ) : (
        <FileAnalysisConfirmSection
          analysisItems={fileAnalysisConfirmFixture.analysisItems}
          fileName={uploadedExcelFileName}
          onCancel={() => setRegistrationView('method')}
          onStartAnalysis={() => setRegistrationView('progress')}
        />
      )}

      <UploadModal
        accept={EXCEL_UPLOAD_ACCEPT}
        className={S.excelUploadModalClassName}
        description={
          excelUploadState === 'upload'
            ? registrationMethodFixture.excelUploadModal.description
            : undefined
        }
        heading={registrationMethodFixture.excelUploadModal.heading}
        fileSelectTooltipLabel={
          excelUploadState === 'default'
            ? registrationMethodFixture.excelUploadModal.fileSelectTooltipLabel
            : undefined
        }
        label={registrationMethodFixture.excelUploadModal.defaultLabel}
        onFileChange={handleExcelFileChange}
        onOpenChange={handleExcelUploadModalOpenChange}
        onUpload={handleUploadExcelFile}
        open={isExcelUploadModalOpen}
        selectedFileText={
          selectedExcelFileName ?? registrationMethodFixture.excelUploadModal.selectedFileFallback
        }
        state={excelUploadState}
      />

      <PosExcelGuidePanel
        onClose={() => setIsPosGuideOpen(false)}
        open={isPosGuideOpen}
        posGuide={registrationMethodFixture.posGuide}
      />
    </main>
  );
};
