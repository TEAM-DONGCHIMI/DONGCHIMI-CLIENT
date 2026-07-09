import { type ChangeEvent } from 'react';

import { type UseFormRegisterReturn } from 'react-hook-form';

import { Grid, TextInput } from '@dongchimi/design-system/components';

import * as S from './BasicMarketInfoSection.css';

export interface BasicMarketInfoSectionProps {
  brn: string;
  brnErrorMessage?: string;
  brnField: UseFormRegisterReturn<'brn'>;
  name: string;
  nameErrorMessage?: string;
  nameField: UseFormRegisterReturn<'name'>;
  onBrnChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const BasicMarketInfoSection = ({
  brn,
  brnErrorMessage,
  brnField,
  name,
  nameErrorMessage,
  nameField,
  onBrnChange,
}: BasicMarketInfoSectionProps) => {
  const nameStatusProps = nameErrorMessage
    ? ({
        errorMessage: nameErrorMessage,
        status: 'error',
      } as const)
    : {};
  const brnStatusProps = brnErrorMessage
    ? ({
        errorMessage: brnErrorMessage,
        status: 'error',
      } as const)
    : {};

  return (
    <Grid className={S.basicMarketInfoGridClassName} columns={2} gap='none'>
      <TextInput
        label='마트명'
        maxLength={15}
        placeholder='마트명을 입력해주세요.'
        required
        {...nameField}
        value={name}
        {...nameStatusProps}
      />
      <TextInput
        inputMode='numeric'
        label='사업자 등록 번호'
        pattern='(?:[0-9]|-)*'
        placeholder='사업자 등록 번호를 입력하세요.'
        type='tel'
        {...brnField}
        value={brn}
        onChange={onBrnChange}
        {...brnStatusProps}
      />
    </Grid>
  );
};
