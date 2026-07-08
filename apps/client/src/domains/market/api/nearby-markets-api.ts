import { paginateByCursor, wait } from '@/shared/utils';

import {
  resolveNearbyMarketsResponse,
  type NearbyMarketDtoTypes,
  type NearbyMarketsResponseDataTypes,
} from '../model/nearby-markets-schema';

export type NearbyMarketsListParamsTypes = Readonly<{
  pageSize?: number;
}>;

export type NearbyMarketsParamsTypes = Readonly<
  NearbyMarketsListParamsTypes & {
    cursor?: number;
  }
>;

const DEFAULT_PAGE_SIZE = 5;
const MOCK_NETWORK_DELAY_MS = 400;
const MOCK_SUCCESS_CODE = 'SUCCESS';
const MOCK_SUCCESS_MESSAGE = '요청에 성공했습니다.';

type MarketTemplateTypes = Omit<NearbyMarketDtoTypes, 'marketId'>;

const MARKET_TEMPLATES: readonly MarketTemplateTypes[] = [
  {
    address: '서울특별시 마포구 망원동 123-45',
    distance: '350m',
    isOpen: true,
    latitude: 37.5563,
    longitude: 126.9013,
    name: '망원 신선마트',
    previewProducts: [
      {
        discountRate: 10,
        discountedPrice: 6900,
        name: '삼겹살 500g',
        originalPrice: 7700,
        productId: 101,
        thumbnailUrl: '/exampleImg.png',
      },
      {
        discountRate: 0,
        discountedPrice: 6900,
        name: '재래식 된장 1kg',
        originalPrice: 6900,
        productId: 102,
        thumbnailUrl: '/exampleImg.png',
      },
      {
        discountRate: 0,
        discountedPrice: 6900,
        name: '태양초 고추장 1kg',
        originalPrice: 6900,
        productId: 103,
        thumbnailUrl: '/exampleImg.png',
      },
    ],
    productCount: 24,
    thumbnailUrl: '/exampleImg.png',
  },
  {
    address: '서울특별시 마포구 망원동 78-12',
    distance: '480m',
    isOpen: true,
    latitude: 37.5559,
    longitude: 126.9027,
    name: '망원시장 청과',
    previewProducts: [
      {
        discountRate: 15,
        discountedPrice: 12900,
        name: '부사 사과 3kg',
        originalPrice: 15200,
        productId: 201,
        thumbnailUrl: '/exampleImg.png',
      },
      {
        discountRate: 0,
        discountedPrice: 3900,
        name: '바나나 1송이',
        originalPrice: 3900,
        productId: 202,
        thumbnailUrl: '/exampleImg.png',
      },
      {
        discountRate: 0,
        discountedPrice: 5900,
        name: '완숙 토마토 1kg',
        originalPrice: 5900,
        productId: 203,
        thumbnailUrl: '/exampleImg.png',
      },
    ],
    productCount: 18,
    thumbnailUrl: '/exampleImg.png',
  },
  {
    address: '서울특별시 마포구 연남동 210-3',
    distance: '620m',
    isOpen: true,
    latitude: 37.5636,
    longitude: 126.9252,
    name: '연남 정육점',
    previewProducts: [
      {
        discountRate: 20,
        discountedPrice: 24900,
        name: '한우 등심 300g',
        originalPrice: 31100,
        productId: 301,
        thumbnailUrl: '/exampleImg.png',
      },
      {
        discountRate: 0,
        discountedPrice: 8900,
        name: '국내산 계란 30구',
        originalPrice: 8900,
        productId: 302,
        thumbnailUrl: '/exampleImg.png',
      },
      {
        discountRate: 0,
        discountedPrice: 9900,
        name: '냉장 닭가슴살 1kg',
        originalPrice: 9900,
        productId: 303,
        thumbnailUrl: '/exampleImg.png',
      },
    ],
    productCount: 15,
    thumbnailUrl: '/exampleImg.png',
  },
  {
    address: '서울특별시 서대문구 연희동 88-1',
    distance: '810m',
    isOpen: false,
    latitude: 37.5657,
    longitude: 126.9346,
    name: '연희 로컬푸드',
    previewProducts: [
      {
        discountRate: 0,
        discountedPrice: 2900,
        name: '유기농 상추 200g',
        originalPrice: 2900,
        productId: 401,
        thumbnailUrl: '/exampleImg.png',
      },
      {
        discountRate: 10,
        discountedPrice: 9900,
        name: '제철 딸기 500g',
        originalPrice: 11000,
        productId: 402,
        thumbnailUrl: '/exampleImg.png',
      },
      {
        discountRate: 0,
        discountedPrice: 1900,
        name: '두부 1모',
        originalPrice: 1900,
        productId: 403,
        thumbnailUrl: '/exampleImg.png',
      },
    ],
    productCount: 9,
    thumbnailUrl: '/exampleImg.png',
  },
];

const MOCK_TOTAL_COUNT = 22;

const buildMockNearbyMarkets = (): NearbyMarketDtoTypes[] => {
  return Array.from({ length: MOCK_TOTAL_COUNT }, (_, index) => {
    const template = MARKET_TEMPLATES[index % MARKET_TEMPLATES.length]!;
    const cycle = Math.floor(index / MARKET_TEMPLATES.length) + 1;

    return {
      ...template,
      marketId: index + 1,
      name: cycle === 1 ? template.name : `${template.name} ${cycle}호점`,
    };
  });
};

const MOCK_NEARBY_MARKETS = buildMockNearbyMarkets();

// TODO: 백엔드 주변 마트 목록 endpoint가 나오면 httpClient.get 호출로 교체합니다.
export const getNearbyMarkets = async ({
  cursor,
  pageSize = DEFAULT_PAGE_SIZE,
}: NearbyMarketsParamsTypes): Promise<NearbyMarketsResponseDataTypes> => {
  await wait(MOCK_NETWORK_DELAY_MS);

  const page = paginateByCursor(MOCK_NEARBY_MARKETS, { cursor, pageSize });

  return resolveNearbyMarketsResponse({
    code: MOCK_SUCCESS_CODE,
    data: {
      hasNext: page.nextCursor !== null,
      markets: page.items,
      nextCursor: page.nextCursor,
      totalCount: MOCK_NEARBY_MARKETS.length,
    },
    message: MOCK_SUCCESS_MESSAGE,
    success: true,
  });
};
