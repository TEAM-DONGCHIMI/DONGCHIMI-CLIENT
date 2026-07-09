export const imageUploadInputAccept = '.jpg,.jpeg,.png,image/jpeg,image/png';
export const imageUploadFileTypes = ['image/jpeg', 'image/png'];
export const imageUploadMaxFileSize = 10 * 1024 * 1024;

export const imageUploadErrorMessages = {
  exceededFileSize: '업로드 가능한 파일 용량을 초과했습니다.',
  uploadFailed: '이미지를 업로드하지 못했습니다. 다시 시도해주세요.',
  unsupportedFileType: 'jpg, jpeg, png 파일만 업로드할 수 있습니다.',
} as const;

export const isValidImageUploadFile = (file: File) => {
  return imageUploadFileTypes.includes(file.type) && file.size <= imageUploadMaxFileSize;
};

export const revokeImagePreviewUrl = (previewUrl: string | null) => {
  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
  }
};
