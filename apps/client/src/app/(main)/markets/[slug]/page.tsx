import { MarketProductsPage } from '@/domains/market/market-products/MarketProductsPage';

type PageProps = Readonly<{
  params: Promise<{
    slug: string;
  }>;
}>;

const Page = async ({ params }: PageProps) => {
  const { slug } = await params;

  return <MarketProductsPage marketSlug={slug} />;
};

export default Page;
