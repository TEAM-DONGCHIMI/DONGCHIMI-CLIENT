import {
  forwardRef,
  type CSSProperties,
  type ChangeEventHandler,
  type ComponentPropsWithoutRef,
  type MouseEventHandler,
  type ReactNode,
} from 'react';

import { cn } from '../../../styles/class-name';
import { Chip } from '../chip';
import { InlineField } from '../inline-field';
import * as S from './ListCell.css';

type NativeDivProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'onChange'>;

type FieldButtonProps = Pick<ComponentPropsWithoutRef<'button'>, 'disabled' | 'onClick'>;
type FieldInputProps = Pick<ComponentPropsWithoutRef<'input'>, 'inputMode'>;

export type ListCellMediaStatusTypes = 'default' | 'error';
export type ListCellStatusToneTypes = 'neutral' | 'negative';
export type ListCellFieldInputTypes = 'email' | 'number' | 'search' | 'tel' | 'text' | 'url';

export interface ListCellFieldProps extends FieldButtonProps {
  'aria-label'?: string;
  defaultValue?: string | number;
  id: string;
  inputMode?: FieldInputProps['inputMode'];
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  readOnly?: boolean;
  status?: 'default' | 'error';
  trailingIcon?: ReactNode;
  type?: ListCellFieldInputTypes;
  unit?: string;
  value?: string | number;
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

const getFieldText = ({
  defaultValue,
  placeholder,
  value,
}: Pick<ListCellFieldProps, 'defaultValue' | 'placeholder' | 'value'>) => {
  if (hasContent(value)) {
    return value;
  }

  if (hasContent(defaultValue)) {
    return defaultValue;
  }

  return placeholder;
};

const getFieldAriaLabel = ({
  'aria-label': ariaLabel,
  defaultValue,
  id,
  placeholder,
  value,
}: Pick<ListCellFieldProps, 'aria-label' | 'defaultValue' | 'id' | 'placeholder' | 'value'>) => {
  return ariaLabel ?? String(getFieldText({ defaultValue, placeholder, value }) ?? id);
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
                defaultValue,
                disabled,
                id,
                inputMode,
                onChange,
                onClick,
                placeholder,
                readOnly,
                status = 'default',
                trailingIcon,
                type = 'text',
                unit,
                value,
                width,
              }) => {
                const fieldLabel = getFieldAriaLabel({
                  'aria-label': ariaLabel,
                  defaultValue,
                  id,
                  placeholder,
                  value,
                });
                const fieldStyle = getFieldStyle(width);
                const fieldText = getFieldText({ defaultValue, placeholder, value });
                const hasValue = hasContent(value) || hasContent(defaultValue);

                if (onClick != null) {
                  return (
                    <button
                      aria-label={fieldLabel}
                      className={S.fieldButtonClassName}
                      disabled={disabled}
                      key={id}
                      onClick={onClick}
                      style={fieldStyle}
                      type='button'
                    >
                      <span
                        className={S.fieldButtonTextClassName({
                          tone: hasValue ? 'value' : 'placeholder',
                        })}
                      >
                        {fieldText}
                      </span>
                      {hasContent(trailingIcon) && (
                        <span aria-hidden='true' className={S.fieldTrailingIconClassName}>
                          {trailingIcon}
                        </span>
                      )}
                    </button>
                  );
                }

                const isReadOnly = readOnly ?? (value !== undefined && onChange == null);
                const inlineFieldStateProps = isReadOnly
                  ? { readOnly: true as const }
                  : { readOnly: false as const, status };

                return (
                  <div className={S.inlineFieldWrapperClassName} key={id} style={fieldStyle}>
                    <InlineField
                      {...inlineFieldStateProps}
                      aria-label={fieldLabel}
                      className={S.inlineFieldClassName}
                      defaultValue={defaultValue}
                      inputMode={inputMode}
                      onChange={onChange}
                      placeholder={placeholder}
                      size='small'
                      type={type}
                      unit={unit}
                      value={value}
                    />
                  </div>
                );
              },
            )}
          </div>

          {(hasContent(statusLabel) || hasContent(helperText)) && (
            <div className={S.statusColumnClassName}>
              {hasContent(statusLabel) && statusTone === 'negative' && (
                <Chip color='negative' rounded={false} variant='solid'>
                  {statusLabel}
                </Chip>
              )}
              {hasContent(statusLabel) && statusTone !== 'negative' && (
                <Chip color='neutral' rounded={false} variant='subtle'>
                  {statusLabel}
                </Chip>
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
