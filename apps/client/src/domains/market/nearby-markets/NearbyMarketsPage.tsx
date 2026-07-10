'use client';

import { useState } from 'react';

import { MobileHeader } from '@/shared/components';
import { useDebouncedValue, useGeolocation } from '@/shared/hooks';

import {
  DEFAULT_LOCATION_ADDRESS_TEXT,
  LOCATION_PERMISSION_DENIED_PLACEHOLDER,
} from './NearbyMarketsPage.constants';
import * as S from './NearbyMarketsPage.css';
import {
  NearbyMarketsMapSection,
  NearbyMarketsMarketListSection,
  NearbyMarketsSearchSection,
} from './sections';
import { DEFAULT_CENTER } from './sections/NearbyMarketsMapSection.constants';

export const NearbyMarketsPage = () => {
  const [keyword, setKeyword] = useState('');
  const [hasEditedKeyword, setHasEditedKeyword] = useState(false);
  const debouncedKeyword = useDebouncedValue(keyword);
  const { coordinates, errorCode } = useGeolocation();

  const handleKeywordChange = (value: string) => {
    setHasEditedKeyword(true);
    setKeyword(value);
  };

  // 위치 권한 허용 시 입력창 기본 값으로 노출하는 현재 위치 주소 텍스트. 사용자가 직접 검색어를 입력하기 전까지는 keyword 필터에 영향을 주지 않는다.
  const displayValue =
    !hasEditedKeyword && coordinates != null ? DEFAULT_LOCATION_ADDRESS_TEXT : keyword;
  const marketSearchOrigin = coordinates ?? DEFAULT_CENTER;

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
        marketSearchOrigin={marketSearchOrigin}
      />
      <NearbyMarketsSearchSection
        keyword={displayValue}
        onKeywordChange={handleKeywordChange}
        placeholder={LOCATION_PERMISSION_DENIED_PLACEHOLDER}
      />
      <NearbyMarketsMarketListSection
        keyword={debouncedKeyword}
        marketSearchOrigin={marketSearchOrigin}
      />
    </main>
  );
};
