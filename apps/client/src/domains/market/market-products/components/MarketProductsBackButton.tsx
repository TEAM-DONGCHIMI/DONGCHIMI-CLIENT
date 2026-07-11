'use client';

import { useRouter } from 'next/navigation';

import { IcChevronLeft } from '@dongchimi/design-system/icons';

import { MobileHeader } from '@/shared/components/ui/mobile-header';

type MarketProductsBackButtonProps = Readonly<{
  fallbackHref: string;
}>;

export const MarketProductsBackButton = ({ fallbackHref }: MarketProductsBackButtonProps) => {
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
      aria-label='마트 목록으로 돌아가기'
      icon={<IcChevronLeft />}
      onClick={handleBackButtonClick}
    />
  );
};
