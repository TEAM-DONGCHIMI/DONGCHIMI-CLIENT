'use client';

import { useEffect, useState } from 'react';

import type { CoordinatesTypes } from '@/shared/hooks';

type ResolvedCoordinatesAddressTypes = Readonly<{
  address: string;
  coordinates: CoordinatesTypes;
}>;

const areSameCoordinates = (a: CoordinatesTypes | null, b: CoordinatesTypes | null) => {
  if (a == null || b == null) {
    return a === b;
  }

  return a.lat === b.lat && a.lng === b.lng;
};

type UseKakaoReverseGeocoderOptionsTypes = Readonly<{
  // 현재 위치(GPS) 좌표입니다. 우편번호 검색 좌표가 아닌 geolocation 결과만 넘깁니다.
  coordinates: CoordinatesTypes | null;
  // 변환된 주소 텍스트를 provider에 올려 검색 input 표시값으로 쓰게 합니다.
  onAddressChange: (address: string | null) => void;
  // Kakao SDK와 services 라이브러리가 준비됐는지 나타냅니다.
  ready: boolean;
}>;

// 현재 위치 좌표를 Kakao Maps 주소 텍스트로 바꿔, 위치 권한이 허용됐을 때 검색 input에 그대로 보여줍니다.
export const useKakaoReverseGeocoder = ({
  coordinates,
  onAddressChange,
  ready,
}: UseKakaoReverseGeocoderOptionsTypes) => {
  // 마지막으로 성공한 좌표/주소입니다. 현재 coordinates와 일치할 때만 밖으로 노출합니다.
  const [resolved, setResolved] = useState<ResolvedCoordinatesAddressTypes | null>(null);

  useEffect(() => {
    // 좌표가 없거나 Kakao services가 준비되기 전이면 geocoder를 호출하지 않습니다.
    if (!coordinates || !ready) {
      return;
    }

    // SDK가 로드되어도 services 객체가 없으면 아직 좌표 변환을 시도할 수 없습니다.
    const Geocoder = window.kakao?.maps?.services?.Geocoder;
    const okStatus = window.kakao?.maps?.services?.Status.OK;

    if (Geocoder == null || okStatus == null) {
      return;
    }

    // coord2Address를 호출할 Kakao geocoder 인스턴스입니다.
    const geocoder = new Geocoder();
    // effect가 정리된 뒤 도착하는 비동기 응답을 무시하기 위한 flag입니다.
    let isActive = true;

    geocoder.coord2Address(coordinates.lng, coordinates.lat, (result, status) => {
      // 응답 도착 전 좌표가 바뀌거나 컴포넌트가 사라지면 이전 geocoder 응답을 무시합니다.
      if (!isActive) {
        return;
      }

      const [firstResult] = result;
      // 도로명 주소를 우선하고, 없으면 지번 주소를 사용합니다.
      const address =
        firstResult?.road_address?.address_name || firstResult?.address?.address_name;

      // 검색 실패, 결과 없음, 주소 텍스트가 비어 있으면 현재 위치 주소를 노출하지 않습니다.
      if (status !== okStatus || !address) {
        setResolved(null);
        onAddressChange(null);

        return;
      }

      setResolved({ address, coordinates });
      onAddressChange(address);
    });

    return () => {
      // coordinates나 ready가 바뀌면 이전 geocoder callback은 더 이상 반영하지 않습니다.
      isActive = false;
    };
  }, [coordinates, onAddressChange, ready]);

  const isResolvedForCurrentCoordinates = areSameCoordinates(
    resolved?.coordinates ?? null,
    coordinates,
  );

  return {
    // 이전 좌표의 주소가 새 좌표 결과처럼 보이지 않도록 현재 coordinates와 일치할 때만 반환합니다.
    address: isResolvedForCurrentCoordinates ? (resolved?.address ?? null) : null,
  };
};
