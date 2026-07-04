import {
  forwardRef,
  type CSSProperties,
  type ComponentPropsWithoutRef,
  type MouseEventHandler,
  type ReactNode,
} from 'react';

import { cn } from '../../../styles/class-name';
import * as S from './ListCell.css';

type NativeDivProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'onChange'>;

type FieldButtonProps = Pick<ComponentPropsWithoutRef<'button'>, 'disabled' | 'onClick'>;

export type ListCellMediaStatusTypes = 'default' | 'error';
export type ListCellStatusToneTypes = 'neutral' | 'negative';

export interface ListCellFieldProps extends FieldButtonProps {
  'aria-label'?: string;
  id: string;
  placeholder?: ReactNode;
  trailingIcon?: ReactNode;
  value?: ReactNode;
  width?: number | string;
}

export interface ListCellProps extends NativeDivProps {
  checked?: boolean;
  checkboxDisabled?: boolean;
  checkboxLabel?: string;
  defaultChecked?: boolean;
  fields: readonly ListCellFieldProps[];
  helperIcon?: ReactNode;
  helperText?: ReactNode;
  media?: ReactNode;
  mediaActionAriaLabel?: string;
  mediaActionIcon?: ReactNode;
  mediaActionLabel?: ReactNode;
  mediaStatus?: ListCellMediaStatusTypes;
  onCheckedChange?: (checked: boolean) => void;
  onMediaAction?: MouseEventHandler<HTMLButtonElement>;
  statusLabel?: ReactNode;
  statusTone?: ListCellStatusToneTypes;
}

const DEFAULT_CHECKBOX_LABEL = '항목 선택';

const hasContent = (content: ReactNode) => {
  return content !== undefined && content !== null && content !== false && content !== '';
};

const formatDimension = (value: number | string | undefined) => {
  if (value == null) {
    return undefined;
  }

  return typeof value === 'number' ? `${value}px` : value;
};

const getFieldStyle = (width: ListCellFieldProps['width']) => {
  const fieldWidth = formatDimension(width);

  if (fieldWidth == null) {
    return undefined;
  }

  return { '--list-cell-field-width': fieldWidth } as CSSProperties;
};

export const ListCell = forwardRef<HTMLDivElement, ListCellProps>(
  (
    {
      checked,
      checkboxDisabled,
      checkboxLabel = DEFAULT_CHECKBOX_LABEL,
      className,
      defaultChecked,
      fields,
      helperIcon,
      helperText,
      media,
      mediaActionAriaLabel,
      mediaActionIcon,
      mediaActionLabel,
      mediaStatus = 'default',
      onCheckedChange,
      onMediaAction,
      statusLabel,
      statusTone = 'neutral',
      ...props
    },
    ref,
  ) => {
    const hasMedia = hasContent(media);
    const hasMediaAction = hasContent(mediaActionLabel) || hasContent(mediaActionIcon);
    const mediaActionContent = (
      <>
        {hasContent(mediaActionIcon) && (
          <span aria-hidden='true' className={S.mediaActionIconClassName}>
            {mediaActionIcon}
          </span>
        )}
        {hasContent(mediaActionLabel) && (
          <span className={S.mediaActionLabelClassName}>{mediaActionLabel}</span>
        )}
      </>
    );

    return (
      <div ref={ref} className={cn(S.rootClassName, className)} {...props}>
        <div className={S.rowClassName}>
          <div className={S.leadingClassName}>
            <input
              aria-label={checkboxLabel}
              checked={checked}
              className={S.checkboxClassName}
              defaultChecked={defaultChecked}
              disabled={checkboxDisabled}
              onChange={(event) => onCheckedChange?.(event.currentTarget.checked)}
              type='checkbox'
            />

            <div className={S.mediaFrameClassName({ status: hasMedia ? 'default' : mediaStatus })}>
              {hasMedia ? (
                <div className={S.mediaContentClassName}>{media}</div>
              ) : onMediaAction != null ? (
                <button
                  aria-label={mediaActionAriaLabel}
                  className={cn(S.mediaActionClassName, S.mediaActionButtonClassName)}
                  onClick={onMediaAction}
                  type='button'
                >
                  {mediaActionContent}
                </button>
              ) : (
                <div
                  className={S.mediaActionClassName}
                  role={hasMediaAction ? undefined : 'presentation'}
                >
                  {mediaActionContent}
                </div>
              )}
            </div>
          </div>

          <div className={S.fieldsClassName}>
            {fields.map(
              ({
                'aria-label': ariaLabel,
                disabled,
                id,
                onClick,
                placeholder,
                trailingIcon,
                value,
                width,
              }) => {
                const hasValue = hasContent(value);
                const fieldContent = (
                  <>
                    <span
                      className={S.fieldTextClassName({ tone: hasValue ? 'value' : 'placeholder' })}
                    >
                      {hasValue ? value : placeholder}
                    </span>
                    {hasContent(trailingIcon) && (
                      <span aria-hidden='true' className={S.fieldTrailingIconClassName}>
                        {trailingIcon}
                      </span>
                    )}
                  </>
                );

                if (onClick != null) {
                  return (
                    <button
                      aria-label={ariaLabel}
                      className={S.fieldClassName}
                      disabled={disabled}
                      key={id}
                      onClick={onClick}
                      style={getFieldStyle(width)}
                      type='button'
                    >
                      {fieldContent}
                    </button>
                  );
                }

                return (
                  <div
                    aria-label={ariaLabel}
                    className={S.fieldClassName}
                    key={id}
                    style={getFieldStyle(width)}
                  >
                    {fieldContent}
                  </div>
                );
              },
            )}
          </div>

          {(hasContent(statusLabel) || hasContent(helperText)) && (
            <div className={S.statusColumnClassName}>
              {hasContent(statusLabel) && (
                <span className={S.statusBadgeClassName({ tone: statusTone })}>{statusLabel}</span>
              )}

              {hasContent(helperText) && (
                <span className={S.helperClassName}>
                  {hasContent(helperIcon) && (
                    <span aria-hidden='true' className={S.helperIconClassName}>
                      {helperIcon}
                    </span>
                  )}
                  <span className={S.helperTextClassName}>{helperText}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);

ListCell.displayName = 'ListCell';
