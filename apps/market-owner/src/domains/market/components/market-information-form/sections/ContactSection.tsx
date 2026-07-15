import { type ChangeEvent } from 'react';

import { type UseFormRegisterReturn } from 'react-hook-form';

import { AddableField, Chip, RequiredMark, TextInput } from '@dongchimi/design-system/components';
import {
  IcCircleExclamationSizeSmallColorNegative,
  IcLineHorizontalSizeSmall,
  IcPhoneSizeSmallColor60,
  IcPlusSizeSmallColor60,
} from '@dongchimi/design-system/icons';

import * as S from './ContactSection.css';

export interface ContactSectionProps {
  additionalMarketPhone: string;
  additionalMarketPhoneErrorMessage?: string;
  additionalMarketPhoneField: UseFormRegisterReturn<'marketPhone2'>;
  isAdditionalMarketPhoneVisible: boolean;
  marketPhone1: string;
  marketPhone1ErrorMessage?: string;
  marketPhone1Field: UseFormRegisterReturn<'marketPhone1'>;
  onAdditionalMarketPhoneAdd: () => void;
  onAdditionalMarketPhoneRemove: () => void;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  ownerPhone: string;
  ownerPhoneErrorMessage?: string;
  ownerPhoneField: UseFormRegisterReturn<'ownerPhone'>;
}

export const ContactSection = ({
  additionalMarketPhone,
  additionalMarketPhoneErrorMessage,
  additionalMarketPhoneField,
  isAdditionalMarketPhoneVisible,
  marketPhone1,
  marketPhone1ErrorMessage,
  marketPhone1Field,
  onAdditionalMarketPhoneAdd,
  onAdditionalMarketPhoneRemove,
  onInputChange,
  ownerPhone,
  ownerPhoneErrorMessage,
  ownerPhoneField,
}: ContactSectionProps) => {
  const additionalMarketPhoneStatusProps = additionalMarketPhoneErrorMessage
    ? ({
        errorIcon: <IcCircleExclamationSizeSmallColorNegative />,
        errorMessage: additionalMarketPhoneErrorMessage,
        status: 'error',
      } as const)
    : {};
  const marketPhone1StatusProps = marketPhone1ErrorMessage
    ? ({
        errorIcon: <IcCircleExclamationSizeSmallColorNegative />,
        errorMessage: marketPhone1ErrorMessage,
        status: 'error',
      } as const)
    : {};
  const ownerPhoneStatusProps = ownerPhoneErrorMessage
    ? ({
        errorMessage: ownerPhoneErrorMessage,
        status: 'error',
      } as const)
    : {};

  return (
    <div className={S.sectionGridClassName}>
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
          <div className={S.fieldSlotClassName}>
            <AddableField
              aria-label='마트 대표 번호'
              className={S.addableFieldClassName}
              leadingIcon={<IcPhoneSizeSmallColor60 />}
              placeholder='마트 번호를 입력해주세요.'
              required
              trailingActionLabel='마트 번호 추가'
              trailingIcon={<IcPlusSizeSmallColor60 />}
              type='tel'
              {...marketPhone1Field}
              value={marketPhone1}
              onChange={onInputChange}
              onTrailingAction={onAdditionalMarketPhoneAdd}
              {...marketPhone1StatusProps}
            />
          </div>
          {isAdditionalMarketPhoneVisible && (
            <div className={S.fieldSlotClassName}>
              <AddableField
                aria-label='추가 마트 번호'
                className={S.addableFieldClassName}
                leadingIcon={<IcPhoneSizeSmallColor60 />}
                placeholder='마트 번호를 입력해주세요.'
                trailingActionLabel='추가 마트 번호 제거'
                trailingIcon={<IcLineHorizontalSizeSmall />}
                type='tel'
                {...additionalMarketPhoneField}
                value={additionalMarketPhone}
                onChange={onInputChange}
                onTrailingAction={onAdditionalMarketPhoneRemove}
                {...additionalMarketPhoneStatusProps}
              />
            </div>
          )}
        </div>
      </div>

      <div className={S.inlineFieldClassName}>
        <span className={S.inlineLabelClassName}>
          점주 번호
          <RequiredMark />
        </span>
        <div className={S.ownerPhoneRowsClassName}>
          <TextInput
            aria-label='점주 번호'
            className={S.addableFieldClassName}
            inputMode='numeric'
            placeholder='점주 번호를 입력해주세요.'
            required
            type='tel'
            {...ownerPhoneField}
            value={ownerPhone}
            onChange={onInputChange}
            {...ownerPhoneStatusProps}
          />
        </div>
      </div>
    </div>
  );
};
