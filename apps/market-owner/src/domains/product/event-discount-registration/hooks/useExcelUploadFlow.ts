import { useReducer, type ChangeEventHandler } from 'react';

import { isApiError } from '@/shared/api';

import { useFileDrop } from '../../hooks';
import {
  resolvePresignedExcelFileUrl,
  type ResolveExcelFileUrlTypes,
} from '../utils/resolve-excel-file-url';

export type EventDiscountRegistrationViewTypes = 'method' | 'confirm' | 'progress';

type ExcelUploadModalStateTypes = 'default' | 'upload' | 'error';

interface ExcelUploadFlowState {
  excelUploadErrorMessage?: string;
  isExcelUploadModalOpen: boolean;
  isUploading: boolean;
  registrationView: EventDiscountRegistrationViewTypes;
  selectedExcelFile?: File;
  selectedExcelFileName?: string;
  uploadedExcelFileUrl?: string;
  uploadedExcelFileName?: string;
}

type ExcelUploadFlowActionTypes =
  | { type: 'OPEN_EXCEL_UPLOAD_MODAL' }
  | { open: boolean; type: 'SET_EXCEL_UPLOAD_MODAL_OPEN' }
  | { file: File; type: 'SELECT_EXCEL_FILE' }
  | { errorMessage: string; type: 'REJECT_EXCEL_FILE' }
  | { type: 'START_EXCEL_FILE_UPLOAD' }
  | { excelFileUrl: string; type: 'UPLOAD_EXCEL_FILE_SUCCESS' }
  | { type: 'CANCEL_FILE_ANALYSIS_CONFIRMATION' }
  | { type: 'START_FILE_ANALYSIS' }
  | { type: 'CANCEL_FILE_ANALYSIS_PROGRESS' };

interface UseExcelUploadFlowParams {
  onExcelUploadError?: (message: string) => void;
  resolveExcelFileUrl?: ResolveExcelFileUrlTypes;
}

const EXCEL_UPLOAD_ACCEPTED_EXTENSIONS = ['.xlsx', '.csv'] as const;
const EXCEL_UPLOAD_FILE_FORMAT_ERROR_MESSAGE = '파일을 선택하지 못했습니다. 다시 선택해주세요.';
const EXCEL_UPLOAD_FAILED_ERROR_MESSAGE = '파일 업로드에 실패했습니다. 다시 시도해주세요.';
const EXCEL_UPLOAD_ERROR_LOG_PREFIX = '[EventDiscountRegistration] Failed to upload excel file';

const initialExcelUploadFlowState: ExcelUploadFlowState = {
  isExcelUploadModalOpen: false,
  isUploading: false,
  registrationView: 'method',
};

const resetExcelUploadModal = (state: ExcelUploadFlowState): ExcelUploadFlowState => {
  return {
    ...state,
    excelUploadErrorMessage: undefined,
    isExcelUploadModalOpen: false,
    selectedExcelFile: undefined,
    selectedExcelFileName: undefined,
  };
};

const isAcceptedExcelUploadFile = (file: File) => {
  const fileName = file.name.trim().toLowerCase();

  return EXCEL_UPLOAD_ACCEPTED_EXTENSIONS.some((extension) => fileName.endsWith(extension));
};

const getExcelUploadModalState = (state: ExcelUploadFlowState): ExcelUploadModalStateTypes => {
  if (state.selectedExcelFileName != null) {
    return 'upload';
  }

  if (state.excelUploadErrorMessage != null) {
    return 'error';
  }

  return 'default';
};

const getExcelUploadErrorMessage = (error: unknown) => {
  if (isApiError(error)) {
    return error.message;
  }

  return EXCEL_UPLOAD_FAILED_ERROR_MESSAGE;
};

const excelUploadFlowReducer = (
  state: ExcelUploadFlowState,
  action: ExcelUploadFlowActionTypes,
): ExcelUploadFlowState => {
  switch (action.type) {
    case 'OPEN_EXCEL_UPLOAD_MODAL':
      return {
        ...state,
        excelUploadErrorMessage: undefined,
        isExcelUploadModalOpen: true,
        selectedExcelFile: undefined,
        selectedExcelFileName: undefined,
      };
    case 'SET_EXCEL_UPLOAD_MODAL_OPEN':
      return action.open
        ? {
            ...state,
            isExcelUploadModalOpen: true,
          }
        : resetExcelUploadModal(state);
    case 'SELECT_EXCEL_FILE':
      return {
        ...state,
        excelUploadErrorMessage: undefined,
        selectedExcelFile: action.file,
        selectedExcelFileName: action.file.name,
      };
    case 'REJECT_EXCEL_FILE':
      return {
        ...state,
        excelUploadErrorMessage: action.errorMessage,
        isUploading: false,
        selectedExcelFile: undefined,
        selectedExcelFileName: undefined,
      };
    case 'START_EXCEL_FILE_UPLOAD':
      return {
        ...state,
        excelUploadErrorMessage: undefined,
        isUploading: true,
      };
    case 'UPLOAD_EXCEL_FILE_SUCCESS':
      if (state.selectedExcelFileName == null) {
        return {
          ...state,
          isUploading: false,
        };
      }

      return {
        ...state,
        excelUploadErrorMessage: undefined,
        isExcelUploadModalOpen: false,
        isUploading: false,
        registrationView: 'confirm',
        selectedExcelFile: undefined,
        selectedExcelFileName: undefined,
        uploadedExcelFileUrl: action.excelFileUrl,
        uploadedExcelFileName: state.selectedExcelFileName,
      };
    case 'CANCEL_FILE_ANALYSIS_CONFIRMATION':
      return initialExcelUploadFlowState;
    case 'START_FILE_ANALYSIS':
      return state.uploadedExcelFileName == null || state.uploadedExcelFileUrl == null
        ? state
        : {
            ...state,
            registrationView: 'progress',
          };
    case 'CANCEL_FILE_ANALYSIS_PROGRESS':
      return state.uploadedExcelFileName == null
        ? initialExcelUploadFlowState
        : {
            ...state,
            registrationView: 'confirm',
          };
  }
};

export const useExcelUploadFlow = ({
  onExcelUploadError,
  resolveExcelFileUrl = resolvePresignedExcelFileUrl(),
}: UseExcelUploadFlowParams = {}) => {
  const [state, dispatch] = useReducer(excelUploadFlowReducer, initialExcelUploadFlowState);

  const selectExcelFile = (file?: File) => {
    if (file == null) {
      return;
    }

    if (!isAcceptedExcelUploadFile(file)) {
      dispatch({
        errorMessage: EXCEL_UPLOAD_FILE_FORMAT_ERROR_MESSAGE,
        type: 'REJECT_EXCEL_FILE',
      });
      return;
    }

    dispatch({ file, type: 'SELECT_EXCEL_FILE' });
  };
  const handleExcelFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    selectExcelFile(event.currentTarget.files?.[0]);
  };
  const { handleFilesDrop: handleExcelFileDrop } = useFileDrop({
    onFilesDrop: (files) => {
      selectExcelFile(files[0]);
    },
  });

  const excelUploadModalState = getExcelUploadModalState(state);

  return {
    cancelFileAnalysisConfirmation: () => {
      dispatch({ type: 'CANCEL_FILE_ANALYSIS_CONFIRMATION' });
    },
    cancelFileAnalysisProgress: () => {
      dispatch({ type: 'CANCEL_FILE_ANALYSIS_PROGRESS' });
    },
    excelUploadModal: {
      errorMessage: state.excelUploadErrorMessage,
      open: state.isExcelUploadModalOpen,
      selectedFileName: state.selectedExcelFileName,
      state: excelUploadModalState,
    },
    handleExcelFileChange,
    handleExcelFileDrop,
    handleExcelUploadModalOpenChange: (open: boolean) => {
      dispatch({ open, type: 'SET_EXCEL_UPLOAD_MODAL_OPEN' });
    },
    openExcelUpload: () => {
      dispatch({ type: 'OPEN_EXCEL_UPLOAD_MODAL' });
    },
    registrationView: state.registrationView,
    startFileAnalysis: () => {
      dispatch({ type: 'START_FILE_ANALYSIS' });
    },
    uploadExcelFile: async () => {
      if (state.selectedExcelFile == null || state.isUploading) {
        return;
      }

      dispatch({ type: 'START_EXCEL_FILE_UPLOAD' });

      try {
        const excelFileUrl = await resolveExcelFileUrl(state.selectedExcelFile);

        dispatch({ excelFileUrl, type: 'UPLOAD_EXCEL_FILE_SUCCESS' });
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error(EXCEL_UPLOAD_ERROR_LOG_PREFIX, error);
        }

        const errorMessage = getExcelUploadErrorMessage(error);

        onExcelUploadError?.(errorMessage);

        dispatch({
          errorMessage,
          type: 'REJECT_EXCEL_FILE',
        });
      }
    },
    isUploading: state.isUploading,
    uploadedExcelFileUrl: state.uploadedExcelFileUrl,
    uploadedExcelFileName: state.uploadedExcelFileName,
  };
};
