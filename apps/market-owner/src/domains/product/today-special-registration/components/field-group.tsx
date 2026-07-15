import type { ReactNode } from 'react';

import { InlineField, type InlineFieldProps } from '@dongchimi/design-system/components';

import * as S from '../today-special-registration-page.css';

interface CustomFieldGroupProps {
  children: ReactNode;
  htmlFor?: string;
  label: string;
  optional?: boolean;
}

interface InlineFieldGroupProps extends Omit<
  InlineFieldProps,
  'aria-label' | 'aria-labelledby' | 'id' | 'readOnly'
> {
  children?: never;
  id: string;
  label: string;
  optional?: boolean;
}

type FieldGroupProps = CustomFieldGroupProps | InlineFieldGroupProps;

const hasInlineFieldProps = (props: FieldGroupProps): props is InlineFieldGroupProps => {
  return 'id' in props;
};

export const FieldGroup = (props: FieldGroupProps) => {
  const htmlFor = hasInlineFieldProps(props) ? props.id : props.htmlFor;
  const label = (
    <>
      {props.label}
      {props.optional && (
        <>
          {' '}
          <span className={S.optionalLabelClassName}>(선택)</span>
        </>
      )}
    </>
  );

  if (hasInlineFieldProps(props)) {
    const { id, label: labelText, optional, ...inlineFieldProps } = props;
    const ariaLabel = optional ? `${labelText} (선택)` : labelText;

    return (
      <div className={S.fieldGroupClassName}>
        <label className={S.fieldLabelClassName} htmlFor={id}>
          {label}
        </label>
        <InlineField aria-label={ariaLabel} id={id} {...inlineFieldProps} />
      </div>
    );
  }

  return (
    <div className={S.fieldGroupClassName}>
      {htmlFor ? (
        <label className={S.fieldLabelClassName} htmlFor={htmlFor}>
          {label}
        </label>
      ) : (
        <span className={S.fieldLabelClassName}>{label}</span>
      )}
      {props.children}
    </div>
  );
};
