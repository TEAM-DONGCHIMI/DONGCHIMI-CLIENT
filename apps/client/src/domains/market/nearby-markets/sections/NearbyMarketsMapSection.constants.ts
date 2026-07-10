export const KAKAO_MAP_APP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;

export const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };

export const MAP_ZOOM_LEVEL = 4;

export const MAP_SECTION_ARIA_LABEL = '지도 영역';
export const CURRENT_LOCATION_ARIA_LABEL = '현재 위치';

export const MAP_LOADING_MESSAGE = '지도를 불러오는 중이에요';
export const LOAD_ERROR_MESSAGE = '마트를 불러올 수 없어요';
export const PERMISSION_DENIED_MESSAGE = '위치 검색 결과를 기준으로 마트를 보여드릴게요';

const CURRENT_LOCATION_MARKER_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">' +
  '<circle cx="8" cy="8" r="6" fill="#191F28" stroke="#FFFFFF" stroke-width="2"/>' +
  '</svg>';

// CustomOverlayMap는 지도에 attach된 후에야 portal이 붙는 렌더링 지연 버그가 있어,
// 최초 렌더에서도 즉시 표시되는 MapMarker + data URI 이미지로 현재 위치 마커를 그립니다.
export const CURRENT_LOCATION_MARKER_IMAGE = {
  src: `data:image/svg+xml;utf8,${encodeURIComponent(CURRENT_LOCATION_MARKER_SVG)}`,
  size: { width: 16, height: 16 },
};
