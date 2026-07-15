import { Button, Dialog } from '@dongchimi/design-system/components';

import * as S from './MarketInformationLeaveDialog.css';

interface MarketInformationLeaveDialogProps {
  open: boolean;
  onCancel: () => void;
  onLeave: () => void;
}

export const MarketInformationLeaveDialog = ({
  open,
  onCancel,
  onLeave,
}: MarketInformationLeaveDialogProps) => (
  <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onCancel()}>
    <Dialog.Content className={S.contentClassName}>
      <div className={S.containerClassName}>
        <Dialog.Title className={S.titleClassName}>저장하지 않고 나가시겠어요?</Dialog.Title>
        <div className={S.actionsClassName}>
          <Button className={S.buttonClassName} color='assistive' size='small' onClick={onCancel}>
            취소
          </Button>
          <Button
            className={S.buttonClassName}
            color='negative'
            size='small'
            variant='outlined'
            onClick={onLeave}
          >
            나가기
          </Button>
        </div>
      </div>
    </Dialog.Content>
  </Dialog>
);
