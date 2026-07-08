import { useState, type ChangeEvent } from 'react';

import { type UseFormRegisterReturn } from 'react-hook-form';

import { AddableField, Chip, Stack } from '@dongchimi/design-system/components';
import {
  IcCircleExclamationSizeSmallColorNegative,
  IcLineHorizontalSizeSmall,
  IcPhoneSizeSmallColor60,
  IcPlusSizeSmallColor60,
} from '@dongchimi/design-system/icons';

import { RequiredMark } from '../components/RequiredMark';
import {
  formatMarketPhoneNumber,
  formatMobilePhoneNumber,
  isValidMarketPhone,
  isValidOwnerPhone,
} from '../model';
import * as S from './ContactSection.css';

const additionalMarketPhoneErrorMessage = '올바른 전화번호를 입력해주세요.';
const additionalOwnerPhoneErrorMessage = '올바른 휴대전화 번호를 입력해주세요.';

export interface ContactSectionProps {
  marketPhone: string;
  marketPhoneErrorMessage?: string;
  marketPhoneField: UseFormRegisterReturn<'marketPhone'>;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  ownerPhone: string;
  ownerPhoneErrorMessage?: string;
  ownerPhoneField: UseFormRegisterReturn<'ownerPhone'>;
}

export const ContactSection = ({
  marketPhone,
  marketPhoneErrorMessage,
  marketPhoneField,
  onInputChange,
  ownerPhone,
  ownerPhoneErrorMessage,
  ownerPhoneField,
}: ContactSectionProps) => {
  const [isAdditionalMarketPhoneVisible, setIsAdditionalMarketPhoneVisible] = useState(false);
  const [isAdditionalOwnerPhoneVisible, setIsAdditionalOwnerPhoneVisible] = useState(false);
  const [additionalMarketPhone, setAdditionalMarketPhone] = useState('');
  const [additionalOwnerPhone, setAdditionalOwnerPhone] = useState('');

  const handleRemoveAdditionalMarketPhone = () => {
    setIsAdditionalMarketPhoneVisible(false);
    setAdditionalMarketPhone('');
  };

  const handleRemoveAdditionalOwnerPhone = () => {
    setIsAdditionalOwnerPhoneVisible(false);
    setAdditionalOwnerPhone('');
  };

  const handleAdditionalMarketPhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAdditionalMarketPhone(formatMarketPhoneNumber(event.currentTarget.value));
  };

  const handleAdditionalOwnerPhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAdditionalOwnerPhone(formatMobilePhoneNumber(event.currentTarget.value));
  };

  const additionalMarketPhoneStatusProps =
    additionalMarketPhone.length > 0 && !isValidMarketPhone(additionalMarketPhone)
      ? ({
          errorIcon: <IcCircleExclamationSizeSmallColorNegative />,
          errorMessage: additionalMarketPhoneErrorMessage,
          status: 'error',
        } as const)
      : {};
  const additionalOwnerPhoneStatusProps =
    additionalOwnerPhone.length > 0 && !isValidOwnerPhone(additionalOwnerPhone)
      ? ({
          errorIcon: <IcCircleExclamationSizeSmallColorNegative />,
          errorMessage: additionalOwnerPhoneErrorMessage,
          status: 'error',
        } as const)
      : {};
  const marketPhoneStatusProps = marketPhoneErrorMessage
    ? ({
        errorIcon: <IcCircleExclamationSizeSmallColorNegative />,
        errorMessage: marketPhoneErrorMessage,
        status: 'error',
      } as const)
    : {};
  const ownerPhoneStatusProps = ownerPhoneErrorMessage
    ? ({
        errorIcon: <IcCircleExclamationSizeSmallColorNegative />,
        errorMessage: ownerPhoneErrorMessage,
        status: 'error',
      } as const)
    : {};

  return (
    <Stack gap='2xl'>
      <div className={S.inlineFieldClassName}>
        <span className={S.inlineLabelClassName}>
          <span className={S.phoneLabelClassName}>
            <span className={S.requiredLabelGroupClassName}>
              마트 번호
              <RequiredMark />
            </span>
            <Chip color='dark' size='mobile'>
              대표
            </Chip>
          </span>
        </span>
        <div className={S.marketPhoneRowsClassName}>
          <AddableField
            aria-label='마트 대표 번호'
            className={S.addableFieldClassName}
            leadingIcon={<IcPhoneSizeSmallColor60 />}
            placeholder='번호를 입력하세요.'
            required
            trailingActionLabel='마트 번호 추가'
            trailingIcon={<IcPlusSizeSmallColor60 />}
            type='tel'
            {...marketPhoneField}
            value={marketPhone}
            onChange={onInputChange}
            onTrailingAction={() => setIsAdditionalMarketPhoneVisible(true)}
            {...marketPhoneStatusProps}
          />
          {isAdditionalMarketPhoneVisible && (
            <AddableField
              aria-label='추가 마트 번호'
              className={S.addableFieldClassName}
              leadingIcon={<IcPhoneSizeSmallColor60 />}
              name='additionalMarketPhone'
              placeholder='번호를 입력해주세요.'
              trailingActionLabel='추가 마트 번호 제거'
              trailingIcon={<IcLineHorizontalSizeSmall />}
              type='tel'
              value={additionalMarketPhone}
              onChange={handleAdditionalMarketPhoneChange}
              onTrailingAction={handleRemoveAdditionalMarketPhone}
              {...additionalMarketPhoneStatusProps}
            />
          )}
        </div>
      </div>

      <div className={S.inlineFieldClassName}>
        <span className={S.inlineLabelClassName}>
          점주 번호
          <RequiredMark />
        </span>
        <div className={S.ownerPhoneRowsClassName}>
          <AddableField
            aria-label='점주 번호'
            className={S.addableFieldClassName}
            inputMode='numeric'
            leadingIcon={<IcPhoneSizeSmallColor60 />}
            placeholder='번호를 입력해주세요.'
            required
            trailingActionLabel='점주 번호 추가'
            trailingIcon={<IcPlusSizeSmallColor60 />}
            type='tel'
            {...ownerPhoneField}
            value={ownerPhone}
            onChange={onInputChange}
            onTrailingAction={() => setIsAdditionalOwnerPhoneVisible(true)}
            {...ownerPhoneStatusProps}
          />
          {isAdditionalOwnerPhoneVisible && (
            <AddableField
              aria-label='추가 점주 번호'
              className={S.addableFieldClassName}
              inputMode='numeric'
              leadingIcon={<IcPhoneSizeSmallColor60 />}
              name='additionalOwnerPhone'
              placeholder='번호를 입력해주세요.'
              trailingActionLabel='추가 점주 번호 제거'
              trailingIcon={<IcLineHorizontalSizeSmall />}
              type='tel'
              value={additionalOwnerPhone}
              onChange={handleAdditionalOwnerPhoneChange}
              onTrailingAction={handleRemoveAdditionalOwnerPhone}
              {...additionalOwnerPhoneStatusProps}
            />
          )}
        </div>
      </div>
    </Stack>
  );
};
