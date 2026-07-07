import type { ChangeEventHandler, KeyboardEventHandler, MouseEventHandler } from 'react';

import * as S from '../TodaySpecialRegistrationPage.css';

interface DateFieldProps {
  ariaLabel: string;
  min?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  value: string;
}

export const DateField = ({ ariaLabel, min, onChange, value }: DateFieldProps) => {
  const preventManualDateInput: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key !== 'Tab') {
      event.preventDefault();
    }
  };

  const openDatePicker: MouseEventHandler<HTMLInputElement> = (event) => {
    event.currentTarget.showPicker?.();
  };

  return (
    <label className={S.datePickerFieldClassName}>
      <span className={value ? S.dateValueClassName : S.datePlaceholderClassName}>
        {value || 'YYYY-MM-DD'}
      </span>
      <input
        aria-label={ariaLabel}
        className={S.dateNativeInputClassName}
        min={min}
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
