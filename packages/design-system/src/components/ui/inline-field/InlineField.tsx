import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { IcCircleExclamationSizeSmallColorNegative } from '../../../icons';
import { cn } from '../../../styles/class-name';
import * as S from './InlineField.css';

type InlineFieldTypes = 'email' | 'number' | 'search' | 'tel' | 'text' | 'url';

type NativeInputProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  | 'aria-invalid'
  | 'aria-label'
  | 'aria-labelledby'
  | 'children'
  | 'disabled'
  | 'readOnly'
  | 'size'
  | 'type'
>;

type InlineFieldAccessibleNameProps =
  | {
      'aria-label': string;
      'aria-labelledby'?: never;
    }
  | {
      'aria-label'?: never;
      'aria-labelledby': string;
    };

type InlineFieldStateProps =
  | {
      readOnly: true;
      status?: never;
    }
  | {
      readOnly?: false;
      status?: 'default' | 'error';
    };

interface InlineFieldOwnProps {
  errorMessage?: ReactNode;
  size?: 'medium' | 'small';
  type?: InlineFieldTypes;
  unit?: string;
}

export type InlineFieldProps = NativeInputProps &
  InlineFieldAccessibleNameProps &
  InlineFieldStateProps &
  InlineFieldOwnProps;

export const InlineField = forwardRef<HTMLInputElement, InlineFieldProps>(
  (
    {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      className,
      errorMessage,
      readOnly = false,
      size = 'medium',
      status = 'default',
      type = 'text',
      unit,
      ...props
    },
    ref,
  ) => {
    const visualState = readOnly ? 'readOnly' : status;
    const unitId = useId();
    const errorMessageId = useId();
    const hasErrorMessage = visualState === 'error' && Boolean(errorMessage);
    const inputDescribedBy =
      [ariaDescribedBy, unit ? unitId : undefined, hasErrorMessage ? errorMessageId : undefined]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
      <div className={S.fieldRoot}>
        <div className={cn(S.root({ size, status: visualState }), className)}>
          <input
            {...props}
            ref={ref}
            aria-invalid={visualState === 'error' ? true : undefined}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={inputDescribedBy}
            className={S.input({ readOnly, size })}
            readOnly={readOnly}
            type={type}
          />
          {unit && (
            <span id={unitId} className={S.unit({ readOnly, size })}>
              {unit}
            </span>
          )}
        </div>
        {hasErrorMessage && (
          <p className={S.errorMessage} id={errorMessageId}>
            <IcCircleExclamationSizeSmallColorNegative className={S.errorIcon} aria-hidden='true' />
            <span>{errorMessage}</span>
          </p>
        )}
      </div>
    );
  },
);

InlineField.displayName = 'InlineField';
