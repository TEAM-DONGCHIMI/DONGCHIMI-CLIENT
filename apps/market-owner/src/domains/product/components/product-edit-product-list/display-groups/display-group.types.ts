import { type ComponentProps } from 'react';

import { type ProductEditCardDesktop } from '@/shared/components';

export type ProductEditCardProps = ComponentProps<typeof ProductEditCardDesktop>;

export interface ProductEditProductGroup {
  products: ProductEditCardProps[];
  title: string;
}

export type ProductEditCardVariantTypes = 'eventDiscount' | 'todaySpecial';

export type ProductEditGroupFilterTypes = 'category' | 'registered' | 'views';

export interface ProductEditGroupableProduct extends ProductEditCardProps {
  categoryName: string;
  productName: string;
  registeredAt?: string;
  registeredDateLabel: string;
  salePrice: string;
  viewCount?: number;
}
