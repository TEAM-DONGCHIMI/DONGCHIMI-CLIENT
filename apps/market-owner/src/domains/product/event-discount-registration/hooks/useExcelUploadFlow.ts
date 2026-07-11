import { useReducer, type ChangeEventHandler } from 'react';

import { useFileDrop } from '../../hooks';

export type EventDiscountRegistrationViewTypes = 'method' | 'confirm' | 'progress';

type ExcelUploadModalStateTypes = 'default' | 'upload' | 'error';

interface ExcelUploadFlowState {
  excelUploadErrorMessage?: string;
  isExcelUploadModalOpen: boolean;
  registrationView: EventDiscountRegistrationViewTypes;
  selectedExcelFileName?: string;
  uploadedExcelFileName?: string;
}

type ExcelUploadFlowActionTypes =
  | { type: 'OPEN_EXCEL_UPLOAD_MODAL' }
  | { open: boolean; type: 'SET_EXCEL_UPLOAD_MODAL_OPEN' }
  | { fileName: string; type: 'SELECT_EXCEL_FILE' }
  | { errorMessage: string; type: 'REJECT_EXCEL_FILE' }
  | { type: 'UPLOAD_EXCEL_FILE' }
  | { type: 'CANCEL_FILE_ANALYSIS_CONFIRMATION' }
  | { type: 'START_FILE_ANALYSIS' }
  | { type: 'CANCEL_FILE_ANALYSIS_PROGRESS' };

const EXCEL_UPLOAD_ACCEPTED_EXTENSIONS = ['.xlsx', '.csv'] as const;
const EXCEL_UPLOAD_FILE_FORMAT_ERROR_MESSAGE = '파일을 선택하지 못했습니다. 다시 선택해주세요.';

const initialExcelUploadFlowState: ExcelUploadFlowState = {
  isExcelUploadModalOpen: false,
  registrationView: 'method',
};

const resetExcelUploadModal = (state: ExcelUploadFlowState): ExcelUploadFlowState => {
  return {
    ...state,
    excelUploadErrorMessage: undefined,
    isExcelUploadModalOpen: false,
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
        selectedExcelFileName: action.fileName,
      };
    case 'REJECT_EXCEL_FILE':
      return {
        ...state,
        excelUploadErrorMessage: action.errorMessage,
        selectedExcelFileName: undefined,
      };
    case 'UPLOAD_EXCEL_FILE':
      if (state.selectedExcelFileName == null) {
        return state;
      }

      return {
        isExcelUploadModalOpen: false,
        registrationView: 'confirm',
        selectedExcelFileName: undefined,
        uploadedExcelFileName: state.selectedExcelFileName,
      };
    case 'CANCEL_FILE_ANALYSIS_CONFIRMATION':
      return initialExcelUploadFlowState;
    case 'START_FILE_ANALYSIS':
      return state.uploadedExcelFileName == null
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

export const useExcelUploadFlow = () => {
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

    dispatch({ fileName: file.name, type: 'SELECT_EXCEL_FILE' });
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
    uploadExcelFile: () => {
      dispatch({ type: 'UPLOAD_EXCEL_FILE' });
    },
    uploadedExcelFileName: state.uploadedExcelFileName,
  };
};
