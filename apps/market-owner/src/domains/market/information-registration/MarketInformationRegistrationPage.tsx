import type { ComponentProps, ReactNode } from 'react';

import { useNavigate } from 'react-router';
import { useToast } from '@dongchimi/shared/toast';

import {
  MarketInformationForm,
  MarketInformationFormToastProvider,
} from '@/domains/market/components/market-information-form';
import type { MarketInformationRegistrationRequestTypes } from '@/domains/market/model';
import { isApiError } from '@/shared/api';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

import { useMarketThumbnailUploadMutation, useRegisterMarketMutation } from '../hooks';
import { marketInformationRegistrationFixture } from './fixtures';
import { useMarketAddressSearch } from './hooks';

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
  onAddressSearch?: ComponentProps<typeof MarketInformationForm>['onAddressSearch'];
  onImageSelect?: ComponentProps<typeof MarketInformationForm>['onImageSelect'];
  onRegister?: (request: MarketInformationRegistrationRequestTypes) => Promise<void> | void;
}

const getRegistrationErrorMessage = (error: unknown): ReactNode => {
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

const MarketInformationRegistrationPageContent = ({
  onAddressSearch,
  onImageSelect,
  onRegister,
}: MarketInformationRegistrationPageProps) => {
  const navigate = useNavigate();
  const toast = useToast();
  const searchMarketAddress = useMarketAddressSearch();
  const registerMarketMutation = useRegisterMarketMutation();
  const uploadMarketThumbnailMutation = useMarketThumbnailUploadMutation();

  const handleImageSelect = (file: File) => {
    return onImageSelect ? onImageSelect(file) : uploadMarketThumbnailMutation.mutateAsync(file);
  };

  const handleRegister = async (request: MarketInformationRegistrationRequestTypes) => {
    if (onRegister) {
      await onRegister(request);

      return;
    }

    const response = await registerMarketMutation.mutateAsync(request);

    toast.completed(response.message);
    navigate(MARKET_OWNER_ROUTES.home, { replace: true });
  };

  const isPending = registerMarketMutation.isPending || uploadMarketThumbnailMutation.isPending;

  return (
    <MarketInformationForm
      description='점주님의 마트 정보를 등록해주세요.'
      getSubmitErrorMessage={getRegistrationErrorMessage}
      initialForm={marketInformationRegistrationFixture.initialForm}
      submitDisabled={isPending}
      submitLabel={registerMarketMutation.isPending ? '등록 중...' : '등록하기'}
      title='마트 정보 등록'
      onAddressSearch={onAddressSearch ?? searchMarketAddress}
      onImageSelect={handleImageSelect}
      onSubmit={handleRegister}
    />
  );
};

export const MarketInformationRegistrationPage = (
  props: MarketInformationRegistrationPageProps,
) => (
  <MarketInformationFormToastProvider offset='2.4rem' placement='top-center'>
    <MarketInformationRegistrationPageContent {...props} />
  </MarketInformationFormToastProvider>
);
