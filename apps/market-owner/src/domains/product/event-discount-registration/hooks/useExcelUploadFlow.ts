import { useReducer, type ChangeEventHandler } from 'react';

export type EventDiscountRegistrationViewTypes = 'method' | 'confirm' | 'progress';

type ExcelUploadModalStateTypes = 'default' | 'upload';

interface ExcelUploadFlowState {
  isExcelUploadModalOpen: boolean;
  registrationView: EventDiscountRegistrationViewTypes;
  selectedExcelFileName?: string;
  uploadedExcelFileName?: string;
}

type ExcelUploadFlowActionTypes =
  | { type: 'OPEN_EXCEL_UPLOAD_MODAL' }
  | { open: boolean; type: 'SET_EXCEL_UPLOAD_MODAL_OPEN' }
  | { fileName: string; type: 'SELECT_EXCEL_FILE' }
  | { type: 'UPLOAD_EXCEL_FILE' }
  | { type: 'CANCEL_FILE_ANALYSIS_CONFIRMATION' }
  | { type: 'START_FILE_ANALYSIS' }
  | { type: 'CANCEL_FILE_ANALYSIS_PROGRESS' };

const initialExcelUploadFlowState: ExcelUploadFlowState = {
  isExcelUploadModalOpen: false,
  registrationView: 'method',
};

const resetExcelUploadModal = (state: ExcelUploadFlowState): ExcelUploadFlowState => {
  return {
    ...state,
    isExcelUploadModalOpen: false,
    selectedExcelFileName: undefined,
  };
};

const excelUploadFlowReducer = (
  state: ExcelUploadFlowState,
  action: ExcelUploadFlowActionTypes,
): ExcelUploadFlowState => {
  switch (action.type) {
    case 'OPEN_EXCEL_UPLOAD_MODAL':
      return {
        ...state,
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
        selectedExcelFileName: action.fileName,
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

  const handleExcelFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.currentTarget.files?.[0];

    if (file != null) {
      dispatch({ fileName: file.name, type: 'SELECT_EXCEL_FILE' });
    }
  };

  const excelUploadModalState: ExcelUploadModalStateTypes =
    state.selectedExcelFileName == null ? 'default' : 'upload';

  return {
    cancelFileAnalysisConfirmation: () => {
      dispatch({ type: 'CANCEL_FILE_ANALYSIS_CONFIRMATION' });
    },
    cancelFileAnalysisProgress: () => {
      dispatch({ type: 'CANCEL_FILE_ANALYSIS_PROGRESS' });
    },
    excelUploadModal: {
      open: state.isExcelUploadModalOpen,
      selectedFileName: state.selectedExcelFileName,
      state: excelUploadModalState,
    },
    handleExcelFileChange,
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
