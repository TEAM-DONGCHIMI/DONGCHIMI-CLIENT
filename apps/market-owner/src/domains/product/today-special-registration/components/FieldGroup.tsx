import type { ReactNode } from 'react';

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
