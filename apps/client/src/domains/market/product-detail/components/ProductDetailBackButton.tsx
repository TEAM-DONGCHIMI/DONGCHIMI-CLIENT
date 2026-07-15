'use client';

import { useRouter } from 'next/navigation';

import { IcChevronLeft } from '@dongchimi/design-system/icons';

import { MobileHeader } from '@/shared/components/ui/mobile-header';

type ProductDetailBackButtonProps = Readonly<{
  fallbackHref: string;
}>;

export const ProductDetailBackButton = ({ fallbackHref }: ProductDetailBackButtonProps) => {
  const router = useRouter();

  const handleBackButtonClick = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  };

  return (
    <MobileHeader.BackButton
      aria-label='상품 목록으로 돌아가기'
      icon={<IcChevronLeft />}
      onClick={handleBackButtonClick}
    />
  );
};
