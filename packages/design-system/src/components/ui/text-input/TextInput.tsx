import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from 'react';

import { cn } from '../../../styles/class-name';
import type { RecipeVariantProps } from '../../../styles/recipe';
import {
  errorIconSlot,
  input,
  inputContainer,
  inputWithTrailingElement,
  label,
  labelRow,
  messageRow,
  messageText,
  requiredMark,
  root,
  trailingAction,
  trailingIcon,
} from './TextInput.css';

type TextInputTypes = 'email' | 'password' | 'search' | 'tel' | 'text' | 'url';

type NativeInputProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'aria-invalid' | 'aria-label' | 'aria-labelledby' | 'children' | 'size' | 'type'
>;

type TextInputVariantProps = RecipeVariantProps<typeof input>;

type TextInputAccessibleNameProps =
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

type TextInputStatusProps =
  | {
      status?: 'default' | 'success';
      errorMessage?: never;
    }
  | {
      status: 'error';
      errorMessage?: ReactNode;
    };

type TextInputBaseOwnProps = Omit<TextInputVariantProps, 'status'> &
  TextInputStatusProps & {
    helperText?: ReactNode;
    type?: TextInputTypes;
  };

type TextInputTrailingElementProps =
  | {
      trailingAction?: never;
      trailingIcon?: ReactNode;
    }
  | {
      trailingAction: (state: { disabled: boolean }) => ReactElement;
      trailingIcon?: never;
    };

export type TextInputProps = NativeInputProps &
  TextInputAccessibleNameProps &
  TextInputBaseOwnProps &
  TextInputTrailingElementProps;

const hasContent = (content: ReactNode) => {
  return content !== undefined && content !== null && content !== false && content !== '';
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      'aria-describedby': ariaDescribedBy,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      className,
      disabled,
      errorMessage,
      helperText,
      id,
      label: visibleLabel,
      required,
      status = 'default',
      trailingAction: renderTrailingAction,
      trailingIcon: trailingIconElement,
      type = 'text',
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? `text-input-${generatedId}`;
    const isError = status === 'error';
    const displayedMessage = isError ? errorMessage : helperText;
    const trailingActionElement = renderTrailingAction?.({ disabled: Boolean(disabled) });
    const hasMessage = hasContent(displayedMessage);
    const hasTrailingIcon = hasContent(trailingIconElement);
    const hasTrailingAction = hasContent(trailingActionElement);
    const hasTrailingElement = hasTrailingIcon || hasTrailingAction;
    const messageId = hasMessage ? `${inputId}-${isError ? 'error' : 'helper'}` : undefined;
    const describedBy = [ariaDescribedBy, messageId].filter(Boolean).join(' ') || undefined;

    return (
      <div className={root}>
        {hasContent(visibleLabel) && (
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
        )}

        <div className={inputContainer}>
          <input
            {...props}
            ref={ref}
            aria-describedby={describedBy}
            aria-invalid={isError ? true : undefined}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            className={cn(
              input({ status }),
              hasTrailingElement && inputWithTrailingElement,
              className,
            )}
            disabled={disabled}
            id={inputId}
            required={required}
            type={type}
          />

          {hasTrailingIcon && (
            <span aria-hidden='true' className={trailingIcon}>
              {trailingIconElement}
            </span>
          )}

          {hasTrailingAction && <span className={trailingAction}>{trailingActionElement}</span>}
        </div>

        {hasMessage && (
          <div className={messageRow} id={messageId}>
            {isError && <span aria-hidden='true' className={errorIconSlot} />}
            <span className={messageText({ tone: isError ? 'error' : 'helper' })}>
              {displayedMessage}
            </span>
          </div>
        )}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';
