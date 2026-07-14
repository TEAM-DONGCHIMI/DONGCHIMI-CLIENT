import { getMarketOwnerEnv } from '@/shared/config';

const DEFAULT_TEMPORARY_EXCEL_UPLOAD_BASE_URL =
  'https://static.dongchimi.kr/products/imports/pending';

export type ResolveExcelFileUrlTypes = (file: File) => Promise<string> | string;

export const resolveTemporaryExcelFileUrl: ResolveExcelFileUrlTypes = (file) => {
  const { temporaryExcelUploadBaseUrl } = getMarketOwnerEnv();
  const baseUrl = temporaryExcelUploadBaseUrl ?? DEFAULT_TEMPORARY_EXCEL_UPLOAD_BASE_URL;

  return `${baseUrl}/${encodeURIComponent(file.name)}`;
};
