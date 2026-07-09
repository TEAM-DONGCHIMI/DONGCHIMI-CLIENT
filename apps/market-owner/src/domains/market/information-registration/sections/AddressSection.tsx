import { type UseFormRegisterReturn } from 'react-hook-form';

import { Button, Stack, TextInput } from '@dongchimi/design-system/components';

import * as S from './AddressSection.css';

export interface AddressSectionProps {
  address: string;
  addressField: UseFormRegisterReturn<'address'>;
  detailAddress: string;
  detailAddressErrorMessage?: string;
  detailAddressField: UseFormRegisterReturn<'detailAddress'>;
  onAddressSearch: () => void;
}

export const AddressSection = ({
  address,
  addressField,
  detailAddress,
  detailAddressErrorMessage,
  detailAddressField,
  onAddressSearch,
}: AddressSectionProps) => {
  const detailAddressStatusProps = detailAddressErrorMessage
    ? ({
        errorMessage: detailAddressErrorMessage,
        status: 'error',
      } as const)
    : {};

  return (
    <Stack className={S.addressSectionClassName}>
      <div className={S.addressRowClassName}>
        <div className={S.addressInputSlotClassName}>
          <TextInput
            label='주소'
            placeholder='주소를 입력해주세요.'
            readOnly
            required
            {...addressField}
            value={address}
          />
        </div>
        <Button
          className={S.addressButtonClassName}
          color='assistive'
          size='small'
          type='button'
          onClick={onAddressSearch}
        >
          주소 찾기
        </Button>
      </div>
      <TextInput
        aria-label='상세주소'
        maxLength={20}
        placeholder='상세주소를 입력해주세요.'
        required
        {...detailAddressField}
        value={detailAddress}
        {...detailAddressStatusProps}
      />
    </Stack>
  );
};
