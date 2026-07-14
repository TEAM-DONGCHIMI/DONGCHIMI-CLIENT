import {
  createPresignedUploadUrl,
  type PresignedUploadRequestTypes,
  type PresignedUploadResponseTypes,
} from '@/shared/api';

const PRODUCT_IMPORT_UPLOAD_PURPOSE = 'product_import';
const DEFAULT_EXCEL_CONTENT_TYPE = 'application/octet-stream';

export type ResolveExcelFileUrlTypes = (file: File) => Promise<string> | string;

export type RequestPresignedUploadUrlTypes = (
  request: PresignedUploadRequestTypes,
) => Promise<PresignedUploadResponseTypes>;

export interface UploadFileToPresignedUrlParams {
  file: File;
  presignedUpload: PresignedUploadResponseTypes;
}

const getExcelUploadContentType = (file: File) => {
  return file.type || DEFAULT_EXCEL_CONTENT_TYPE;
};

export const uploadFileToPresignedUrl = async ({
  file,
  presignedUpload,
}: UploadFileToPresignedUrlParams) => {
  const response = await fetch(presignedUpload.uploadUrl, {
    body: file,
    headers: presignedUpload.requiredHeaders,
    method: 'PUT',
  });

  if (!response.ok) {
    throw new Error('Failed to upload file to presigned URL.');
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
