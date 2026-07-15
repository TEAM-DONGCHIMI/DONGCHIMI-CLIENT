import { ProductDetailQueryContent } from './components/product-detail-query-content';
import * as S from './ProductDetailPage.css';

export type ProductDetailPageProps = Readonly<{
  marketSlug: string;
  productId: string;
}>;

export const ProductDetailPage = ({ marketSlug, productId }: ProductDetailPageProps) => {
  return (
    <main className={S.pageClassName}>
      <ProductDetailQueryContent marketSlug={marketSlug} productId={productId} />
    </main>
  );
};
