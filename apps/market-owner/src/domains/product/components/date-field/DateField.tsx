import {
  type ChangeEventHandler,
  type FocusEventHandler,
  type KeyboardEventHandler,
  type MouseEventHandler,
  useId,
} from 'react';

import { IcCircleExclamationSizeSmallColorNegative } from '@dongchimi/design-system/icons';
import { cn } from '@dongchimi/design-system/styles';

import { getTodayDateInputValue } from '../../utils/product-date';
import * as S from './DateField.css';

export interface DateFieldProps {
  ariaLabel: string;
  className?: string;
  errorMessage?: string;
  hasError?: boolean;
  min?: string;
  pickerDisabled?: boolean;
  readOnly?: boolean;
  value: string;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export const DateField = ({
  ariaLabel,
  className,
  errorMessage,
  hasError = false,
  min = getTodayDateInputValue(),
  pickerDisabled = false,
  readOnly = false,
  onBlur,
  onChange,
  value,
}: DateFieldProps) => {
  const errorMessageId = useId();
  const hasErrorMessage = hasError && Boolean(errorMessage);
  const cannotOpenPicker = readOnly || pickerDisabled;

  const preventManualDateInput: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Tab') {
      return;
    }

    if (cannotOpenPicker) {
      event.preventDefault();
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.currentTarget.showPicker?.();
      return;
    }

    if (event.key.startsWith('Arrow')) {
      return;
    }

    event.preventDefault();
  };

  const openDatePicker: MouseEventHandler<HTMLInputElement> = (event) => {
    if (cannotOpenPicker) {
      event.preventDefault();
      return;
    }

    event.currentTarget.showPicker?.();
  };

  return (
    <div className={cn(S.rootClassName, className)}>
      <label
        className={cn(
          S.fieldClassName,
          readOnly && S.readOnlyFieldClassName,
          hasError && S.errorFieldClassName,
        )}
      >
        <span
          className={
            value
              ? cn(S.valueClassName, readOnly && S.readOnlyValueClassName)
              : S.placeholderClassName
          }
        >
          {value || 'YYYY-MM-DD'}
        </span>
        <input
          aria-describedby={hasErrorMessage ? errorMessageId : undefined}
          aria-invalid={hasError ? true : undefined}
          aria-label={ariaLabel}
          className={cn(S.nativeInputClassName, readOnly && S.readOnlyNativeInputClassName)}
          min={pickerDisabled ? undefined : min}
          readOnly={readOnly}
          tabIndex={cannotOpenPicker ? -1 : undefined}
          type={pickerDisabled ? 'text' : 'date'}
          value={value}
          onBlur={onBlur}
          onChange={onChange}
          onClick={openDatePicker}
          onKeyDown={preventManualDateInput}
          onPaste={(event) => event.preventDefault()}
        />
      </label>
      {hasErrorMessage && (
        <p className={S.errorMessageClassName} id={errorMessageId}>
          <IcCircleExclamationSizeSmallColorNegative
            className={S.errorIconClassName}
            aria-hidden='true'
          />
          <span>{errorMessage}</span>
        </p>
      )}
    </div>
  );
};
