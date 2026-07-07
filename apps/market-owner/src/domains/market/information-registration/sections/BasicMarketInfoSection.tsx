import { type ChangeEvent } from 'react';

import { type UseFormRegisterReturn } from 'react-hook-form';

import { Grid, TextInput } from '@dongchimi/design-system/components';

import * as S from './BasicMarketInfoSection.css';

export interface BasicMarketInfoSectionProps {
  businessRegistrationNumber: string;
  businessRegistrationNumberErrorMessage?: string;
  businessRegistrationNumberField: UseFormRegisterReturn<'businessRegistrationNumber'>;
  marketName: string;
  marketNameErrorMessage?: string;
  marketNameField: UseFormRegisterReturn<'marketName'>;
  onBusinessRegistrationNumberChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const BasicMarketInfoSection = ({
  businessRegistrationNumber,
  businessRegistrationNumberErrorMessage,
  businessRegistrationNumberField,
  marketName,
  marketNameErrorMessage,
  marketNameField,
  onBusinessRegistrationNumberChange,
}: BasicMarketInfoSectionProps) => {
  const marketNameStatusProps = marketNameErrorMessage
    ? ({
        errorMessage: marketNameErrorMessage,
        status: 'error',
      } as const)
    : {};
  const businessRegistrationNumberStatusProps = businessRegistrationNumberErrorMessage
    ? ({
        errorMessage: businessRegistrationNumberErrorMessage,
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
        {...marketNameField}
        value={marketName}
        {...marketNameStatusProps}
      />
      <TextInput
        inputMode='numeric'
        label='사업자 등록 번호'
        pattern='(?:[0-9]|-)*'
        placeholder='사업자 등록 번호를 입력하세요.'
        type='tel'
        {...businessRegistrationNumberField}
        value={businessRegistrationNumber}
        onChange={onBusinessRegistrationNumberChange}
        {...businessRegistrationNumberStatusProps}
      />
    </Grid>
  );
};
