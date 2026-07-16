import { useCallback, useRef, useState } from 'react';
import { IcCircleCheckFill } from '@dongchimi/design-system/icons';
import { useToast } from '@dongchimi/shared/toast';

import { isApiError } from '@/shared/api';

import type { CancelProductImportParams, SubscribeProductImportProgressTypes } from '../api';
import { useCancelProductImportMutation } from '../hooks/use-cancel-product-import-mutation';
import { useProductImportProgress } from '../hooks/use-product-import-progress';
import type { ProductImportCompletedDataTypes } from '../model';
import { FileAnalysisProgressSection } from '../sections';

const FILE_ANALYSIS_ERROR_TOAST_ID = 'event-discount-registration-file-analysis-error';
const FILE_ANALYSIS_CANCEL_TOAST_ID = 'event-discount-registration-file-analysis-cancel';
const FILE_ANALYSIS_CONNECTION_ERROR_MESSAGE =
  '분석 진행 상태를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.';
const FILE_ANALYSIS_CANCEL_ERROR_MESSAGE = '파일 분석을 취소하지 못했습니다. 다시 시도해주세요.';
const TOAST_ICON_SIZE = '2.4rem';

const toastIconProps = {
  height: TOAST_ICON_SIZE,
  width: TOAST_ICON_SIZE,
} as const;

type CancelProductImportTypes = (params: CancelProductImportParams) => Promise<void>;

interface ProductImportProgressProps {
  cancelProductImport?: CancelProductImportTypes;
  jobId: string;
  marketId: CancelProductImportParams['marketId'];
  onCompleted: (data: ProductImportCompletedDataTypes) => void;
  onReturnToConfirmation: () => void;
  subscribeProductImportProgress?: SubscribeProductImportProgressTypes;
}

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  return isApiError(error) ? error.message : fallbackMessage;
};

export const ProductImportProgress = ({
  cancelProductImport,
  jobId,
  marketId,
  onCompleted,
  onReturnToConfirmation,
  subscribeProductImportProgress,
}: ProductImportProgressProps) => {
  const toast = useToast();
  const hasReturnedToConfirmationRef = useRef(false);
  const [isCancelRequested, setIsCancelRequested] = useState(false);
  const cancelProductImportMutation = useCancelProductImportMutation(cancelProductImport);
  const showErrorToast = useCallback(
    (message: string) => {
      toast.error(message, {
        id: FILE_ANALYSIS_ERROR_TOAST_ID,
      });
    },
    [toast],
  );
  const handleCanceled = useCallback(() => {
    if (hasReturnedToConfirmationRef.current) {
      return;
    }

    hasReturnedToConfirmationRef.current = true;
    toast.completed('상품 분석을 취소했습니다.', {
      id: FILE_ANALYSIS_CANCEL_TOAST_ID,
      icon: <IcCircleCheckFill {...toastIconProps} />,
    });
    onReturnToConfirmation();
  }, [onReturnToConfirmation, toast]);
  const handleConnectionError = useCallback(
    (error: unknown) => {
      showErrorToast(getErrorMessage(error, FILE_ANALYSIS_CONNECTION_ERROR_MESSAGE));
    },
    [showErrorToast],
  );
  const handleFailed = useCallback(
    ({ message }: { message: string }) => {
      showErrorToast(message);
      onReturnToConfirmation();
    },
    [onReturnToConfirmation, showErrorToast],
  );
  const { progressPercentage, steps } = useProductImportProgress({
    jobId,
    marketId,
    onCanceled: handleCanceled,
    onCompleted,
    onConnectionError: handleConnectionError,
    onFailed: handleFailed,
    subscribe: subscribeProductImportProgress,
  });
  const handleCancel = async () => {
    if (isCancelRequested || cancelProductImportMutation.isPending) {
      return;
    }

    setIsCancelRequested(true);

    try {
      await cancelProductImportMutation.mutateAsync({ jobId, marketId });
      handleCanceled();
    } catch (error) {
      setIsCancelRequested(false);
      showErrorToast(getErrorMessage(error, FILE_ANALYSIS_CANCEL_ERROR_MESSAGE));
    }
  };

  return (
    <FileAnalysisProgressSection
      isCancelPending={isCancelRequested || cancelProductImportMutation.isPending}
      onCancel={handleCancel}
      progressPercentage={progressPercentage}
      steps={steps}
    />
  );
};
