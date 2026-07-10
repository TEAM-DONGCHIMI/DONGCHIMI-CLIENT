'use client';

import type { ReactNode } from 'react';

import { isApiError } from '@/shared/api';
import { CardText } from '@/shared/components/ui/card-text';
import { CLIENT_ROUTES } from '@/shared/constants';

import { ProductDetailHeader } from './components/ProductDetailHeader';
import { ProductDetailPromotionChips } from './components/ProductDetailPromotionChips';
import { useProductDetailQuery } from '../hooks/use-product-detail-query';
import type { ProductDetailPromotionTypes, ProductDetailTypes } from '../model/product-detail';
import * as S from './ProductDetailPage.css';

type ProductDetailPageProps = Readonly<{
  marketId: string;
  productId: string;
}>;

const ProductDetailImage = ({ imageAlt, imageUrl }: { imageAlt: string; imageUrl?: string }) => {
  if (imageUrl != null) {
    return (
      <section aria-label={imageAlt} className={S.imageSectionClassName}>
        {/* eslint-disable-next-line @next/next/no-img-element -- backend thumbnail hosts are API-managed and not finalized for next/image remotePatterns yet. */}
        <img alt={imageAlt} className={S.imageClassName} src={imageUrl} />
      </section>
    );
  }

  return (
    <section aria-label={imageAlt} className={S.imageSectionClassName}>
      <div aria-hidden='true' className={S.imageFallbackClassName} />
      <span className={S.visuallyHiddenClassName}>상품 이미지 준비 중</span>
    </section>
  );
};

const ProductPrice = ({ promotion }: { promotion: ProductDetailPromotionTypes }) => {
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

const MartCommentCard = ({ comment }: { comment: string }) => {
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

const MartCommentSection = ({ comment }: { comment?: string }) => {
  if (comment == null) {
    return null;
  }

  return <MartCommentCard comment={comment} />;
};

const ProductDetailStateMessage = ({
  action,
  description,
  role = 'status',
  title,
}: Readonly<{
  action?: ReactNode;
  description: string;
  role?: 'alert' | 'status';
  title: string;
}>) => {
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
  if (isApiError(error) && error.type === 'configuration') {
    return '상품 정보를 불러오기 위한 API 설정이 필요합니다.';
  }

  if (isApiError(error) && error.message.length > 0) {
    return error.message;
  }

  return '잠시 후 다시 시도해주세요.';
};

const ProductDetailContent = ({ productDetail }: { productDetail: ProductDetailTypes }) => {
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

export const ProductDetailPage = ({ marketId, productId }: ProductDetailPageProps) => {
  const marketProductsHref = CLIENT_ROUTES.market(marketId);
  const productDetailQuery = useProductDetailQuery({ marketId, productId });
  const productDetail = productDetailQuery.data;
  const headerTitle = productDetail?.headerTitle ?? '상품 상세';
  const isProductDetailEmpty = productDetailQuery.isSuccess && productDetail == null;
  const hasProductDetail = productDetailQuery.isSuccess && productDetail != null;

  return (
    <main className={S.pageClassName}>
      <ProductDetailHeader fallbackHref={marketProductsHref} title={headerTitle} />

      {productDetailQuery.isPending && (
        <ProductDetailStateMessage
          description='상품 상세 정보를 불러오고 있습니다.'
          title='상품 정보를 불러오는 중'
        />
      )}

      {productDetailQuery.isError && (
        <ProductDetailStateMessage
          action={
            <button
              className={S.retryButtonClassName}
              disabled={productDetailQuery.isFetching}
              type='button'
              onClick={() => {
                void productDetailQuery.refetch();
              }}
            >
              다시 시도
            </button>
          }
          description={getErrorDescription(productDetailQuery.error)}
          role='alert'
          title='상품 정보를 불러오지 못했습니다'
        />
      )}

      {isProductDetailEmpty && (
        <ProductDetailStateMessage
          description='판매 중인 상품이 아니거나 상품 정보가 삭제되었습니다.'
          title='상품 정보를 찾을 수 없습니다'
        />
      )}

      {hasProductDetail && <ProductDetailContent productDetail={productDetail} />}
    </main>
  );
};
