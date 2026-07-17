'use client';

import { useEffect, useState } from 'react';

import type { CoordinatesTypes } from '@/shared/hooks';

type KakaoGeocoderResultTypes = Readonly<{
  x: string;
  y: string;
}>;

type KakaoCoord2AddressResultTypes = Readonly<{
  address: Readonly<{ address_name: string }> | null;
  road_address: Readonly<{ address_name: string }> | null;
}>;

type ResolvedAddressCoordinatesTypes = Readonly<{
  address: string;
  coordinates: CoordinatesTypes;
}>;

// Kakao Maps Geocoder 전역 타입입니다. 주소→좌표(addressSearch)와 좌표→주소(coord2Address)를
// 모두 여기서 선언해, 두 geocoder hook이 같은 전역 타입을 공유하며 충돌하지 않게 합니다.
declare global {
  interface Window {
    kakao?: {
      maps?: {
        services?: {
          Geocoder: new () => {
            addressSearch: (
              address: string,
              callback: (result: KakaoGeocoderResultTypes[], status: string) => void,
            ) => void;
            coord2Address: (
              lng: number,
              lat: number,
              callback: (result: KakaoCoord2AddressResultTypes[], status: string) => void,
            ) => void;
          };
          Status: {
            OK: string;
          };
        };
      };
    };
  }
}

type UseKakaoAddressGeocoderOptionsTypes = Readonly<{
  // Daum 우편번호 검색에서 선택한 도로명/지번 주소입니다.
  address: string | null;
  // 변환된 좌표를 provider에 올려 목록/마커 query 기준 좌표로 쓰게 합니다.
  onCoordinatesChange: (coordinates: CoordinatesTypes | null) => void;
  // Kakao SDK와 services 라이브러리가 준비됐는지 나타냅니다.
  ready: boolean;
}>;

// 주소 문자열을 Kakao Maps 좌표로 바꿔 지도 중심과 주변 마트 조회 기준을 만듭니다.
export const useKakaoAddressGeocoder = ({
  address,
  onCoordinatesChange,
  ready,
}: UseKakaoAddressGeocoderOptionsTypes) => {
  // 마지막으로 성공한 주소/좌표입니다. 현재 address와 일치할 때만 밖으로 노출합니다.
  const [resolved, setResolved] = useState<ResolvedAddressCoordinatesTypes | null>(null);
  // 좌표 변환에 실패한 주소입니다. 현재 address와 같을 때만 에러 상태로 봅니다.
  const [errorAddress, setErrorAddress] = useState<string | null>(null);

  useEffect(() => {
    // 주소가 없거나 Kakao services가 준비되기 전이면 geocoder를 호출하지 않습니다.
    if (!address || !ready) {
      return;
    }

    // SDK가 로드되어도 services 객체가 없으면 아직 좌표 변환을 시도할 수 없습니다.
    const Geocoder = window.kakao?.maps?.services?.Geocoder;
    const okStatus = window.kakao?.maps?.services?.Status.OK;

    if (Geocoder == null || okStatus == null) {
      return;
    }

    // addressSearch를 호출할 Kakao geocoder 인스턴스입니다.
    const geocoder = new Geocoder();
    // effect가 정리된 뒤 도착하는 비동기 응답을 무시하기 위한 flag입니다.
    let isActive = true;

    geocoder.addressSearch(address, (result, status) => {
      // 주소 검색 중 다른 주소가 선택되거나 컴포넌트가 사라지면 이전 geocoder 응답을 무시합니다.
      if (!isActive) {
        return;
      }

      const [firstResult] = result;

      // 검색 실패 또는 결과 없음은 현재 주소의 변환 실패 상태로 저장합니다.
      if (status !== okStatus || firstResult == null) {
        setResolved(null);
        setErrorAddress(address);
        onCoordinatesChange(null);

        return;
      }

      // Kakao 응답은 문자열 좌표라 숫자로 변환해 지도/쿼리에 사용합니다.
      const nextCoordinates = {
        lat: Number(firstResult.y),
        lng: Number(firstResult.x),
      };

      // 숫자로 변환할 수 없는 좌표는 지도와 query에 쓰지 않습니다.
      if (!Number.isFinite(nextCoordinates.lat) || !Number.isFinite(nextCoordinates.lng)) {
        setResolved(null);
        setErrorAddress(address);
        onCoordinatesChange(null);

        return;
      }

      // 성공한 주소/좌표를 저장하고 provider에도 같은 좌표를 전달합니다.
      setErrorAddress(null);
      setResolved({ address, coordinates: nextCoordinates });
      onCoordinatesChange(nextCoordinates);
    });

    return () => {
      // address나 ready가 바뀌면 이전 geocoder callback은 더 이상 반영하지 않습니다.
      isActive = false;
    };
  }, [address, onCoordinatesChange, ready]);

  return {
    // 이전 주소의 좌표가 새 검색 결과처럼 보이지 않도록 현재 address와 일치할 때만 반환합니다.
    coordinates: resolved?.address === address ? resolved.coordinates : null,
    // 현재 address가 실패한 주소와 같을 때만 지도 섹션에 에러 상태를 전달합니다.
    isError: address != null && errorAddress === address,
  };
};
