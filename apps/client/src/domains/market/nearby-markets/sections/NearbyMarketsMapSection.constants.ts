import mapMarkerImage from '@/shared/assets/images/img_map.svg';

export const KAKAO_MAP_APP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;

export const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };

export const MAP_ZOOM_LEVEL = 4;
export const SELECTED_LOCATION_ARIA_LABEL = '검색한 위치';
export const ADDRESS_SEARCH_ERROR_MESSAGE = '검색한 위치를 지도에 표시하지 못했어요';

export const MAP_SECTION_ARIA_LABEL = '지도 영역';
export const CURRENT_LOCATION_ARIA_LABEL = '현재 위치';

export const MAP_LOADING_MESSAGE = '지도를 불러오는 중이에요';
export const LOAD_ERROR_MESSAGE = '마트를 불러올 수 없어요';
export const PERMISSION_DENIED_MESSAGE = '위치 검색 결과를 기준으로 마트를 보여드릴게요';

const SELECTED_LOCATION_MARKER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M12 22s7-6.04 7-12a7 7 0 1 0-14 0c0 5.96 7 12 7 12Z" fill="#2563EB" stroke="#FFFFFF" stroke-width="2"/><circle cx="12" cy="10" r="2.6" fill="#FFFFFF"/></svg>`;

export const SELECTED_LOCATION_MARKER_IMAGE = {
  src: `data:image/svg+xml;utf8,${encodeURIComponent(SELECTED_LOCATION_MARKER_SVG)}`,
  size: { width: 24, height: 24 },
};

export const MARKET_MARKER_IMAGE = {
  src: mapMarkerImage,
  size: { width: 71, height: 71 },
  options: {
    offset: { x: 35.5, y: 35.5 },
  },
};
