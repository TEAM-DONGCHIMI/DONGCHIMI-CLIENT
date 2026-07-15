import { QueryClient } from '@tanstack/react-query';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders, screen, server, userEvent, waitFor } from '@/test';

import { MARKET_DETAIL_API_RESPONSE_FIXTURE } from '../api/market-detail-api.mock';
import { PRODUCT_DETAIL_API_RESPONSE_FIXTURE } from '../api/product-detail-api.mock';
import { ProductDetailPage } from './ProductDetailPage';

const router = {
  back: vi.fn(),
  push: vi.fn(),
};

vi.mock('next/navigation', () => ({
  useRouter: () => router,
}));

const MARKET_SLUG = 'mangwon-fresh';
const PRODUCT_ID = '10';
const MARKET_DETAIL_API_PATH = `${window.location.origin}/api/markets/:slug`;
const PRODUCT_DETAIL_API_PATH = `${window.location.origin}/api/products/:productId`;

const createQueryClientWithoutRetry = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
};

const renderProductDetailPage = () => {
  return renderWithProviders(<ProductDetailPage marketSlug={MARKET_SLUG} productId={PRODUCT_ID} />);
};

describe('ProductDetailPage', () => {
  beforeEach(() => {
    router.back.mockClear();
    router.push.mockClear();

    server.use(
      http.get(MARKET_DETAIL_API_PATH, () => {
        return HttpResponse.json(MARKET_DETAIL_API_RESPONSE_FIXTURE);
      }),
      http.get(PRODUCT_DETAIL_API_PATH, ({ request }) => {
        expect(new URL(request.url).searchParams.get('marketId')).toBe(
          String(MARKET_DETAIL_API_RESPONSE_FIXTURE.data.marketId),
        );

        return HttpResponse.json(PRODUCT_DETAIL_API_RESPONSE_FIXTURE);
      }),
    );
  });

  it('slug로 조회한 marketId를 상품 상세 BFF 요청에 사용한다', async () => {
    renderProductDetailPage();

    expect(await screen.findByRole('heading', { name: '삼겹살 500g' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '오늘의 특가' })).toBeInTheDocument();
    expect(screen.getByAltText('삼겹살 500g 상품 이미지')).toHaveAttribute(
      'src',
      PRODUCT_DETAIL_API_RESPONSE_FIXTURE.data.thumbnailUrl,
    );
    expect(screen.getByRole('note', { name: '점장 한마디' })).toHaveTextContent(
      '오늘 들어온 삼겹살입니다.',
    );
  });

  it('marketId를 해소하는 동안 상품 상세 요청을 시작하지 않는다', async () => {
    let productRequestCount = 0;

    server.use(
      http.get(MARKET_DETAIL_API_PATH, async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));

        return HttpResponse.json(MARKET_DETAIL_API_RESPONSE_FIXTURE);
      }),
      http.get(PRODUCT_DETAIL_API_PATH, () => {
        productRequestCount += 1;

        return HttpResponse.json(PRODUCT_DETAIL_API_RESPONSE_FIXTURE);
      }),
    );

    renderProductDetailPage();

    expect(screen.getByRole('status')).toHaveTextContent(
      '상품 조회에 필요한 마트 정보를 확인하고 있습니다.',
    );
    expect(productRequestCount).toBe(0);

    expect(await screen.findByRole('heading', { name: '삼겹살 500g' })).toBeInTheDocument();
    expect(productRequestCount).toBe(1);
  });

  it('상품 상세 오류 message를 표시하고 해당 요청을 재시도한다', async () => {
    const user = userEvent.setup();
    const queryClient = createQueryClientWithoutRetry();

    server.use(
      http.get(PRODUCT_DETAIL_API_PATH, () => {
        return HttpResponse.json(
          {
            code: 'PRODUCT_NOT_FOUND',
            message: '존재하지 않는 상품입니다.',
            success: false,
          },
          { status: 404 },
        );
      }),
    );

    renderWithProviders(<ProductDetailPage marketSlug={MARKET_SLUG} productId={PRODUCT_ID} />, {
      queryClient,
    });

    expect(await screen.findByRole('alert')).toHaveTextContent('존재하지 않는 상품입니다.');

    server.use(
      http.get(PRODUCT_DETAIL_API_PATH, () => {
        return HttpResponse.json(PRODUCT_DETAIL_API_RESPONSE_FIXTURE);
      }),
    );

    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(await screen.findByRole('heading', { name: '삼겹살 500g' })).toBeInTheDocument();
  });

  it('상품 상세 data가 null이면 empty 상태를 표시한다', async () => {
    server.use(
      http.get(PRODUCT_DETAIL_API_PATH, () => {
        return HttpResponse.json({
          ...PRODUCT_DETAIL_API_RESPONSE_FIXTURE,
          data: null,
        });
      }),
    );

    renderProductDetailPage();

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('상품 정보를 찾을 수 없습니다');
    });
  });

  it('productId가 양의 정수가 아니면 상품 상세 요청을 보내지 않는다', async () => {
    let productRequestCount = 0;

    server.use(
      http.get(PRODUCT_DETAIL_API_PATH, () => {
        productRequestCount += 1;

        return HttpResponse.json(PRODUCT_DETAIL_API_RESPONSE_FIXTURE);
      }),
    );

    renderWithProviders(<ProductDetailPage marketSlug={MARKET_SLUG} productId='invalid-product' />);

    expect(await screen.findByText('올바르지 않은 상품 식별자입니다.')).toBeInTheDocument();
    await waitFor(() => expect(productRequestCount).toBe(0));
  });
});
