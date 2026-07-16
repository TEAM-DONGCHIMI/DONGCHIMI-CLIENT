export interface ProductImportFileConfirmationState {
  fileName: string;
  fileUrl: string;
}

interface ProductImportRouteState {
  productImportFileConfirmation: ProductImportFileConfirmationState;
}

const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

export const createProductImportRouteState = (
  fileConfirmation: ProductImportFileConfirmationState,
): ProductImportRouteState => ({
  productImportFileConfirmation: fileConfirmation,
});

export const getProductImportFileConfirmation = (
  routeState: unknown,
): ProductImportFileConfirmationState | undefined => {
  if (routeState == null || typeof routeState !== 'object') {
    return undefined;
  }

  const fileConfirmation = (routeState as Partial<ProductImportRouteState>)
    .productImportFileConfirmation;

  if (
    fileConfirmation == null ||
    !isNonEmptyString(fileConfirmation.fileName) ||
    !isNonEmptyString(fileConfirmation.fileUrl)
  ) {
    return undefined;
  }

  return {
    fileName: fileConfirmation.fileName,
    fileUrl: fileConfirmation.fileUrl,
  };
};
