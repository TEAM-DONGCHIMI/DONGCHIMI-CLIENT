import type { MartSummaryCardProps } from '@/shared/components';

export type NearbyMarketTypes = Readonly<
  Pick<
    MartSummaryCardProps,
    'discountCount' | 'isOpen' | 'martName' | 'profileImageAlt' | 'profileImageSrc'
  > & {
    id: string;
    products: MartSummaryCardProps['products'];
  }
>;
