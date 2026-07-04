import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type MouseEventHandler,
  type ReactNode,
} from 'react';

import { cn } from '../../../styles/class-name';
import type { RecipeVariantProps } from '../../../styles/recipe';
import {
  actionButton,
  errorIcon,
  field,
  icon,
  input,
  label,
  labelRow,
  messageRow,
  messageText,
  requiredMark,
  root,
} from './AddableField.css';

type AddableFieldInputTypes = 'email' | 'search' | 'tel' | 'text' | 'url';

type NativeInputProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'aria-invalid' | 'aria-label' | 'aria-labelledby' | 'children' | 'size' | 'type'
>;

type AddableFieldAccessibleNameProps =
  | {
      label: ReactNode;
      'aria-label'?: never;
      'aria-labelledby'?: never;
    }
  | {
      label?: never;
      'aria-label': string;
      'aria-labelledby'?: never;
    }
  | {
      label?: never;
      'aria-label'?: never;
      'aria-labelledby': string;
    };

type AddableFieldVariantProps = RecipeVariantProps<typeof field>;

interface AddableFieldOwnProps extends AddableFieldVariantProps {
  errorIcon?: ReactNode;
  errorMessage?: ReactNode;
  leadingIcon: ReactNode;
  onTrailingAction: MouseEventHandler<HTMLButtonElement>;
  trailingActionLabel: string;
  trailingIcon: ReactNode;
  type?: AddableFieldInputTypes;
}

export type AddableFieldProps = NativeInputProps &
  AddableFieldAccessibleNameProps &
  AddableFieldOwnProps;

const hasContent = (content: ReactNode) => {
  return content !== undefined && content !== null && content !== false && content !== '';
};

export const AddableField = forwardRef<HTMLInputElement, AddableFieldProps>(
  (
    {
      'aria-describedby': ariaDescribedBy,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      className,
      disabled,
      errorIcon: errorIconElement,
      errorMessage,
      id,
      label: visibleLabel,
      leadingIcon: leadingIconElement,
      onTrailingAction,
      required,
      status = 'default',
      trailingActionLabel,
      trailingIcon: trailingIconElement,
      type = 'text',
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? `addable-field-${generatedId}`;
    const isError = status === 'error';
    const hasErrorMessage = isError && hasContent(errorMessage);
    const messageId = hasErrorMessage ? `${inputId}-error` : undefined;
    const describedBy = [ariaDescribedBy, messageId].filter(Boolean).join(' ') || undefined;

    return (
      <div className={root}>
        {hasContent(visibleLabel) ? (
          <div className={labelRow}>
            <label className={label} htmlFor={inputId}>
              {visibleLabel}
            </label>
            {required && (
              <span aria-hidden='true' className={requiredMark}>
                *
              </span>
            )}
          </div>
        ) : null}

        <div className={field({ status })} data-disabled={disabled || undefined}>
          <span aria-hidden='true' className={icon}>
            {leadingIconElement}
          </span>

          <input
            {...props}
            ref={ref}
            aria-describedby={describedBy}
            aria-invalid={isError ? true : undefined}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            className={cn(input, className)}
            disabled={disabled}
            id={inputId}
            required={required}
            type={type}
          />

          <button
            aria-label={trailingActionLabel}
            className={actionButton}
            disabled={disabled}
            onClick={onTrailingAction}
            type='button'
          >
            <span aria-hidden='true' className={icon}>
              {trailingIconElement}
            </span>
          </button>
        </div>

        {hasErrorMessage ? (
          <div className={messageRow} id={messageId}>
            {hasContent(errorIconElement) && (
              <span aria-hidden='true' className={errorIcon}>
                {errorIconElement}
              </span>
            )}
            <span className={messageText}>{errorMessage}</span>
          </div>
        ) : null}
      </div>
    );
  },
);

AddableField.displayName = 'AddableField';
