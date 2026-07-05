'use client';

import { type MouseEventHandler } from 'react';

import { Button, Dialog } from '@dongchimi/design-system';
import { cn } from '@dongchimi/design-system/styles';

import * as S from './MobileModal.css';

const DEFAULT_CANCEL_LABEL = '취소';
const DEFAULT_CONFIRM_LABEL = '확인';

export interface MobileModalProps {
  cancelLabel?: string;
  className?: string;
  confirmButtonDisabled?: boolean;
  confirmLabel?: string;
  description: string;
  onCancel?: MouseEventHandler<HTMLButtonElement>;
  onConfirm?: MouseEventHandler<HTMLButtonElement>;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  subText?: string;
  title: string;
}

export const MobileModal = ({
  cancelLabel = DEFAULT_CANCEL_LABEL,
  className,
  confirmButtonDisabled = false,
  confirmLabel = DEFAULT_CONFIRM_LABEL,
  description,
  onCancel,
  onConfirm,
  onOpenChange,
  open,
  subText,
  title,
}: MobileModalProps) => {
  const handleCancel: MouseEventHandler<HTMLButtonElement> = (event) => {
    onCancel?.(event);

    if (!event.defaultPrevented) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className={cn(S.contentClassName, className)}>
        <div className={S.containerClassName}>
          <div className={S.messageClassName}>
            <Dialog.Title className={S.titleClassName}>{title}</Dialog.Title>
            {subText != null ? <p className={S.subTextClassName}>{subText}</p> : null}
            <Dialog.Description className={S.descriptionClassName}>
              {description}
            </Dialog.Description>
          </div>

          <div className={S.footerClassName}>
            <Button
              className={cn(S.actionButtonClassName, S.cancelButtonClassName)}
              color='primary'
              onClick={handleCancel}
              size='mobile'
              variant='solid'
            >
              {cancelLabel}
            </Button>
            <Button
              className={S.actionButtonClassName}
              disabled={confirmButtonDisabled}
              onClick={onConfirm}
              size='mobile'
              variant='solid'
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};
