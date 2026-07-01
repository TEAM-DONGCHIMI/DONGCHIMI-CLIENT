import Link from 'next/link';

import { CLIENT_ROUTES } from '@/shared/constants';

type ProductDetailPageProps = Readonly<{
  marketId: string;
  productId: string;
}>;

export const ProductDetailPage = ({ marketId, productId }: ProductDetailPageProps) => {
  return (
    <main>
      <section aria-labelledby='product-detail-title'>
        <p>마트 ID: {marketId}</p>
        <p>상품 ID: {productId}</p>
        <h1 id='product-detail-title'>상품 상세</h1>
        <p>오늘의 특가 또는 기간 할인 상품의 상세 정보를 확인하는 화면입니다.</p>

        <nav aria-label='상품 상세 이동'>
          <Link href={CLIENT_ROUTES.market(marketId)}>전단 상품 목록으로 돌아가기</Link>
        </nav>
      </section>
    </main>
  );
};
