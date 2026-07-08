import { paginateByCursor, wait, type CursorPageTypes } from '@/shared/utils';

import type { NearbyMarketTypes } from '../model/nearby-market';

export type NearbyMarketsListParamsTypes = Readonly<{
  pageSize?: number;
}>;

export type NearbyMarketsParamsTypes = Readonly<
  NearbyMarketsListParamsTypes & {
    cursor?: string;
  }
>;

export type NearbyMarketsResponseTypes = CursorPageTypes<NearbyMarketTypes>;

const DEFAULT_PAGE_SIZE = 5;
const MOCK_NETWORK_DELAY_MS = 400;

type NearbyMarketTemplateTypes = Omit<NearbyMarketTypes, 'id'>;

const MARKET_TEMPLATES: readonly NearbyMarketTemplateTypes[] = [
  {
    areaName: '망원동',
    discountCount: 6,
    martName: '망원 신선마트',
    products: [
      {
        hasSaleChip: true,
        imageAlt: '삼겹살 500g',
        imageSrc: '/exampleImg.png',
        price: '6,900원',
        productName: '삼겹살 500g',
        saleChipLabel: '10%',
      },
      {
        imageAlt: '재래식 된장 1kg',
        imageSrc: '/exampleImg.png',
        price: '6,900원',
        productName: '재래식 된장 1kg',
      },
      {
        imageAlt: '태양초 고추장 1kg',
        imageSrc: '/exampleImg.png',
        price: '6,900원',
        productName: '태양초 고추장 1kg',
      },
      {
        imageAlt: '포기김치 2kg',
        imageSrc: '/exampleImg.png',
        price: '6,900원',
        productName: '포기김치 2kg',
      },
    ],
    profileImageAlt: '망원 신선마트',
    profileImageSrc: '/exampleImg.png',
  },
  {
    areaName: '망원동',
    discountCount: 4,
    martName: '망원시장 청과',
    products: [
      {
        hasSaleChip: true,
        imageAlt: '부사 사과 3kg',
        imageSrc: '/exampleImg.png',
        price: '12,900원',
        productName: '부사 사과 3kg',
        saleChipLabel: '15%',
      },
      {
        imageAlt: '바나나 1송이',
        imageSrc: '/exampleImg.png',
        price: '3,900원',
        productName: '바나나 1송이',
      },
      {
        imageAlt: '완숙 토마토 1kg',
        imageSrc: '/exampleImg.png',
        price: '5,900원',
        productName: '완숙 토마토 1kg',
      },
    ],
    profileImageAlt: '망원시장 청과',
    profileImageSrc: '/exampleImg.png',
  },
  {
    areaName: '연남동',
    discountCount: 5,
    martName: '연남 정육점',
    products: [
      {
        hasSaleChip: true,
        imageAlt: '한우 등심 300g',
        imageSrc: '/exampleImg.png',
        price: '24,900원',
        productName: '한우 등심 300g',
        saleChipLabel: '20%',
      },
      {
        imageAlt: '국내산 계란 30구',
        imageSrc: '/exampleImg.png',
        price: '8,900원',
        productName: '국내산 계란 30구',
      },
      {
        imageAlt: '냉장 닭가슴살 1kg',
        imageSrc: '/exampleImg.png',
        price: '9,900원',
        productName: '냉장 닭가슴살 1kg',
      },
    ],
    profileImageAlt: '연남 정육점',
    profileImageSrc: '/exampleImg.png',
  },
  {
    areaName: '연희동',
    discountCount: 3,
    martName: '연희 로컬푸드',
    products: [
      {
        imageAlt: '유기농 상추 200g',
        imageSrc: '/exampleImg.png',
        price: '2,900원',
        productName: '유기농 상추 200g',
      },
      {
        hasSaleChip: true,
        imageAlt: '제철 딸기 500g',
        imageSrc: '/exampleImg.png',
        price: '9,900원',
        productName: '제철 딸기 500g',
        saleChipLabel: '10%',
      },
      {
        imageAlt: '두부 1모',
        imageSrc: '/exampleImg.png',
        price: '1,900원',
        productName: '두부 1모',
      },
    ],
    profileImageAlt: '연희 로컬푸드',
    profileImageSrc: '/exampleImg.png',
  },
];

const MOCK_TOTAL_COUNT = 22;

const buildMockNearbyMarkets = (): NearbyMarketTypes[] => {
  return Array.from({ length: MOCK_TOTAL_COUNT }, (_, index) => {
    const template = MARKET_TEMPLATES[index % MARKET_TEMPLATES.length]!;
    const cycle = Math.floor(index / MARKET_TEMPLATES.length) + 1;

    return {
      ...template,
      id: `mock-market-${index}`,
      martName: cycle === 1 ? template.martName : `${template.martName} ${cycle}호점`,
    };
  });
};

const MOCK_NEARBY_MARKETS = buildMockNearbyMarkets();

// TODO: 백엔드 주변 마트 목록 endpoint가 나오면 httpClient.get 호출로 교체합니다.
export const getNearbyMarkets = async ({
  cursor,
  pageSize = DEFAULT_PAGE_SIZE,
}: NearbyMarketsParamsTypes): Promise<NearbyMarketsResponseTypes> => {
  await wait(MOCK_NETWORK_DELAY_MS);

  return paginateByCursor(MOCK_NEARBY_MARKETS, { cursor, pageSize });
};
