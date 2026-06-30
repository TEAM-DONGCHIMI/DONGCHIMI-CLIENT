import Link from 'next/link';

import { CLIENT_ROUTES } from '@/shared/constants';

const SAMPLE_PRODUCT_ID = 'samgyeopsal-500g';

type MarketProductsPageProps = Readonly<{
  marketId: string;
}>;

export const MarketProductsPage = ({ marketId }: MarketProductsPageProps) => {
  return (
    <main>
      <section aria-labelledby='market-products-title'>
        <p>마트 ID: {marketId}</p>
        <h1 id='market-products-title'>마트 전단 상품</h1>
        <p>오늘의 특가와 기간 할인 상품을 목록으로 확인하는 화면입니다.</p>

        <nav aria-label='상품 탐색'>
          <Link href={CLIENT_ROUTES.marketProduct(marketId, SAMPLE_PRODUCT_ID)}>
            삼겹살 500g 상세 보기
          </Link>
        </nav>
      </section>
    </main>
  );
};
