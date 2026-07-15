'use client';

import type { ReactNode } from 'react';

import { isApiError } from '@/shared/api';
import { CardText } from '@/shared/components/ui/card-text';
import { CLIENT_ROUTES } from '@/shared/constants';

import { useMarketDetailQuery } from '../../../hooks/use-market-detail-query';
import { useProductDetailQuery } from '../../../hooks/use-product-detail-query';
import {
  hasProductDetailParams,
  type ProductDetailPromotionTypes,
  type ProductDetailTypes,
} from '../../../model/product-detail-schema';
import * as S from '../../ProductDetailPage.css';
import { ProductDetailHeader } from '../ProductDetailHeader';
import { ProductDetailPromotionChips } from '../ProductDetailPromotionChips';

export type ProductDetailQueryContentProps = Readonly<{
  marketSlug: string;
  productId: string;
}>;

type ProductDetailImageProps = Readonly<{
  imageAlt: string;
  imageUrl?: string;
}>;

const ProductDetailImage = ({ imageAlt, imageUrl }: ProductDetailImageProps) => {
  if (imageUrl != null) {
    return (
      <div className={S.imageSectionClassName}>
        {/* eslint-disable-next-line @next/next/no-img-element -- backend thumbnail hosts are API-managed and not finalized for next/image remotePatterns yet. */}
        <img alt={imageAlt} className={S.imageClassName} src={imageUrl} />
      </div>
    );
  }

  return (
    <div className={S.imageSectionClassName}>
      <div aria-hidden='true' className={S.imageFallbackClassName} />
      <span className={S.visuallyHiddenClassName}>{imageAlt}를 준비 중입니다.</span>
    </div>
  );
};

type ProductPriceProps = Readonly<{
  promotion: ProductDetailPromotionTypes;
}>;

const ProductPrice = ({ promotion }: ProductPriceProps) => {
  if (promotion.type === 'today-special') {
    return (
      <p className={S.priceRowClassName}>
        <span className={S.discountedPriceGroupClassName}>
          <span className={S.discountRateClassName}>{promotion.discountRateText}</span>
          <span className={S.salePriceClassName}>{promotion.salePriceText}</span>
        </span>
        <span className={S.originalPriceClassName}>{promotion.originalPriceText}</span>
      </p>
    );
  }

  return <p className={S.singlePriceClassName}>{promotion.salePriceText}</p>;
};

type MartCommentCardProps = Readonly<{
  comment: string;
}>;

const MartCommentCard = ({ comment }: MartCommentCardProps) => {
  return (
    <CardText
      aria-label='점장 한마디'
      className={S.commentCardClassName}
      label='점장 한마디'
      role='note'
      text={comment}
    />
  );
};

type MartCommentSectionProps = Readonly<{
  comment?: string;
}>;

const MartCommentSection = ({ comment }: MartCommentSectionProps) => {
  if (comment == null) {
    return null;
  }

  return <MartCommentCard comment={comment} />;
};

type ProductDetailStateMessageProps = Readonly<{
  action?: ReactNode;
  description: string;
  role?: 'alert' | 'status';
  title: string;
}>;

const ProductDetailStateMessage = ({
  action,
  description,
  role = 'status',
  title,
}: ProductDetailStateMessageProps) => {
  return (
    <section
      aria-live={role === 'alert' ? 'assertive' : 'polite'}
      className={S.stateSectionClassName}
      role={role}
    >
      <p className={S.stateTitleClassName}>{title}</p>
      <p className={S.stateDescriptionClassName}>{description}</p>
      {action}
    </section>
  );
};

const getErrorDescription = (error: Error) => {
  if (isApiError(error) && error.message.length > 0) {
    return error.message;
  }

  return '잠시 후 다시 시도해주세요.';
};

type ProductDetailContentProps = Readonly<{
  productDetail: ProductDetailTypes;
}>;

const ProductDetailContent = ({ productDetail }: ProductDetailContentProps) => {
  return (
    <>
      <ProductDetailImage imageAlt={productDetail.imageAlt} imageUrl={productDetail.imageUrl} />

      <section aria-labelledby='product-detail-product-title' className={S.contentSectionClassName}>
        <div className={S.productSummaryClassName}>
          <p className={S.marketNameClassName}>{productDetail.marketName}</p>
          <ProductDetailPromotionChips
            label={productDetail.promotionLabel}
            promotion={productDetail.promotion}
          />
          <h2 className={S.productNameClassName} id='product-detail-product-title'>
            {productDetail.productName}
          </h2>
          <ProductPrice promotion={productDetail.promotion} />
        </div>

        <MartCommentSection comment={productDetail.martComment} />
      </section>
    </>
  );
};

export const ProductDetailQueryContent = ({
  marketSlug,
  productId,
}: ProductDetailQueryContentProps) => {
  const marketQuery = useMarketDetailQuery({ slug: marketSlug });
  const productDetailParams = {
    marketId: marketQuery.data?.marketId,
    productId,
  };
  const productDetailQuery = useProductDetailQuery(productDetailParams);
  const productDetail = productDetailQuery.data;
  const marketProductsHref = CLIENT_ROUTES.market(marketSlug);
  const hasResolvedProductParams = hasProductDetailParams(productDetailParams);

  let content: ReactNode;

  if (marketQuery.isPending) {
    content = (
      <ProductDetailStateMessage
        description='상품 조회에 필요한 마트 정보를 확인하고 있습니다.'
        title='상품 정보를 불러오는 중'
      />
    );
  } else if (marketQuery.isError) {
    content = (
      <ProductDetailStateMessage
        action={
          <button
            className={S.retryButtonClassName}
            disabled={marketQuery.isFetching}
            type='button'
            onClick={() => void marketQuery.refetch()}
          >
            다시 시도
          </button>
        }
        description={getErrorDescription(marketQuery.error)}
        role='alert'
        title='마트 정보를 불러오지 못했습니다'
      />
    );
  } else if (!hasResolvedProductParams) {
    content = (
      <ProductDetailStateMessage
        description='올바르지 않은 상품 식별자입니다.'
        title='상품 정보를 찾을 수 없습니다'
      />
    );
  } else if (productDetailQuery.isPending) {
    content = (
      <ProductDetailStateMessage
        description='상품 상세 정보를 불러오고 있습니다.'
        title='상품 정보를 불러오는 중'
      />
    );
  } else if (productDetailQuery.isError) {
    content = (
      <ProductDetailStateMessage
        action={
          <button
            className={S.retryButtonClassName}
            disabled={productDetailQuery.isFetching}
            type='button'
            onClick={() => void productDetailQuery.refetch()}
          >
            다시 시도
          </button>
        }
        description={getErrorDescription(productDetailQuery.error)}
        role='alert'
        title='상품 정보를 불러오지 못했습니다'
      />
    );
  } else if (productDetail == null) {
    content = (
      <ProductDetailStateMessage
        description='판매 중인 상품이 아니거나 상품 정보가 삭제되었습니다.'
        title='상품 정보를 찾을 수 없습니다'
      />
    );
  } else {
    content = <ProductDetailContent productDetail={productDetail} />;
  }

  return (
    <>
      <ProductDetailHeader
        fallbackHref={marketProductsHref}
        title={productDetail?.headerTitle ?? '상품 상세'}
      />
      {content}
    </>
  );
};
