import type { ReactNode } from 'react';

import { InlineField, type InlineFieldProps } from '@dongchimi/design-system/components';

import * as S from '../TodaySpecialRegistrationPage.css';

interface FieldGroupProps {
  children: ReactNode;
  htmlFor?: string;
  label: string;
}

export const FieldGroup = ({ children, htmlFor, label }: FieldGroupProps) => {
  return (
    <div className={S.fieldGroupClassName}>
      {htmlFor ? (
        <label className={S.fieldLabelClassName} htmlFor={htmlFor}>
          {label}
        </label>
      ) : (
        <span className={S.fieldLabelClassName}>{label}</span>
      )}
      {children}
    </div>
  );
};

interface InlineFieldGroupProps extends Omit<
  InlineFieldProps,
  'aria-label' | 'aria-labelledby' | 'id' | 'readOnly'
> {
  id: string;
  label: string;
}

export const InlineFieldGroup = ({ id, label, ...props }: InlineFieldGroupProps) => {
  return (
    <FieldGroup htmlFor={id} label={label}>
      <InlineField aria-label={label} id={id} {...props} />
    </FieldGroup>
  );
};
