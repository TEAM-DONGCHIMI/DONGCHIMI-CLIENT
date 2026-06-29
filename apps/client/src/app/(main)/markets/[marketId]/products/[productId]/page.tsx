import { ProductDetailPage } from '@/domains/market/product-detail/ProductDetailPage';

type PageProps = Readonly<{
  params: Promise<{
    marketId: string;
    productId: string;
  }>;
}>;

const Page = async ({ params }: PageProps) => {
  const { marketId, productId } = await params;

  return <ProductDetailPage marketId={marketId} productId={productId} />;
};

export default Page;
