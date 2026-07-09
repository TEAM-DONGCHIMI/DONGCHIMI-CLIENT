'use client';

import { useState } from 'react';

import { MobileHeader } from '@/shared/components';
import { useDebouncedValue, useGeolocation } from '@/shared/hooks';

import * as S from './NearbyMarketsPage.css';
import {
  NearbyMarketsMapSection,
  NearbyMarketsMarketListSection,
  NearbyMarketsSearchSection,
} from './sections';

const DEFAULT_LOCATION_PLACEHOLDER = '서울시 마포구 망원동';
const LOCATION_PERMISSION_DENIED_PLACEHOLDER = '현재 위치를 검색해주세요';

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
