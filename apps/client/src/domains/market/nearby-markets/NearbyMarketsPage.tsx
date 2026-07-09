'use client';

import { useState } from 'react';

import { MobileHeader } from '@/shared/components';
import { useDebouncedValue, useGeolocation } from '@/shared/hooks';

import {
  DEFAULT_LOCATION_PLACEHOLDER,
  LOCATION_PERMISSION_DENIED_PLACEHOLDER,
} from './NearbyMarketsPage.constants';
import * as S from './NearbyMarketsPage.css';
import {
  NearbyMarketsMapSection,
  NearbyMarketsMarketListSection,
  NearbyMarketsSearchSection,
} from './sections';

export const NearbyMarketsPage = () => {
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebouncedValue(keyword);
  const { coordinates, errorCode } = useGeolocation();

  const locationPlaceholder = coordinates
    ? DEFAULT_LOCATION_PLACEHOLDER
    : LOCATION_PERMISSION_DENIED_PLACEHOLDER;

  return (
    <main className={S.pageClassName}>
      <MobileHeader aria-label='앱 헤더'>
        <MobileHeader.Logo>
          <div aria-label='로고' className={S.logoPlaceholderClassName} role='img' />
        </MobileHeader.Logo>
      </MobileHeader>

      <NearbyMarketsMapSection
        coordinates={coordinates}
        errorCode={errorCode}
        keyword={debouncedKeyword}
      />
      <NearbyMarketsSearchSection
        keyword={keyword}
        onKeywordChange={setKeyword}
        placeholder={locationPlaceholder}
      />
      <NearbyMarketsMarketListSection keyword={debouncedKeyword} />
    </main>
  );
};
