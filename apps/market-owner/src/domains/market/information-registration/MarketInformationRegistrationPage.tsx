import { type ChangeEvent } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type FieldPath } from 'react-hook-form';

import { Button, Flex, Stack } from '@dongchimi/design-system/components';

import { DesktopHeader } from '@/shared/components';

import { marketInformationRegistrationFixture } from './fixtures';
import * as S from './MarketInformationRegistrationPage.css';
import {
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

const getNextFormValue = (name: string, value: string) => {
  if (name === 'businessRegistrationNumber') {
    return formatBusinessRegistrationNumber(value);
  }

  if (name === 'businessTime') {
    return formatBusinessTime(value);
  }

  if (name === 'ownerPhone') {
    return formatMobilePhoneNumber(value);
  }

  if (name === 'marketPhone') {
    return formatMarketPhoneNumber(value);
  }

  return value;
};

export const MarketInformationRegistrationPage = () => {
  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm<MarketInformationFormTypes>({
    defaultValues: marketInformationRegistrationFixture.initialForm,
    mode: 'onTouched',
    resolver: zodResolver(marketInformationRegistrationSchema),
  });
  const form = watch();
  const canSubmit = marketInformationRegistrationSchema.safeParse(form).success;

  const setFormValue = (name: FieldPath<MarketInformationFormTypes>, value: string) => {
    setValue(name, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleFormattedInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    const nextValue = getNextFormValue(name, value);

    if (
      name === 'businessRegistrationNumber' ||
      name === 'businessTime' ||
      name === 'marketPhone' ||
      name === 'ownerPhone'
    ) {
      setFormValue(name, nextValue);
    }
  };

  const handleBusinessDayChange = (businessDay: string) => {
    setFormValue('businessDay', businessDay);
  };

  const handleHolidayChange = (holiday: string) => {
    setFormValue('holiday', holiday);
  };

  const handleMarketInformationSubmit = handleSubmit(() => undefined);

  return (
    <div className={S.pageRootClassName}>
      <DesktopHeader logo={<span className={S.logoClassName}>DC</span>} variant='logoOnly' />

      <main className={S.mainClassName}>
        <Stack className={S.pageContainerClassName} gap='none'>
          <Stack align='center' gap='xs'>
            <h1 className={S.titleClassName}>마트 정보 등록</h1>
            <p className={S.descriptionClassName}>점주님의 마트 정보를 등록해주세요.</p>
          </Stack>

          <form className={S.formClassName} onSubmit={handleMarketInformationSubmit}>
            <Flex align='start' className={S.formContentClassName}>
              <MarketImageUploadSection onImageSelect={() => undefined} />

              <Stack className={S.fieldsClassName} gap='2xl'>
                <BasicMarketInfoSection
                  businessRegistrationNumber={form.businessRegistrationNumber}
                  businessRegistrationNumberErrorMessage={
                    errors.businessRegistrationNumber?.message
                  }
                  businessRegistrationNumberField={register('businessRegistrationNumber')}
                  marketName={form.marketName}
                  marketNameErrorMessage={errors.marketName?.message}
                  marketNameField={register('marketName')}
                  onBusinessRegistrationNumberChange={handleFormattedInputChange}
                />
                <AddressSection
                  address={form.address}
                  addressDetail={form.addressDetail}
                  addressDetailErrorMessage={errors.addressDetail?.message}
                  addressDetailField={register('addressDetail')}
                  addressField={register('address')}
                  onAddressSearch={() => undefined}
                />
                <div className={S.fieldPairGridClassName}>
                  <BusinessOperationSection
                    businessDay={form.businessDay}
                    businessTime={form.businessTime}
                    businessTimeErrorMessage={
                      errors.businessTime?.message ?? errors.businessDay?.message
                    }
                    businessTimeField={register('businessTime')}
                    holiday={form.holiday}
                    onBusinessDayChange={handleBusinessDayChange}
                    onHolidayChange={handleHolidayChange}
                    onBusinessTimeChange={handleFormattedInputChange}
                  />
                  <ContactSection
                    marketPhone={form.marketPhone}
                    marketPhoneErrorMessage={errors.marketPhone?.message}
                    marketPhoneField={register('marketPhone')}
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
                disabled={!canSubmit}
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
