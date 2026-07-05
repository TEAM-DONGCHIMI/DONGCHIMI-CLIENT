import { type AriaAttributes, type MouseEventHandler } from 'react';

import { cn } from '@dongchimi/design-system/styles';

import * as S from './PeriodProductCard.css';

export interface PeriodProductCardProps extends AriaAttributes {
  className?: string;
  id?: string;
  imageAlt?: string;
  imageSrc?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  priceText: string;
  productName: string;
}

const PRODUCT_SELECT_SUFFIX = '상품 선택';
const PRODUCT_IMAGE_SUFFIX = '상품 이미지';
const PRODUCT_PRICE_UNIT = '원';

const getProductCardLabel = (productName: string) => `${productName} ${PRODUCT_SELECT_SUFFIX}`;

export const PeriodProductCard = ({
  'aria-label': ariaLabel,
  className,
  imageAlt,
  imageSrc,
  onClick,
  priceText,
  productName,
  ...props
}: PeriodProductCardProps) => {
  const hasImage = imageSrc != null && imageSrc.length > 0;
  const accessibleName = ariaLabel ?? getProductCardLabel(productName);

  const content = (
    <>
      <span className={S.imageFrameClassName}>
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- Product image hosts are API-provided and not tied to Next image config.
          <img
            alt={imageAlt ?? `${productName} ${PRODUCT_IMAGE_SUFFIX}`}
            className={S.imageClassName}
            src={imageSrc}
          />
        ) : (
          <span aria-hidden='true' className={S.imageFallbackClassName} />
        )}
      </span>
      <span className={S.contentClassName}>
        <span className={S.productNameClassName}>{productName}</span>
        <span className={S.priceRowClassName}>
          <span className={S.priceTextClassName}>{priceText}</span>
          <span className={S.priceUnitClassName}>{PRODUCT_PRICE_UNIT}</span>
        </span>
      </span>
    </>
  );

  if (onClick != null) {
    return (
      <button
        aria-label={accessibleName}
        className={cn(S.rootClassName, S.interactiveRootClassName, className)}
        onClick={onClick}
        type='button'
        {...props}
      >
        {content}
      </button>
    );
  }

  return (
    <div aria-label={ariaLabel} className={cn(S.rootClassName, className)} {...props}>
      {content}
    </div>
  );
};
