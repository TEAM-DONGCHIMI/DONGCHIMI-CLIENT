import { formatWon } from '@/shared/utils';

import type { NearbyMarketTypes } from './nearby-market';
import type { NearbyMarketDtoTypes } from './nearby-markets-schema';

export const mapNearbyMarketDtoToViewTypes = (dto: NearbyMarketDtoTypes): NearbyMarketTypes => {
  return {
    id: String(dto.marketId),
    // productCount is the total count of today-special and event-discount products.
    discountCount: dto.productCount,
    isOpen: dto.isOpen,
    latitude: dto.latitude,
    longitude: dto.longitude,
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
