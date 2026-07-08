import type { MartSummaryCardProps } from '@/shared/components';

export type NearbyMarketProductFixtureTypes = MartSummaryCardProps['products'][number];

export type NearbyMarketFixtureTypes = Readonly<
  Pick<
    MartSummaryCardProps,
    'areaName' | 'discountCount' | 'martName' | 'profileImageAlt' | 'profileImageSrc'
  > & {
    id: string;
    products: MartSummaryCardProps['products'];
  }
>;

const MANGWON_FRESH_MARKET = {
  areaName: '망원동',
  discountCount: 6,
  id: 'mangwon-fresh',
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
} satisfies NearbyMarketFixtureTypes;

const MANGWON_MARKET_2 = {
  areaName: '망원동',
  discountCount: 4,
  id: 'mangwon-market-2',
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
} satisfies NearbyMarketFixtureTypes;

export const NEARBY_MARKETS_FIXTURE: readonly NearbyMarketFixtureTypes[] = [
  MANGWON_FRESH_MARKET,
  MANGWON_MARKET_2,
];
