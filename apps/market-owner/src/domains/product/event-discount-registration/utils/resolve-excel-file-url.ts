import {
  createPresignedUploadUrl,
  type PresignedUploadRequestTypes,
  type PresignedUploadResponseTypes,
} from '@/shared/api';

const PRODUCT_IMPORT_UPLOAD_PURPOSE = 'product_import';
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
    const presignedUpload = await requestPresignedUploadUrl({
      contentLength: file.size,
      contentType: getExcelUploadContentType(file),
      purpose: PRODUCT_IMPORT_UPLOAD_PURPOSE,
    });

    await uploadFileToPresignedUrl({ file, presignedUpload });

    return presignedUpload.objectKey;
  };
