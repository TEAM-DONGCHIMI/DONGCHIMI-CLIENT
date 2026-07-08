import { formatWon } from '@/shared/utils';

import type { NearbyMarketTypes } from './nearby-market';
import type { NearbyMarketDtoTypes } from './nearby-markets-schema';

export const mapNearbyMarketDtoToViewTypes = (dto: NearbyMarketDtoTypes): NearbyMarketTypes => {
  return {
    id: String(dto.marketId),
    discountCount: dto.productCount,
    isOpen: dto.isOpen,
    martName: dto.name,
    products: dto.previewProducts.map((product) => {
      const isDiscounted = product.discountRate > 0;

      return {
        hasSaleChip: isDiscounted,
        imageAlt: product.name,
        imageSrc: product.thumbnailUrl,
        price: formatWon(product.discountedPrice),
        productName: product.name,
        ...(isDiscounted ? { saleChipLabel: `${product.discountRate}%` } : {}),
      };
    }),
    profileImageAlt: dto.name,
    profileImageSrc: dto.thumbnailUrl,
  };
};
