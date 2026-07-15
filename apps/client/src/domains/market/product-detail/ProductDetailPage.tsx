import { notFound } from 'next/navigation';

import { CardText } from '@/shared/components/ui/card-text';
import { CLIENT_ROUTES } from '@/shared/constants';

import { ProductDetailHeader } from './components/ProductDetailHeader';
import { ProductDetailPromotionChips } from './components/ProductDetailPromotionChips';
import {
  getProductDetailFixture,
  type ProductDetailPromotionTypes,
} from './fixtures/product-detail-fixtures';
import * as S from './ProductDetailPage.css';

type ProductDetailPageProps = Readonly<{
  marketSlug: string;
  productId: string;
}>;

const ProductDetailImage = ({ imageAlt }: { imageAlt: string }) => {
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

export const ProductDetailPage = ({ marketSlug, productId }: ProductDetailPageProps) => {
  const productDetail = getProductDetailFixture(productId);
  const marketProductsHref = CLIENT_ROUTES.market(marketSlug);

  if (productDetail == null) {
    notFound();
  }

  return (
    <main className={S.pageClassName}>
      <ProductDetailHeader fallbackHref={marketProductsHref} title={productDetail.headerTitle} />

      <ProductDetailImage imageAlt={productDetail.imageAlt} />

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
    </main>
  );
};
