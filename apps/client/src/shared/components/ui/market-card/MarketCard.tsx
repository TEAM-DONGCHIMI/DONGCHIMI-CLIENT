import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { cn } from '@dongchimi/design-system/styles';
import type { RecipeVariantProps } from '@dongchimi/design-system/styles';
import Image from 'next/image';

import * as S from './MarketCard.css';

type NativeMarketCardProps = Omit<ComponentPropsWithoutRef<'article'>, 'children'>;
type MarketCardVariantProps = RecipeVariantProps<typeof S.marketCard>;

export interface MarketCardProps extends NativeMarketCardProps, MarketCardVariantProps {
  hasSaleChip?: boolean;
  imageAlt: string;
  imageSrc: string;
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
    return (
      <article ref={ref} className={cn(S.marketCard({ size }), className)} {...props}>
        <Image alt={imageAlt} className={S.imageClassName} fill src={imageSrc} />
        <div aria-hidden='true' className={S.scrimClassName} />
        <div className={S.contentClassName({ size })}>
          <span className={S.productNameClassName}>{productName}</span>
          <strong className={S.priceClassName}>{price}</strong>
        </div>
        {hasSaleChip ? (
          // TODO: chip 컴포넌트 교체
          <span className={S.saleChipClassName}>{saleChipLabel}</span>
        ) : null}
      </article>
    );
  },
);

MarketCard.displayName = 'MarketCard';
