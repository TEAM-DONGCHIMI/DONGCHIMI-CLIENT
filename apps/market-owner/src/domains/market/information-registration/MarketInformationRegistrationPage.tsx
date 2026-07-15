import type { ComponentProps } from 'react';

import {
  MarketInformationForm,
  MarketInformationFormToastProvider,
} from '@/domains/market/components/market-information-form';
import type { MarketInformationRegistrationRequest } from '@/domains/market/model';

import { marketInformationRegistrationFixture } from './fixtures';

export interface MarketInformationRegistrationPageProps {
  onAddressSearch?: ComponentProps<typeof MarketInformationForm>['onAddressSearch'];
  onImageSelect?: ComponentProps<typeof MarketInformationForm>['onImageSelect'];
  onRegister?: (request: MarketInformationRegistrationRequest) => Promise<void> | void;
}

export const MarketInformationRegistrationPage = ({
  onAddressSearch = () => marketInformationRegistrationFixture.selectedAddress,
  onImageSelect,
  onRegister = () => undefined,
}: MarketInformationRegistrationPageProps) => (
  <MarketInformationFormToastProvider offset='2.4rem' placement='top-center'>
    <MarketInformationForm
      description='점주님의 마트 정보를 등록해주세요.'
      initialForm={marketInformationRegistrationFixture.initialForm}
      submitLabel='등록하기'
      title='마트 정보 등록'
      onAddressSearch={onAddressSearch}
      onImageSelect={onImageSelect}
      onSubmit={(request) => onRegister(request)}
    />
  </MarketInformationFormToastProvider>
);
