import { Dialog, LineButton } from '@dongchimi/design-system/components';

import * as S from './QrDownloadModal.css';

export interface QrDownloadModalProps {
  imageLabel: string;
  imageSrc: string;
  open: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export const QrDownloadModal = ({
  imageLabel,
  imageSrc,
  open,
  onClose,
  onDownload,
}: QrDownloadModalProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <Dialog.Content aria-label='매장 고유 QR코드' className={S.modalClassName}>
        <img alt={imageLabel} className={S.qrImageClassName} src={imageSrc} />
        <LineButton className={S.downloadButtonClassName} onClick={onDownload}>
          매장 고유 QR코드 다운로드
        </LineButton>
      </Dialog.Content>
    </Dialog>
  );
};
