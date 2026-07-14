import type { ReactNode } from 'react';

import { InlineField, type InlineFieldProps } from '@dongchimi/design-system/components';

import * as S from '../today-special-registration-page.css';

interface CustomFieldGroupProps {
  children: ReactNode;
  htmlFor?: string;
  label: string;
}

interface InlineFieldGroupProps extends Omit<
  InlineFieldProps,
  'aria-label' | 'aria-labelledby' | 'id' | 'readOnly'
> {
  children?: never;
  id: string;
  label: string;
}

type FieldGroupProps = CustomFieldGroupProps | InlineFieldGroupProps;

const hasInlineFieldProps = (props: FieldGroupProps): props is InlineFieldGroupProps => {
  return 'id' in props;
};

export const FieldGroup = (props: FieldGroupProps) => {
  const htmlFor = hasInlineFieldProps(props) ? props.id : props.htmlFor;

  if (hasInlineFieldProps(props)) {
    const { id, label, ...inlineFieldProps } = props;

    return (
      <div className={S.fieldGroupClassName}>
        <label className={S.fieldLabelClassName} htmlFor={id}>
          {label}
        </label>
        <InlineField aria-label={label} id={id} {...inlineFieldProps} />
      </div>
    );
  }

  return (
    <div className={S.fieldGroupClassName}>
      {htmlFor ? (
        <label className={S.fieldLabelClassName} htmlFor={htmlFor}>
          {props.label}
        </label>
      ) : (
        <span className={S.fieldLabelClassName}>{props.label}</span>
      )}
      {props.children}
    </div>
  );
};
