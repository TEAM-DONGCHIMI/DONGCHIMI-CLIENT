import { type ComponentPropsWithoutRef, type ReactNode } from 'react';

export interface ProductCardItemTypes {
  badgeLabel?: string;
  discountRate?: number;
  id: string;
  imageAlt?: string;
  imageUrl?: string;
  name: string;
  originalPriceText?: string;
  priceText: string;
  rank?: number | string;
}

export type ProductCardItemVariantTypes = 'period' | 'today';

export type ProductCardSurfaceTypes = 'elevated' | 'flat';

export interface ProductCardProps extends Omit<
  ComponentPropsWithoutRef<'section'>,
  'children' | 'title'
> {
  actionSlot?: ReactNode;
  collapseLabel?: string;
  emptyMessage?: string;
  initialVisibleCount?: number;
  itemVariant?: ProductCardItemVariantTypes;
  items: ProductCardItemTypes[];
  onProductClick: (item: ProductCardItemTypes, index: number) => void;
  showMoreLabel?: string;
  surface?: ProductCardSurfaceTypes;
  title: string;
  totalCount?: number;
}
