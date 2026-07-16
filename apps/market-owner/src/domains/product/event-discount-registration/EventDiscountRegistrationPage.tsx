import { useCallback, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useToast } from '@dongchimi/shared/toast';

import { DesktopHeader, UploadModal } from '@/shared/components';
import { isApiError } from '@/shared/api';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { useAuthStore } from '@/shared/stores/auth-store';
import { usePresignedUploadMutation } from '@/domains/product/hooks';
import {
  createProductImportRouteState,
  getProductImportFileConfirmation,
} from '@/domains/product/model/product-import-route-state';

import type {
  CancelProductImportParams,
  ProductImportResponseTypes,
  StartProductImportParams,
  SubscribeProductImportProgressTypes,
} from './api';
import { PosExcelGuidePanel, ProductImportProgress } from './components';
import { fileAnalysisConfirmFixture } from './fixtures';
import { useExcelUploadFlow } from './hooks/useExcelUploadFlow';
import { useStartProductImportMutation } from './hooks/use-start-product-import-mutation';
import { FileAnalysisConfirmSection, RegistrationMethodSection } from './sections';
import * as S from './EventDiscountRegistrationPage.css';
import { type ResolveExcelFileUrlTypes } from './utils/resolve-excel-file-url';
import { resolvePresignedExcelFileUrl } from './utils/resolve-excel-file-url';

const EXCEL_UPLOAD_ACCEPT = '.xlsx,.csv';
const EXCEL_UPLOAD_ERROR_TOAST_ID = 'event-discount-registration-excel-upload-error';
const FILE_ANALYSIS_ERROR_TOAST_ID = 'event-discount-registration-file-analysis-error';
export const EXCEL_TEMPLATE_DOWNLOAD_URL =
  'https://static.dongchiimi.com/static/%E1%84%83%E1%85%A9%E1%86%BC%E1%84%8E%E1%85%B5%E1%84%86%E1%85%B5+%E1%84%92%E1%85%A2%E1%86%BC%E1%84%89%E1%85%A1%E1%84%92%E1%85%A1%E1%86%AF%E1%84%8B%E1%85%B5%E1%86%AB+%E1%84%89%E1%85%A1%E1%86%BC%E1%84%91%E1%85%AE%E1%86%B7+%E1%84%83%E1%85%B3%E1%86%BC%E1%84%85%E1%85%A9%E1%86%A8+%E1%84%8B%E1%85%A3%E1%86%BC%E1%84%89%E1%85%B5%E1%86%A8.xlsx';
const EXCEL_UPLOAD_DEFAULT_LABEL =
  '상품이 등록된 엑셀 파일을 선택해주세요.\n업로드하면 상품이 자동으로 등록됩니다.';
const FILE_ANALYSIS_START_ERROR_MESSAGE = '파일 분석을 시작하지 못했습니다. 다시 시도해주세요.';
const FILE_ANALYSIS_ERROR_LOG_PREFIX = '[EventDiscountRegistration] Failed to start product import';

const getFileAnalysisStartErrorMessage = (error: unknown) => {
  return isApiError(error) ? error.message : FILE_ANALYSIS_START_ERROR_MESSAGE;
};

export interface EventDiscountRegistrationPageProps {
  cancelProductImport?: (params: CancelProductImportParams) => Promise<void>;
  marketId?: StartProductImportParams['marketId'];
  resolveExcelFileUrl?: ResolveExcelFileUrlTypes;
  startProductImport?: (params: StartProductImportParams) => Promise<ProductImportResponseTypes>;
  subscribeProductImportProgress?: SubscribeProductImportProgressTypes;
}

export const EventDiscountRegistrationPage = ({
  cancelProductImport,
  marketId,
  resolveExcelFileUrl,
  startProductImport,
  subscribeProductImportProgress,
}: EventDiscountRegistrationPageProps = {}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const presignedUploadMutation = usePresignedUploadMutation();
  const startProductImportMutation = useStartProductImportMutation();
  const sessionMarketId = useAuthStore((state) => state.marketId);
  const resolvedMarketId = marketId ?? sessionMarketId;
  const [isPosGuideOpen, setIsPosGuideOpen] = useState(false);
  const resolveUploadedExcelFileUrl =
    resolveExcelFileUrl ?? resolvePresignedExcelFileUrl(presignedUploadMutation.mutateAsync);
  const handleExcelUploadError = (message: string) => {
    toast.error(message, {
      id: EXCEL_UPLOAD_ERROR_TOAST_ID,
    });
  };
  const {
    cancelFileAnalysisConfirmation,
    confirmExcelUpload,
    excelUploadModal,
    handleExcelFileChange,
    handleExcelFileDrop,
    handleExcelUploadModalOpenChange,
    isUploading,
    isUploadedExcelFileReady,
    openExcelUpload,
    productImportJobId,
    registrationView,
    returnToFileAnalysisConfirmation,
    startFileAnalysis,
    uploadedExcelFileUrl,
    uploadedExcelFileName,
  } = useExcelUploadFlow({
    initialFileConfirmation: getProductImportFileConfirmation(location.state),
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
    window.open(EXCEL_TEMPLATE_DOWNLOAD_URL, '_blank', 'noopener');
  };

  const handleUploadLeaflet = () => {
    toast.error('아직 준비중인 기능이에요.', {
      id: 'event-discount-registration-action-feedback',
    });
  };

  const handleFileAnalysisComplete = useCallback(() => {
    if (uploadedExcelFileName == null || uploadedExcelFileUrl == null) {
      navigate(MARKET_OWNER_ROUTES.registrationResult);
      return;
    }

    const routeState = createProductImportRouteState({
      fileName: uploadedExcelFileName,
      fileUrl: uploadedExcelFileUrl,
    });
    const navigateToRegistrationResult = async () => {
      await navigate(MARKET_OWNER_ROUTES.eventDiscountRegistration, {
        replace: true,
        state: routeState,
      });
      await navigate(MARKET_OWNER_ROUTES.registrationResult, { state: routeState });
    };

    void navigateToRegistrationResult();
  }, [navigate, uploadedExcelFileName, uploadedExcelFileUrl]);
  const handleStartFileAnalysis = async () => {
    if (resolvedMarketId == null || uploadedExcelFileUrl == null) {
      toast.error(FILE_ANALYSIS_START_ERROR_MESSAGE, {
        id: FILE_ANALYSIS_ERROR_TOAST_ID,
      });
      return;
    }

    try {
      const startImport = startProductImport ?? startProductImportMutation.mutateAsync;
      const result = await startImport({
        marketId: resolvedMarketId,
        request: {
          excelFileUrl: uploadedExcelFileUrl,
        },
      });

      startFileAnalysis(result.jobId);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(FILE_ANALYSIS_ERROR_LOG_PREFIX, error);
      }

      toast.error(getFileAnalysisStartErrorMessage(error), {
        id: FILE_ANALYSIS_ERROR_TOAST_ID,
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
  } else if (
    registrationView === 'progress' &&
    resolvedMarketId != null &&
    productImportJobId != null
  ) {
    registrationContent = (
      <ProductImportProgress
        cancelProductImport={cancelProductImport}
        jobId={productImportJobId}
        marketId={resolvedMarketId}
        onCompleted={handleFileAnalysisComplete}
        onReturnToConfirmation={returnToFileAnalysisConfirmation}
        subscribeProductImportProgress={subscribeProductImportProgress}
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
        onUpload={confirmExcelUpload}
        open={excelUploadModal.open}
        selectedFileText={excelUploadModal.selectedFileName ?? '선택된 파일이 없습니다.'}
        state={excelUploadModal.state}
        uploadButtonDisabled={
          excelUploadModal.state !== 'upload' || isUploading || !isUploadedExcelFileReady
        }
      />

      <PosExcelGuidePanel onClose={() => setIsPosGuideOpen(false)} open={isPosGuideOpen} />
    </main>
  );
};
