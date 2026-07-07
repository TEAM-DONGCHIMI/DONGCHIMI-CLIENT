import { MobileHeader } from '@/shared/components/ui/mobile-header';

import * as S from '../ProductDetailPage.css';
import { ProductDetailBackButton } from './ProductDetailBackButton';

type ProductDetailHeaderProps = Readonly<{
  fallbackHref: string;
  title: string;
}>;

export const ProductDetailHeader = ({ fallbackHref, title }: ProductDetailHeaderProps) => {
  return (
    <MobileHeader className={S.headerClassName}>
      <ProductDetailBackButton fallbackHref={fallbackHref} />
      <MobileHeader.Title>{title}</MobileHeader.Title>
    </MobileHeader>
  );
};
