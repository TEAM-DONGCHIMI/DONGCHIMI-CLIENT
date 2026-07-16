import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { Button, Chip } from '@dongchimi/design-system';
import { cn } from '@dongchimi/design-system/styles';
import Image, { type ImageProps } from 'next/image';

import { MarketCard, type MarketCardProps } from '../market-card';
import * as S from './MartSummaryCard.css';

type NativeMartSummaryCardProps = Omit<ComponentPropsWithoutRef<'article'>, 'children'>;

export type MartSummaryProductTypes = Pick<
  MarketCardProps,
  'hasSaleChip' | 'imageAlt' | 'imageSrc' | 'price' | 'productName' | 'saleChipLabel'
>;

export interface MartSummaryCardProps extends NativeMartSummaryCardProps {
  actionLabel?: string;
  discountCount: number;
  isOpen: boolean;
  martName: string;
  onActionClick?: () => void;
  profileImageAlt: string;
  profileImageSrc?: ImageProps['src'] | null;
  products: MartSummaryProductTypes[];
}

export const MartSummaryCard = forwardRef<HTMLElement, MartSummaryCardProps>(
  (
    {
      actionLabel = '전단보기',
      className,
      discountCount,
      isOpen,
      martName,
      onActionClick,
      products,
      profileImageAlt,
      profileImageSrc,
      ...props
    },
    ref,
  ) => {
    const hasProfileImage =
      profileImageSrc != null &&
      (typeof profileImageSrc !== 'string' || profileImageSrc.length > 0);

    return (
      <article ref={ref} className={cn(S.martSummaryCardClassName, className)} {...props}>
        <header className={S.headerClassName}>
          <div className={S.profileGroupClassName}>
            <div className={S.profileImageWrapperClassName}>
              {hasProfileImage && (
                <Image
                  alt={profileImageAlt}
                  className={S.profileImageClassName}
                  height={41}
                  src={profileImageSrc}
                  width={41}
                />
              )}
            </div>
            <div className={S.titleGroupClassName}>
              <h2 className={S.martNameClassName}>{martName}</h2>
              <div className={S.metaRowClassName}>
                <span className={S.statusMetaClassName}>{isOpen ? '영업중' : '영업 종료'}</span>
                <Chip color='primary' variant='soft' size='mobile'>
                  할인 {discountCount}개
                </Chip>
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
