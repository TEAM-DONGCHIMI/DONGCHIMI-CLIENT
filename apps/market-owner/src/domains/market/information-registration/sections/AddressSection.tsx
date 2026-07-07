import { type UseFormRegisterReturn } from 'react-hook-form';

import { Button, Stack, TextInput } from '@dongchimi/design-system/components';

import * as S from './AddressSection.css';

export interface AddressSectionProps {
  address: string;
  addressDetail: string;
  addressDetailErrorMessage?: string;
  addressDetailField: UseFormRegisterReturn<'addressDetail'>;
  addressField: UseFormRegisterReturn<'address'>;
  onAddressSearch: () => void;
}

export const AddressSection = ({
  address,
  addressDetail,
  addressDetailErrorMessage,
  addressDetailField,
  addressField,
  onAddressSearch,
}: AddressSectionProps) => {
  const addressDetailStatusProps = addressDetailErrorMessage
    ? ({
        errorMessage: addressDetailErrorMessage,
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
        {...addressDetailField}
        value={addressDetail}
        {...addressDetailStatusProps}
      />
    </Stack>
  );
};
