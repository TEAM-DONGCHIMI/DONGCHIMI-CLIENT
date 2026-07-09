'use client';

import { useState } from 'react';

import {
  CustomOverlayMap,
  Map,
  MapInfoWindow,
  MapMarker,
  useKakaoLoader,
} from 'react-kakao-maps-sdk';

import { useGeolocation } from '@/shared/hooks';

import { useNearbyMarketsInfiniteQuery } from '../../hooks/use-nearby-markets-infinite-query';
import * as S from '../NearbyMarketsPage.css';
import { flattenNearbyMarketsPages } from '../utils/flatten-nearby-markets-pages';

const KAKAO_MAP_APP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };

export interface NearbyMarketsMapSectionProps {
  keyword?: string;
}

export const NearbyMarketsMapSection = ({ keyword }: NearbyMarketsMapSectionProps) => {
  const [loading, error] = useKakaoLoader({
    appkey: KAKAO_MAP_APP_KEY ?? '',
  });

  const { coordinates, errorCode } = useGeolocation();
  const { data, isError: isMarketsError } = useNearbyMarketsInfiniteQuery({ keyword });
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);

  const markets = flattenNearbyMarketsPages(data);

  if (loading) {
    return (
      <section aria-label='지도 영역'>
        <div aria-label='지도를 불러오는 중이에요' className={S.mapAreaClassName} role='img' />
      </section>
    );
  }

  if (!KAKAO_MAP_APP_KEY || error) {
    return (
      <section aria-label='지도 영역'>
        <div aria-label='마트를 불러올 수 없어요' className={S.mapAreaClassName} role='img' />
        <p className={S.mapStatusClassName} role='status'>
          마트를 불러올 수 없어요
        </p>
      </section>
    );
  }

  const statusMessage =
    errorCode === 'PERMISSION_DENIED'
      ? '위치 검색 결과를 기준으로 마트를 보여드릴게요'
      : errorCode || isMarketsError
        ? '마트를 불러올 수 없어요'
        : null;

  const selectedMarket = markets.find((market) => market.id === selectedMarketId) ?? null;

  return (
    <section aria-label='지도 영역'>
      <Map
        center={coordinates ?? DEFAULT_CENTER}
        className={S.mapAreaClassName}
        level={4}
        onClick={() => setSelectedMarketId(null)}
      >
        {coordinates && (
          <CustomOverlayMap position={coordinates}>
            <div aria-label='현재 위치' className={S.currentLocationMarkerClassName} role='img' />
          </CustomOverlayMap>
        )}

        {markets.map((market) => (
          <MapMarker
            key={market.id}
            position={{ lat: market.latitude, lng: market.longitude }}
            title={market.martName}
            onClick={() =>
              setSelectedMarketId((current) => (current === market.id ? null : market.id))
            }
          />
        ))}

        {selectedMarket && (
          <MapInfoWindow position={{ lat: selectedMarket.latitude, lng: selectedMarket.longitude }}>
            <span className={S.marketInfoWindowClassName}>{selectedMarket.martName}</span>
          </MapInfoWindow>
        )}
      </Map>
      {statusMessage && (
        <p className={S.mapStatusClassName} role='status'>
          {statusMessage}
        </p>
      )}
    </section>
  );
};
