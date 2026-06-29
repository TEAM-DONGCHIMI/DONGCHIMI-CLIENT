import { MarketProductsPage } from '@/domains/market/market-products/MarketProductsPage';

type PageProps = Readonly<{
  params: Promise<{
    marketId: string;
  }>;
}>;

const Page = async ({ params }: PageProps) => {
  const { marketId } = await params;

  return <MarketProductsPage marketId={marketId} />;
};

export default Page;
