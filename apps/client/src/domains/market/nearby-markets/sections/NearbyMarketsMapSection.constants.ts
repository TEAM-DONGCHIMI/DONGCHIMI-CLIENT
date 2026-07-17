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

export const MARKET_MARKER_IMAGE = {
  src: '/images/img_map.svg',
  size: { width: 72, height: 72 },
  options: {
    offset: { x: 36, y: 36 },
  },
};
