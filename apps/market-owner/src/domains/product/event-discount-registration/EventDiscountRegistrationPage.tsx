import { useCallback, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { IcCircleCheckFill, IcCircleExclamationFillColor0 } from '@dongchimi/design-system/icons';
import { useToast } from '@dongchimi/shared/toast';

import { DesktopHeader, UploadModal } from '@/shared/components';
import { isApiError } from '@/shared/api';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { usePresignedUploadMutation } from '@/domains/product/hooks';

import { type ProductImportResponseTypes, type StartProductImportParams } from './api';
import { PosExcelGuidePanel } from './components';
import { fileAnalysisConfirmFixture } from './fixtures';
import { useExcelUploadFlow } from './hooks/useExcelUploadFlow';
import { useFileAnalysisSimulation } from './hooks/useFileAnalysisSimulation';
import { useStartProductImportMutation } from './hooks/use-start-product-import-mutation';
import {
  FileAnalysisConfirmSection,
  FileAnalysisProgressSection,
  RegistrationMethodSection,
} from './sections';
import * as S from './EventDiscountRegistrationPage.css';
import { type ResolveExcelFileUrlTypes } from './utils/resolve-excel-file-url';
import { resolvePresignedExcelFileUrl } from './utils/resolve-excel-file-url';

const EXCEL_UPLOAD_ACCEPT = '.xlsx,.csv';
const ACTION_FEEDBACK_TOAST_ID = 'event-discount-registration-action-feedback';
const EXCEL_UPLOAD_ERROR_TOAST_ID = 'event-discount-registration-excel-upload-error';
const FILE_ANALYSIS_ERROR_TOAST_ID = 'event-discount-registration-file-analysis-error';
const TOAST_ICON_SIZE = '2.4rem';
const EXCEL_UPLOAD_DEFAULT_LABEL =
  '상품이 등록된 엑셀 파일을 선택해주세요.\n업로드하면 상품이 자동으로 등록됩니다.';
const FILE_ANALYSIS_START_ERROR_MESSAGE = '파일 분석을 시작하지 못했습니다. 다시 시도해주세요.';
const FILE_ANALYSIS_ERROR_LOG_PREFIX = '[EventDiscountRegistration] Failed to start product import';

const toastIconProps = {
  height: TOAST_ICON_SIZE,
  width: TOAST_ICON_SIZE,
} as const;

const getFileAnalysisStartErrorMessage = (error: unknown) => {
  return isApiError(error) ? error.message : FILE_ANALYSIS_START_ERROR_MESSAGE;
};

const SimulatedFileAnalysisProgressSection = ({
  onCancel,
  onComplete,
}: {
  onCancel: () => void;
  onComplete: () => void;
}) => {
  const { progressPercentage, steps } = useFileAnalysisSimulation({ onComplete });

  return (
    <FileAnalysisProgressSection
      onCancel={onCancel}
      progressPercentage={progressPercentage}
      steps={steps}
    />
  );
};

export interface EventDiscountRegistrationPageProps {
  marketId?: StartProductImportParams['marketId'];
  resolveExcelFileUrl?: ResolveExcelFileUrlTypes;
  startProductImport?: (params: StartProductImportParams) => Promise<ProductImportResponseTypes>;
}

export const EventDiscountRegistrationPage = ({
  marketId,
  resolveExcelFileUrl,
  startProductImport,
}: EventDiscountRegistrationPageProps = {}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const presignedUploadMutation = usePresignedUploadMutation();
  const startProductImportMutation = useStartProductImportMutation();
  const [isPosGuideOpen, setIsPosGuideOpen] = useState(false);
  const resolveUploadedExcelFileUrl =
    resolveExcelFileUrl ?? resolvePresignedExcelFileUrl(presignedUploadMutation.mutateAsync);
  const handleExcelUploadError = (message: string) => {
    toast.error(message, {
      id: EXCEL_UPLOAD_ERROR_TOAST_ID,
      icon: <IcCircleExclamationFillColor0 {...toastIconProps} />,
    });
  };
  const {
    cancelFileAnalysisConfirmation,
    cancelFileAnalysisProgress,
    excelUploadModal,
    handleExcelFileChange,
    handleExcelFileDrop,
    handleExcelUploadModalOpenChange,
    isUploading,
    isUploadedExcelFileReady,
    openExcelUpload,
    registrationView,
    startFileAnalysis,
    uploadedExcelFileUrl,
    uploadedExcelFileName,
  } = useExcelUploadFlow({
    onExcelUploadError: handleExcelUploadError,
    resolveExcelFileUrl: resolveUploadedExcelFileUrl,
  });
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

  const handleFileAnalysisComplete = useCallback(() => {
    navigate(MARKET_OWNER_ROUTES.registrationResult);
  }, [navigate]);
  const handleStartFileAnalysis = async () => {
    if (marketId == null || uploadedExcelFileUrl == null) {
      toast.error(FILE_ANALYSIS_START_ERROR_MESSAGE, {
        id: FILE_ANALYSIS_ERROR_TOAST_ID,
        icon: <IcCircleExclamationFillColor0 {...toastIconProps} />,
      });
      return;
    }

    try {
      const startImport = startProductImport ?? startProductImportMutation.mutateAsync;
      await startImport({
        marketId,
        request: {
          excelFileUrl: uploadedExcelFileUrl,
        },
      });

      startFileAnalysis();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(FILE_ANALYSIS_ERROR_LOG_PREFIX, error);
      }

      toast.error(getFileAnalysisStartErrorMessage(error), {
        id: FILE_ANALYSIS_ERROR_TOAST_ID,
        icon: <IcCircleExclamationFillColor0 {...toastIconProps} />,
      });
    }
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
      <SimulatedFileAnalysisProgressSection
        onCancel={cancelFileAnalysisProgress}
        onComplete={handleFileAnalysisComplete}
      />
    );
  } else if (uploadedExcelFileName != null) {
    registrationContent = (
      <FileAnalysisConfirmSection
        analysisItems={fileAnalysisConfirmFixture.analysisItems}
        fileName={uploadedExcelFileName}
        isStartAnalysisPending={startProductImportMutation.isPending}
        onCancel={cancelFileAnalysisConfirmation}
        onStartAnalysis={handleStartFileAnalysis}
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
        label={excelUploadModal.errorMessage ?? EXCEL_UPLOAD_DEFAULT_LABEL}
        onFileChange={handleExcelFileChange}
        onFileDrop={handleExcelFileDrop}
        onOpenChange={handleExcelUploadModalOpenChange}
        onUpload={handleStartFileAnalysis}
        open={excelUploadModal.open}
        selectedFileText={excelUploadModal.selectedFileName ?? '선택된 파일이 없습니다.'}
        state={excelUploadModal.state}
        uploadButtonDisabled={
          excelUploadModal.state !== 'upload' ||
          isUploading ||
          !isUploadedExcelFileReady ||
          startProductImportMutation.isPending
        }
      />

      <PosExcelGuidePanel onClose={() => setIsPosGuideOpen(false)} open={isPosGuideOpen} />
    </main>
  );
};
