import type { MartSummaryCardProps } from '@/shared/components';

export type NearbyMarketProductTypes = MartSummaryCardProps['products'][number];

export type NearbyMarketTypes = Readonly<
  Pick<
    MartSummaryCardProps,
    'areaName' | 'discountCount' | 'martName' | 'profileImageAlt' | 'profileImageSrc'
  > & {
    id: string;
    products: MartSummaryCardProps['products'];
  }
>;
