import type { FlyerPreviewResponseTypes } from '../api';
import type { LeafletSummaryFixture } from '../fixtures/leaflet-share.fixture';

export interface PhonePreviewProductViewModel {
  id: number;
  name: string;
  thumbnailUrl?: string | null;
  price: string;
}

export interface PhonePreviewDiscountProductViewModel extends PhonePreviewProductViewModel {
  discountRate: number;
}

export interface PhonePreviewDailyProductViewModel extends PhonePreviewDiscountProductViewModel {
  originalPrice: string;
}

export interface PhonePreviewViewModel {
  address: string;
  businessHourLines: string[];
  dailyProducts: PhonePreviewDailyProductViewModel[];
  dailyTotalCount: number;
  eventProducts: PhonePreviewProductViewModel[];
  isOpenNow: boolean;
  marketName: string;
  marketPhone: string;
  marketThumbnailUrl?: string | null;
  topProducts: PhonePreviewDiscountProductViewModel[];
}

export interface LeafletPreviewViewModel {
  phonePreview: PhonePreviewViewModel;
  summary: LeafletSummaryFixture;
}

const formatPrice = (price: number) => price.toLocaleString('ko-KR');

const formatBusinessHour = (businessHour: FlyerPreviewResponseTypes['businessHours'][number]) => {
  const days = businessHour.days.join(', ');

  if (!businessHour.isOpen || businessHour.open == null || businessHour.close == null) {
    return `${days} 휴무`;
  }

  return `${days} ${businessHour.open} - ${businessHour.close}`;
};

export const createLeafletPreviewViewModel = (
  preview: FlyerPreviewResponseTypes,
): LeafletPreviewViewModel => {
  return {
    summary: {
      todaySpecialProductCount: preview.daily.totalCount,
      eventDiscountProductCount: preview.preparedProducts.length,
    },
    phonePreview: {
      marketName: preview.name,
      marketThumbnailUrl: preview.thumbnailUrl,
      address: preview.address,
      isOpenNow: preview.isOpenNow,
      marketPhone: preview.marketPhone1 || preview.marketPhone2 || preview.ownerPhone,
      businessHourLines: preview.businessHours.map(formatBusinessHour),
      topProducts: preview.top3.map((product) => ({
        id: product.productId,
        name: product.name,
        thumbnailUrl: product.thumbnailUrl,
        price: formatPrice(product.discountedPrice),
        discountRate: product.discountRate,
      })),
      dailyTotalCount: preview.daily.totalCount,
      dailyProducts: preview.daily.products.map((product) => ({
        id: product.productId,
        name: product.name,
        thumbnailUrl: product.thumbnailUrl,
        originalPrice: formatPrice(product.originalPrice),
        price: formatPrice(product.discountedPrice),
        discountRate: product.discountRate,
      })),
      eventProducts: preview.preparedProducts.map((product) => ({
        id: product.preparedProductId,
        name: product.name,
        thumbnailUrl: product.thumbnailUrl,
        price: formatPrice(product.discountedPrice),
      })),
    },
  };
};
