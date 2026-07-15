import {
  createApiConfigurationError,
  createPresignedUploadUrl,
  type PresignedUploadRequestTypes,
  type PresignedUploadResponseTypes,
} from '@/shared/api';
import { getMarketOwnerEnv } from '@/shared/config';
import { PRESIGNED_UPLOAD_PURPOSE } from '@/shared/constants/presigned-upload-purpose';

const DEFAULT_EXCEL_CONTENT_TYPE = 'application/octet-stream';
const PRESIGNED_UPLOAD_TIMEOUT_MS = 60_000;
const PRESIGNED_UPLOAD_ERROR_MESSAGE = '파일 업로드에 실패했습니다. 다시 시도해주세요.';

export type ResolveExcelFileUrlTypes = (file: File) => Promise<string> | string;

type RequestPresignedUploadUrlTypes = (
  request: PresignedUploadRequestTypes,
) => Promise<PresignedUploadResponseTypes>;

interface UploadFileToPresignedUrlParams {
  file: File;
  presignedUpload: PresignedUploadResponseTypes;
}

const getExcelUploadContentType = (file: File) => {
  return file.type || DEFAULT_EXCEL_CONTENT_TYPE;
};

const getRequiredPublicS3BaseUrl = () => {
  const { s3BaseUrl } = getMarketOwnerEnv();

  if (!s3BaseUrl) {
    throw createApiConfigurationError('VITE_PUBLIC_S3_BASE_URL is not configured.');
  }

  return s3BaseUrl;
};

const createPublicS3FileUrl = (objectKey: string, s3BaseUrl: string) => {
  return `${s3BaseUrl}/${objectKey.replace(/^\/+/, '')}`;
};

const uploadFileToPresignedUrl = async ({
  file,
  presignedUpload,
}: UploadFileToPresignedUrlParams) => {
  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), PRESIGNED_UPLOAD_TIMEOUT_MS);

  try {
    const response = await fetch(presignedUpload.uploadUrl, {
      body: file,
      headers: presignedUpload.requiredHeaders,
      method: 'PUT',
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(PRESIGNED_UPLOAD_ERROR_MESSAGE);
    }
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
};

export const resolvePresignedExcelFileUrl =
  (
    requestPresignedUploadUrl: RequestPresignedUploadUrlTypes = createPresignedUploadUrl,
  ): ResolveExcelFileUrlTypes =>
  async (file) => {
    const s3BaseUrl = getRequiredPublicS3BaseUrl();
    const presignedUpload = await requestPresignedUploadUrl({
      contentLength: file.size,
      contentType: getExcelUploadContentType(file),
      purpose: PRESIGNED_UPLOAD_PURPOSE.PRODUCT_IMPORT_EXCEL,
    });
    const excelFileUrl = createPublicS3FileUrl(presignedUpload.objectKey, s3BaseUrl);

    await uploadFileToPresignedUrl({ file, presignedUpload });

    return excelFileUrl;
  };
