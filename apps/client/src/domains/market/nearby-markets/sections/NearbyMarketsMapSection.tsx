'use client';

import { Map, useKakaoLoader } from 'react-kakao-maps-sdk';

import * as S from '../NearbyMarketsPage.css';

const KAKAO_MAP_APP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };

export const NearbyMarketsMapSection = () => {
  const [loading, error] = useKakaoLoader({
    appkey: KAKAO_MAP_APP_KEY ?? '',
  });

  if (!KAKAO_MAP_APP_KEY || loading || error) {
    return (
      <section aria-label='지도 영역'>
        <div aria-label='지도 영역' className={S.mapAreaClassName} role='img' />
      </section>
    );
  }

  return (
    <section aria-label='지도 영역'>
      <Map center={DEFAULT_CENTER} className={S.mapAreaClassName} level={4} />
    </section>
  );
};
