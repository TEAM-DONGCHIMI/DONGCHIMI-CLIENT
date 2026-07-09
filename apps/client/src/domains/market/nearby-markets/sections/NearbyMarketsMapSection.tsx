'use client';

import { Map, useKakaoLoader } from 'react-kakao-maps-sdk';

import { useGeolocation } from '@/shared/hooks';

import * as S from '../NearbyMarketsPage.css';

const KAKAO_MAP_APP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };

export const NearbyMarketsMapSection = () => {
  const [loading, error] = useKakaoLoader({
    appkey: KAKAO_MAP_APP_KEY ?? '',
  });

  const { coordinates, errorCode } = useGeolocation();

  if (!KAKAO_MAP_APP_KEY || loading || error) {
    return (
      <section aria-label='지도 영역'>
        <div aria-label='지도 영역' className={S.mapAreaClassName} role='img' />
      </section>
    );
  }

  return (
    <section aria-label='지도 영역'>
      <Map center={coordinates ?? DEFAULT_CENTER} className={S.mapAreaClassName} level={4} />
      {errorCode && (
        <p className={S.mapStatusClassName} role='status'>
          현재 위치를 가져오지 못해 기본 위치를 표시하고 있어요.
        </p>
      )}
    </section>
  );
};
