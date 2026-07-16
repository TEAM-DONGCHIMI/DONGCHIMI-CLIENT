import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { PointChip } from '@dongchimi/design-system';
import { cn } from '@dongchimi/design-system/styles';
import type { RecipeVariantProps } from '@dongchimi/design-system/styles';
import Image, { type ImageProps } from 'next/image';

import { hasDisplayableImageSrc } from '@/shared/utils';

import * as S from './MarketCard.css';

type NativeMarketCardProps = Omit<ComponentPropsWithoutRef<'article'>, 'children'>;
type MarketCardVariantProps = RecipeVariantProps<typeof S.marketCard>;

export interface MarketCardProps extends NativeMarketCardProps, MarketCardVariantProps {
  hasSaleChip?: boolean;
  imageAlt: string;
  imageSrc?: ImageProps['src'] | null;
  price: string;
  productName: string;
  saleChipLabel?: string;
}

export const MarketCard = forwardRef<HTMLElement, MarketCardProps>(
  (
    {
      className,
      hasSaleChip = false,
      imageAlt,
      imageSrc,
      price,
      productName,
      saleChipLabel,
      size = 'medium',
      ...props
    },
    ref,
  ) => {
    const shouldShowSaleChip = hasSaleChip && saleChipLabel != null && saleChipLabel.length > 0;
    const hasImage = hasDisplayableImageSrc(imageSrc);

    return (
      <article ref={ref} className={cn(S.marketCard({ size }), className)} {...props}>
        {hasImage && (
          <Image
            alt={imageAlt}
            className={S.imageClassName}
            width={120}
            height={120}
            src={imageSrc}
          />
        )}
        <div aria-hidden='true' className={S.scrimClassName} />
        <div className={S.contentClassName({ size })}>
          <span className={S.productNameClassName}>{productName}</span>
          <strong className={S.priceClassName}>{price}</strong>
        </div>
        {shouldShowSaleChip && (
          <PointChip className={S.saleChipClassName} size='mobile'>
            {saleChipLabel}
          </PointChip>
        )}
      </article>
    );
  },
);

MarketCard.displayName = 'MarketCard';
