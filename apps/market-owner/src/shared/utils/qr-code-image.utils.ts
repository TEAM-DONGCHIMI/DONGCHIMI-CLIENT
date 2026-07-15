const QR_CODE_DATA_URL_PREFIX = 'data:image/png;base64,';

export const getQrCodeImageSource = (qrCode: string) => {
  if (qrCode.startsWith('data:image/')) {
    return qrCode;
  }

  return `${QR_CODE_DATA_URL_PREFIX}${qrCode}`;
};

export const downloadQrCodeImage = (imageSource: string, filename: string) => {
  const downloadLink = document.createElement('a');

  downloadLink.download = filename;
  downloadLink.href = imageSource;
  downloadLink.click();
};
