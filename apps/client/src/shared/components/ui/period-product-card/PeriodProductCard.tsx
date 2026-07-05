import Image, { type ImageProps } from 'next/image';
import Link, { type LinkProps } from 'next/link';
import { type AriaAttributes, type MouseEventHandler } from 'react';

import { cn } from '@dongchimi/design-system/styles';

import * as S from './PeriodProductCard.css';

type PeriodProductCardBaseProps = AriaAttributes & {
  className?: string;
  id?: string;
  imageAlt?: string;
  imageSrc?: ImageProps['src'];
  priceText: string;
  productName: string;
};

type PeriodProductCardLinkProps = PeriodProductCardBaseProps & {
  href: LinkProps['href'];
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

type PeriodProductCardStaticProps = PeriodProductCardBaseProps & {
  href?: undefined;
  onClick?: undefined;
};

export type PeriodProductCardProps = PeriodProductCardLinkProps | PeriodProductCardStaticProps;

const PRODUCT_LINK_SUFFIX = '상품 보기';
const PRODUCT_IMAGE_SUFFIX = '상품 이미지';
const PRODUCT_PRICE_UNIT = '원';

const getProductCardLabel = (productName: string) => `${productName} ${PRODUCT_LINK_SUFFIX}`;
const hasProductImage = (imageSrc: ImageProps['src'] | undefined): imageSrc is ImageProps['src'] =>
  imageSrc != null && (typeof imageSrc !== 'string' || imageSrc.length > 0);

export const PeriodProductCard = ({
  'aria-label': ariaLabel,
  href,
  className,
  imageAlt,
  imageSrc,
  onClick,
  priceText,
  productName,
  ...props
}: PeriodProductCardProps) => {
  const hasImage = hasProductImage(imageSrc);
  const accessibleName = ariaLabel ?? getProductCardLabel(productName);

  const content = (
    <>
      <span className={S.imageFrameClassName}>
        {hasImage ? (
          <Image
            alt={imageAlt ?? `${productName} ${PRODUCT_IMAGE_SUFFIX}`}
            className={S.imageClassName}
            fill
            sizes='9.4rem'
            src={imageSrc}
            unoptimized
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

  if (href != null) {
    return (
      <Link
        aria-label={accessibleName}
        className={cn(S.rootClassName, S.interactiveRootClassName, className)}
        href={href}
        onClick={onClick}
        {...props}
      >
        {content}
      </Link>
    );
  }

  return (
    <div aria-label={ariaLabel} className={cn(S.rootClassName, className)} {...props}>
      {content}
    </div>
  );
};
