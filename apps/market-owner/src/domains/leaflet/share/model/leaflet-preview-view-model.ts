import { formatBusinessHour } from '@dongchimi/shared';

import type { FlyerPreviewResponseTypes } from '../api';

export interface LeafletSummaryViewModel {
  eventDiscountProductCount: number;
  todaySpecialProductCount: number;
}

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
  businessHourTexts: ReturnType<typeof formatBusinessHour>[];
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
  summary: LeafletSummaryViewModel;
}

const formatPrice = (price: number) => price.toLocaleString('ko-KR');

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
      businessHourTexts: preview.businessHours.map(formatBusinessHour),
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
