import type {
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
} from 'react';

import { cn } from '@dongchimi/design-system/styles';

import * as S from '../TodaySpecialRegistrationPage.css';

interface DateFieldProps {
  ariaLabel: string;
  describedBy?: string;
  hasError?: boolean;
  min?: string;
  onBlur: FocusEventHandler<HTMLInputElement>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  value: string;
}

export const DateField = ({
  ariaLabel,
  describedBy,
  hasError = false,
  min,
  onBlur,
  onChange,
  value,
}: DateFieldProps) => {
  const preventManualDateInput: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.currentTarget.showPicker?.();
      return;
    }

    if (event.key === 'Tab' || event.key.startsWith('Arrow')) {
      return;
    }

    event.preventDefault();
  };

  const openDatePicker: MouseEventHandler<HTMLInputElement> = (event) => {
    event.currentTarget.showPicker?.();
  };

  return (
    <label className={cn(S.datePickerFieldClassName, hasError && S.datePickerFieldErrorClassName)}>
      <span className={value ? S.dateValueClassName : S.datePlaceholderClassName}>
        {value || 'YYYY-MM-DD'}
      </span>
      <input
        aria-describedby={describedBy}
        aria-invalid={hasError ? true : undefined}
        aria-label={ariaLabel}
        className={S.dateNativeInputClassName}
        min={min}
        onBlur={onBlur}
        onChange={onChange}
        onClick={openDatePicker}
        onKeyDown={preventManualDateInput}
        onPaste={(event) => event.preventDefault()}
        type='date'
        value={value}
      />
    </label>
  );
};
