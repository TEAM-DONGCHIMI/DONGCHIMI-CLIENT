import { useState, type ChangeEventHandler, type ReactNode } from 'react';
import { IcCircleCheckFill, IcCircleExclamationFillColor0 } from '@dongchimi/design-system/icons';
import { useToast } from '@dongchimi/shared/toast';

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

const EXCEL_UPLOAD_ACCEPT = '.xlsx,.csv';
const ACTION_FEEDBACK_TOAST_ID = 'event-discount-registration-action-feedback';
const TOAST_ICON_SIZE = '2.4rem';

const toastIconProps = {
  height: TOAST_ICON_SIZE,
  width: TOAST_ICON_SIZE,
} as const;

export const EventDiscountRegistrationPage = () => {
  const toast = useToast();
  const [registrationView, setRegistrationView] =
    useState<EventDiscountRegistrationViewTypes>('method');
  const [isExcelUploadModalOpen, setIsExcelUploadModalOpen] = useState(false);
  const [excelUploadState, setExcelUploadState] = useState<ExcelUploadStateTypes>('default');
  const [selectedExcelFileName, setSelectedExcelFileName] = useState<string>();
  const [uploadedExcelFileName, setUploadedExcelFileName] = useState<string>();
  const [isPosGuideOpen, setIsPosGuideOpen] = useState(false);
  const shouldShowMethod =
    registrationView === 'method' ||
    (registrationView === 'confirm' && uploadedExcelFileName == null);
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

  const handleDownloadExcelTemplate = () => {
    toast.completed(registrationMethodFixture.toast.downloadSuccess, {
      id: ACTION_FEEDBACK_TOAST_ID,
      icon: <IcCircleCheckFill {...toastIconProps} />,
    });
  };

  const handleUploadLeaflet = () => {
    toast.error(registrationMethodFixture.toast.leafletUnavailable, {
      id: ACTION_FEEDBACK_TOAST_ID,
      icon: <IcCircleExclamationFillColor0 {...toastIconProps} />,
    });
  };

  let registrationContent: ReactNode = null;

  if (shouldShowMethod) {
    registrationContent = (
      <RegistrationMethodSection
        fixture={registrationMethodFixture}
        onDownloadExcelTemplate={handleDownloadExcelTemplate}
        onOpenExcelUpload={handleOpenExcelUpload}
        onOpenPosGuide={() => setIsPosGuideOpen(true)}
        onUploadLeaflet={handleUploadLeaflet}
      />
    );
  } else if (shouldShowProgress) {
    registrationContent = (
      <FileAnalysisProgressSection
        onCancel={() => setRegistrationView('confirm')}
        progressPercentage={fileAnalysisProgressFixtures.processing.progressPercentage}
        steps={fileAnalysisProgressFixtures.processing.steps}
      />
    );
  } else if (uploadedExcelFileName != null) {
    registrationContent = (
      <FileAnalysisConfirmSection
        analysisItems={fileAnalysisConfirmFixture.analysisItems}
        fileName={uploadedExcelFileName}
        onCancel={() => setRegistrationView('method')}
        onStartAnalysis={() => setRegistrationView('progress')}
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
