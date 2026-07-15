import { ProductDetailPage } from '@/domains/market/product-detail/ProductDetailPage';

type PageProps = Readonly<{
  params: Promise<{
    slug: string;
    productId: string;
  }>;
}>;

const Page = async ({ params }: PageProps) => {
  const { slug, productId } = await params;

  return <ProductDetailPage marketSlug={slug} productId={productId} />;
};

export default Page;
