import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { Button } from '@dongchimi/design-system';
import { cn } from '@dongchimi/design-system/styles';
import Image from 'next/image';

import { MarketCard, type MarketCardProps } from '../market-card';
import * as S from './MartSummaryCard.css';

type NativeMartSummaryCardProps = Omit<ComponentPropsWithoutRef<'article'>, 'children'>;

export type MartSummaryProductTypes = Pick<
  MarketCardProps,
  'hasSaleChip' | 'imageAlt' | 'imageSrc' | 'price' | 'productName' | 'saleChipLabel'
>;

export interface MartSummaryCardProps extends NativeMartSummaryCardProps {
  actionLabel?: string;
  areaName: string;
  discountCount: number;
  martName: string;
  onActionClick?: () => void;
  profileImageAlt: string;
  profileImageSrc: string;
  products: MartSummaryProductTypes[];
  timeText: string;
}

export const MartSummaryCard = forwardRef<HTMLElement, MartSummaryCardProps>(
  (
    {
      actionLabel = '전단보기',
      areaName,
      className,
      discountCount,
      martName,
      onActionClick,
      products,
      profileImageAlt,
      profileImageSrc,
      timeText,
      ...props
    },
    ref,
  ) => {
    return (
      <article ref={ref} className={cn(S.martSummaryCardClassName, className)} {...props}>
        <header className={S.headerClassName}>
          <div className={S.profileGroupClassName}>
            <div className={S.profileImageWrapperClassName}>
              <Image
                alt={profileImageAlt}
                className={S.profileImageClassName}
                height={41}
                src={profileImageSrc}
                width={41}
              />
            </div>
            <div className={S.titleGroupClassName}>
              <h2 className={S.martNameClassName}>{martName}</h2>
              <div className={S.metaRowClassName}>
                <span className={S.locationMetaClassName}>
                  <span>{timeText}</span>
                  <span aria-hidden='true'>·</span>
                  <span>{areaName}</span>
                </span>
                {/* TODO: chip 컴포넌트 교체 */}
                <span className={S.discountChipClassName}>할인 {discountCount}개</span>
              </div>
            </div>
          </div>
          <Button
            className={S.actionButtonClassName}
            onClick={onActionClick}
            variant='solid'
            color='primary'
            size='mobile'
          >
            {actionLabel}
          </Button>
        </header>
        <div className={S.productScrollerClassName} role='list'>
          {products.map((product, index) => (
            <MarketCard
              key={`${product.productName}-${product.price}-${index}`}
              {...product}
              className={S.productItemClassName}
              role='listitem'
              size='medium'
            />
          ))}
        </div>
      </article>
    );
  },
);

MartSummaryCard.displayName = 'MartSummaryCard';
