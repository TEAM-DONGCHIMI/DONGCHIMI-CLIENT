import {
  useEffect,
  useRef,
  type ChangeEventHandler,
  type ComponentPropsWithoutRef,
  type MouseEventHandler,
  type ReactNode,
  type SyntheticEvent,
} from 'react';

import { Button, Dialog } from '@dongchimi/design-system/components';
import { IcUpload } from '@dongchimi/design-system/icons';
import { cn } from '@dongchimi/design-system/styles';

import * as S from './UploadModal.css';

type NativeDialogContentProps = Omit<
  ComponentPropsWithoutRef<'dialog'>,
  'aria-describedby' | 'aria-labelledby' | 'children' | 'onCancel' | 'onClose' | 'open'
>;

type UploadModalStateTypes = 'default' | 'upload' | 'error';

export interface UploadModalProps extends NativeDialogContentProps {
  accept: string;
  cancelLabel?: string;
  description?: string;
  fileSelectIcon?: ReactNode;
  fileSelectLabel?: string;
  fileSelectTooltipLabel?: string;
  heading: string;
  label: string;
  open: boolean;
  selectedFileText?: string;
  state?: UploadModalStateTypes;
  uploadButtonDisabled?: boolean;
  uploadButtonLabel?: string;
  onCancel?: MouseEventHandler<HTMLButtonElement>;
  onFileChange?: ChangeEventHandler<HTMLInputElement>;
  onOpenChange: (open: boolean) => void;
  onUpload?: MouseEventHandler<HTMLButtonElement>;
}

const DEFAULT_CANCEL_LABEL = '취소';
const DEFAULT_FILE_SELECT_LABEL = '파일 선택';
const DEFAULT_UPLOAD_BUTTON_LABEL = '파일 업로드';
const DEFAULT_FILE_SELECT_ICON = <IcUpload />;

const fileSelectButtonPropsByState = {
  default: { color: 'assistive', variant: 'solid' },
  upload: { color: 'primary', variant: 'soft' },
  error: { color: 'negative', variant: 'outlined' },
} as const;

const hasRenderableIcon = (icon: ReactNode) => {
  return icon != null && icon !== false;
};

export const UploadModal = ({
  accept,
  cancelLabel = DEFAULT_CANCEL_LABEL,
  className,
  description,
  fileSelectIcon = DEFAULT_FILE_SELECT_ICON,
  fileSelectLabel = DEFAULT_FILE_SELECT_LABEL,
  fileSelectTooltipLabel,
  heading,
  label,
  open,
  selectedFileText,
  state = 'default',
  uploadButtonDisabled,
  uploadButtonLabel = DEFAULT_UPLOAD_BUTTON_LABEL,
  onCancel,
  onFileChange,
  onOpenChange,
  onUpload,
  ...contentProps
}: UploadModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasExplicitCloseIntentRef = useRef(false);
  const isUploadState = state === 'upload';
  const isUploadDisabled = uploadButtonDisabled ?? !isUploadState;
  const mainText = isUploadState && selectedFileText != null ? selectedFileText : label;
  const hasFileSelectIcon = hasRenderableIcon(fileSelectIcon);
  const fileSelectButtonProps = fileSelectButtonPropsByState[state];

  const resetFileInputValue = () => {
    if (fileInputRef.current != null) {
      fileInputRef.current.value = '';
    }
  };
  const handleFileSelectClick = () => {
    resetFileInputValue();
    fileInputRef.current?.click();
  };
  const handleFileInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onFileChange?.(event);
  };
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      return;
    }

    onOpenChange(open);
  };
  const handleImplicitDialogClose = (event: SyntheticEvent<HTMLDialogElement>) => {
    if (hasExplicitCloseIntentRef.current) {
      return;
    }

    event.preventDefault();

    const dialogElement = event.currentTarget;

    window.requestAnimationFrame(() => {
      if (!open || !dialogElement.isConnected || dialogElement.open) {
        return;
      }

      if (typeof dialogElement.showModal === 'function') {
        dialogElement.showModal();
        return;
      }

      dialogElement.setAttribute('open', '');
    });
  };
  const handleCancel: MouseEventHandler<HTMLButtonElement> = (event) => {
    onCancel?.(event);

    if (!event.defaultPrevented) {
      hasExplicitCloseIntentRef.current = true;
      onOpenChange(false);
    }
  };
  const handleUpload: MouseEventHandler<HTMLButtonElement> = (event) => {
    hasExplicitCloseIntentRef.current = true;
    onUpload?.(event);
  };

  useEffect(() => {
    if (open) {
      hasExplicitCloseIntentRef.current = false;
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <Dialog.Content
          {...contentProps}
          className={cn(S.contentClassName, className)}
          onCancel={handleImplicitDialogClose}
          onClose={handleImplicitDialogClose}
        >
          <div className={S.containerClassName}>
            <div className={S.mainClassName}>
              <Dialog.Title className={S.titleClassName}>{heading}</Dialog.Title>

              <div className={S.bodyRecipe({ state })}>
                <div className={S.textGroupClassName}>
                  {isUploadState && description != null && (
                    <p className={S.descriptionClassName}>{description}</p>
                  )}
                  <Dialog.Description className={S.labelRecipe({ state })}>
                    {mainText}
                  </Dialog.Description>
                </div>

                <div className={S.fileSelectControlClassName}>
                  <Button
                    className={S.fileSelectButtonClassName}
                    leftIcon={hasFileSelectIcon ? fileSelectIcon : undefined}
                    onClick={handleFileSelectClick}
                    size='small'
                    {...fileSelectButtonProps}
                  >
                    {fileSelectLabel}
                  </Button>
                  {fileSelectTooltipLabel != null && (
                    <span className={S.fileSelectTooltipClassName}>{fileSelectTooltipLabel}</span>
                  )}
                </div>
              </div>
            </div>

            <div className={S.footerClassName}>
              <Button
                className={S.footerButtonClassName}
                color='assistive'
                onClick={handleCancel}
                size='large'
                variant='outlined'
              >
                {cancelLabel}
              </Button>
              <Button
                className={S.footerButtonClassName}
                disabled={isUploadDisabled}
                onClick={handleUpload}
                size='large'
                variant='solid'
              >
                {uploadButtonLabel}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog>
      {open && (
        <input
          aria-label={fileSelectLabel}
          accept={accept}
          className={S.fileInputClassName}
          onChange={handleFileInputChange}
          ref={fileInputRef}
          tabIndex={-1}
          type='file'
        />
      )}
    </>
  );
};
