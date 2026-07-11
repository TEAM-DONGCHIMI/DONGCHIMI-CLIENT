import { type ChangeEvent } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button, Flex, Stack } from '@dongchimi/design-system/components';

import { DesktopHeader } from '@/shared/components';

import { marketInformationRegistrationFixture } from './fixtures';
import * as S from './MarketInformationRegistrationPage.css';
import {
  createMarketInformationRegistrationRequest,
  formatBusinessRegistrationNumber,
  formatBusinessTime,
  formatMarketPhoneNumber,
  formatMobilePhoneNumber,
  marketInformationRegistrationSchema,
  type MarketInformationFormTypes,
} from './model';
import {
  AddressSection,
  BasicMarketInfoSection,
  BusinessOperationSection,
  ContactSection,
  MarketImageUploadSection,
} from './sections';

export type { MarketInformationFormTypes } from './model';

type StringMarketInformationFormFieldTypes = {
  [Field in keyof MarketInformationFormTypes]: MarketInformationFormTypes[Field] extends string
    ? Field
    : never;
}[keyof MarketInformationFormTypes];

const getNextFormValue = (name: string, value: string) => {
  if (name === 'brn') {
    return formatBusinessRegistrationNumber(value);
  }

  if (name === 'businessTime' || name === 'additionalBusinessTime') {
    return formatBusinessTime(value);
  }

  if (name === 'ownerPhone') {
    return formatMobilePhoneNumber(value);
  }

  if (name === 'marketPhone1') {
    return formatMarketPhoneNumber(value);
  }

  return value;
};

export const MarketInformationRegistrationPage = () => {
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    setValue,
    trigger,
    watch,
  } = useForm<MarketInformationFormTypes>({
    defaultValues: marketInformationRegistrationFixture.initialForm,
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(marketInformationRegistrationSchema),
  });
  const form = watch();

  const setFormValue = (name: StringMarketInformationFormFieldTypes, value: string) => {
    setValue(name, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: false,
    });
  };

  const handleFormattedInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    const nextValue = getNextFormValue(name, value);

    if (
      name === 'brn' ||
      name === 'businessTime' ||
      name === 'additionalBusinessTime' ||
      name === 'marketPhone1' ||
      name === 'ownerPhone'
    ) {
      setFormValue(name, nextValue);
    }
  };

  const handleBusinessDayChange = (businessDay: string) => {
    setFormValue('businessDay', businessDay);
  };

  const handleAdditionalBusinessDayChange = (businessDay: string) => {
    setFormValue('additionalBusinessDay', businessDay);
  };

  const handleAdditionalBusinessTimeRemove = () => {
    setFormValue('additionalBusinessDay', '');
    setFormValue('additionalBusinessTime', '');
  };

  const handleBusinessHoursBlur = () => {
    void trigger([
      'businessDay',
      'businessTime',
      'additionalBusinessDay',
      'additionalBusinessTime',
    ]);
  };

  const handleHolidayChange = (holiday: string) => {
    setFormValue('holiday', holiday);
  };

  const handleAddressSearch = () => {
    setFormValue('address', marketInformationRegistrationFixture.selectedAddress);
  };

  const handleMarketInformationSubmit = handleSubmit((form: MarketInformationFormTypes) => {
    createMarketInformationRegistrationRequest(form);
  });

  return (
    <div className={S.pageRootClassName}>
      <DesktopHeader logo={<span className={S.logoClassName}>DC</span>} variant='logoOnly' />

      <main className={S.mainClassName}>
        <Stack className={S.pageContainerClassName} gap='none'>
          <Stack align='center' gap='xs'>
            <h1 className={S.titleClassName}>마트 정보 등록</h1>
            <p className={S.descriptionClassName}>점주님의 마트 정보를 등록해주세요.</p>
          </Stack>

          <form noValidate className={S.formClassName} onSubmit={handleMarketInformationSubmit}>
            <Flex align='start' className={S.formContentClassName}>
              <MarketImageUploadSection onImageSelect={() => undefined} />

              <Stack className={S.fieldsClassName} gap='2xl'>
                <BasicMarketInfoSection
                  brn={form.brn}
                  brnErrorMessage={errors.brn?.message}
                  brnField={register('brn')}
                  name={form.name}
                  nameErrorMessage={errors.name?.message}
                  nameField={register('name')}
                  onBrnChange={handleFormattedInputChange}
                />
                <AddressSection
                  address={form.address}
                  addressField={register('address')}
                  detailAddress={form.detailAddress}
                  detailAddressErrorMessage={errors.detailAddress?.message}
                  detailAddressField={register('detailAddress')}
                  onAddressSearch={handleAddressSearch}
                />
                <div className={S.fieldPairGridClassName}>
                  <BusinessOperationSection
                    additionalBusinessHours={{
                      day: form.additionalBusinessDay,
                      errorMessage:
                        errors.additionalBusinessTime?.message ??
                        errors.additionalBusinessDay?.message,
                      onDayChange: handleAdditionalBusinessDayChange,
                      onRemove: handleAdditionalBusinessTimeRemove,
                      onTimeChange: handleFormattedInputChange,
                      time: form.additionalBusinessTime,
                      timeField: register('additionalBusinessTime'),
                    }}
                    businessHours={{
                      day: form.businessDay,
                      errorMessage: errors.businessTime?.message ?? errors.businessDay?.message,
                      onDayChange: handleBusinessDayChange,
                      onTimeChange: handleFormattedInputChange,
                      time: form.businessTime,
                      timeField: register('businessTime'),
                    }}
                    onBlur={handleBusinessHoursBlur}
                    holidaySelection={{
                      onChange: handleHolidayChange,
                      value: form.holiday,
                    }}
                  />
                  <ContactSection
                    marketPhone1={form.marketPhone1}
                    marketPhone1ErrorMessage={errors.marketPhone1?.message}
                    marketPhone1Field={register('marketPhone1')}
                    ownerPhone={form.ownerPhone}
                    ownerPhoneErrorMessage={errors.ownerPhone?.message}
                    ownerPhoneField={register('ownerPhone')}
                    onInputChange={handleFormattedInputChange}
                  />
                </div>
              </Stack>
            </Flex>

            <Flex className={S.submitAreaClassName} justify='center'>
              <Button
                className={S.submitButtonClassName}
                disabled={!isValid}
                size='medium'
                type='submit'
              >
                등록하기
              </Button>
            </Flex>
          </form>
        </Stack>
      </main>
    </div>
  );
};
