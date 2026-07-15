import { type ChangeEvent } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { ToastProvider, useToast } from '@dongchimi/shared/toast';

import { Button, Flex, Stack } from '@dongchimi/design-system/components';
import { IcCircleExclamation } from '@dongchimi/design-system/icons';

import { DesktopHeader } from '@/shared/components';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { isApiError } from '@/shared/api';

import { useMarketThumbnailUploadMutation, useRegisterMarketMutation } from '../hooks';
import { marketInformationRegistrationFixture } from './fixtures';
import { type MarketAddressSearchResultTypes, useMarketAddressSearch } from './hooks';
import * as S from './MarketInformationRegistrationPage.css';
import {
  createMarketInformationRegistrationRequest,
  formatBusinessRegistrationNumber,
  formatBusinessTime,
  formatMarketPhoneNumber,
  formatMobilePhoneNumber,
  marketInformationRegistrationSchema,
  type MarketInformationFormTypes,
  type MarketInformationRegistrationRequestTypes,
} from './model';
import {
  AddressSection,
  BasicMarketInfoSection,
  BusinessOperationSection,
  ContactSection,
  MarketImageUploadSection,
  type MarketImageUploadErrorTypes,
} from './sections';

export type { MarketInformationFormTypes } from './model';

type StringMarketInformationFormFieldTypes = {
  [Field in keyof MarketInformationFormTypes]: MarketInformationFormTypes[Field] extends string
    ? Field
    : never;
}[keyof MarketInformationFormTypes];

const toastIcon = (
  <IcCircleExclamation className={S.toastErrorIconClassName} height='2.4rem' width='2.4rem' />
);
const toastErrorOptions = {
  icon: toastIcon,
  id: 'market-information-registration-error',
} as const;
const imageErrorMessageMap: Record<MarketImageUploadErrorTypes, string> = {
  network: '네트워크 연결을 확인한 후 다시 시도해주세요.',
  size: '파일 크기는 최대 10MB까지 업로드할 수 있습니다.',
  type: 'JPG, JPEG, PNG 파일만 업로드할 수 있습니다.',
  upload: '이미지 업로드에 실패했습니다. 다시 시도해주세요.',
};
const addressSearchErrorMessage = '주소 검색 서비스를 이용할 수 없습니다.';
const serverErrorMessage = (
  <>
    서버 오류가 발생했습니다.
    <br />
    잠시 후 다시 시도해주세요.
  </>
);
const registrationErrorMessage = (
  <>
    마트 정보를 등록하지 못했습니다.
    <br />
    잠시 후 다시 시도해주세요.
  </>
);
const marketAlreadyExistsErrorMessage = '이미 존재하는 마트입니다.';

export interface MarketInformationRegistrationPageProps {
  onAddressSearch?: () => MarketAddressSearchResultTypes | Promise<MarketAddressSearchResultTypes>;
  onImageSelect?: (file: File) => Promise<string | void> | string | void;
  onRegister?: (request: MarketInformationRegistrationRequestTypes) => Promise<void> | void;
}

const getRegistrationErrorMessage = (error: unknown) => {
  if (!isApiError(error)) {
    return registrationErrorMessage;
  }

  if (error.code === 'INVALID_INPUT') {
    return error.message;
  }

  if (error.code === 'MARKET_ALREADY_EXISTS') {
    return marketAlreadyExistsErrorMessage;
  }

  return error.type === 'server' || error.type === 'network'
    ? serverErrorMessage
    : registrationErrorMessage;
};

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

  if (name === 'marketPhone1' || name === 'marketPhone2') {
    return formatMarketPhoneNumber(value);
  }

  return value;
};

const MarketInformationRegistrationPageContent = ({
  onAddressSearch,
  onImageSelect,
  onRegister,
}: MarketInformationRegistrationPageProps = {}) => {
  const searchMarketAddress = useMarketAddressSearch();
  const navigate = useNavigate();
  const registerMarketMutation = useRegisterMarketMutation();
  const uploadMarketThumbnailMutation = useMarketThumbnailUploadMutation();
  const toast = useToast();
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

    if (name === 'marketPhone2') {
      setValue('marketPhone2', nextValue, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: false,
      });

      return;
    }

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
    setValue('hasAdditionalBusinessHours', false, { shouldValidate: true });
    setFormValue('additionalBusinessDay', '');
    setFormValue('additionalBusinessTime', '');
  };

  const handleAdditionalBusinessTimeAdd = () => {
    setValue('hasAdditionalBusinessHours', true, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: false,
    });
  };

  const handleAdditionalMarketPhoneAdd = () => {
    setValue('hasAdditionalMarketPhone', true, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: false,
    });
  };

  const handleAdditionalMarketPhoneRemove = () => {
    setValue('hasAdditionalMarketPhone', false, { shouldValidate: true });
    setValue('marketPhone2', null, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
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

  const handleAddressSearch = async () => {
    try {
      const { address, latitude, longitude } = await (onAddressSearch ?? searchMarketAddress)();

      setFormValue('address', address);
      setValue('latitude', latitude, { shouldDirty: true, shouldValidate: true });
      setValue('longitude', longitude, { shouldDirty: true, shouldValidate: true });
    } catch {
      toast.error(addressSearchErrorMessage, toastErrorOptions);
    }
  };

  const handleMarketInformationSubmit = handleSubmit(async (form: MarketInformationFormTypes) => {
    try {
      const request = createMarketInformationRegistrationRequest(form);

      if (onRegister) {
        await onRegister(request);
      } else {
        const response = await registerMarketMutation.mutateAsync(request);

        toast.completed(response.message);
        navigate(MARKET_OWNER_ROUTES.home, { replace: true });
      }
    } catch (error) {
      toast.error(getRegistrationErrorMessage(error), toastErrorOptions);
    }
  });

  const handleImageError = (error: MarketImageUploadErrorTypes) => {
    toast.error(imageErrorMessageMap[error], toastErrorOptions);
  };

  const handleImageSelect = async (file: File) => {
    const objectKey = onImageSelect
      ? await onImageSelect(file)
      : await uploadMarketThumbnailMutation.mutateAsync(file);

    if (objectKey) {
      setValue('thumbnailUrl', objectKey, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

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
              <MarketImageUploadSection
                onImageError={handleImageError}
                onImageSelect={handleImageSelect}
              />

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
                      onAdd: handleAdditionalBusinessTimeAdd,
                      onDayChange: handleAdditionalBusinessDayChange,
                      onRemove: handleAdditionalBusinessTimeRemove,
                      onTimeChange: handleFormattedInputChange,
                      time: form.additionalBusinessTime,
                      timeField: register('additionalBusinessTime'),
                      visible: form.hasAdditionalBusinessHours,
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
                    additionalMarketPhone={form.marketPhone2 ?? ''}
                    additionalMarketPhoneErrorMessage={errors.marketPhone2?.message}
                    additionalMarketPhoneField={register('marketPhone2')}
                    isAdditionalMarketPhoneVisible={form.hasAdditionalMarketPhone}
                    marketPhone1={form.marketPhone1}
                    marketPhone1ErrorMessage={errors.marketPhone1?.message}
                    marketPhone1Field={register('marketPhone1')}
                    ownerPhone={form.ownerPhone}
                    ownerPhoneErrorMessage={errors.ownerPhone?.message}
                    ownerPhoneField={register('ownerPhone')}
                    onAdditionalMarketPhoneAdd={handleAdditionalMarketPhoneAdd}
                    onAdditionalMarketPhoneRemove={handleAdditionalMarketPhoneRemove}
                    onInputChange={handleFormattedInputChange}
                  />
                </div>
              </Stack>
            </Flex>

            <Flex className={S.submitAreaClassName} justify='center'>
              <Button
                className={S.submitButtonClassName}
                aria-busy={registerMarketMutation.isPending || undefined}
                disabled={
                  !isValid ||
                  registerMarketMutation.isPending ||
                  uploadMarketThumbnailMutation.isPending
                }
                size='medium'
                type='submit'
              >
                {registerMarketMutation.isPending ? '등록 중...' : '등록하기'}
              </Button>
            </Flex>
          </form>
        </Stack>
      </main>
    </div>
  );
};

export const MarketInformationRegistrationPage = (
  props: MarketInformationRegistrationPageProps,
) => {
  return (
    <ToastProvider offset='2.4rem' placement='top-center'>
      <MarketInformationRegistrationPageContent {...props} />
    </ToastProvider>
  );
};
