import type { CoordinatesTypes } from '@/shared/hooks';

// 검색(우편번호) 좌표가 있으면 그 좌표를 우선하고, 없을 때만 현재 위치 좌표를 사용합니다.
// provider의 목록/마커 조회 기준 좌표와 지도 중심/마커 위치가 항상 같은 규칙을 따르도록 공통화합니다.
export const resolvePreferredCoordinates = (
  selectedCoordinates: CoordinatesTypes | null,
  currentCoordinates: CoordinatesTypes | null,
): CoordinatesTypes | null => selectedCoordinates ?? currentCoordinates;
