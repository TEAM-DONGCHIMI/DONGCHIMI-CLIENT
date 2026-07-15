import type { ReactNode } from 'react';

import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders, screen } from '@/test';

import { PeriodProductCard } from './PeriodProductCard';

const { capturePrefetch } = vi.hoisted(() => ({
  capturePrefetch: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    prefetch,
    ...props
  }: {
    children: ReactNode;
    href: string;
    prefetch?: boolean | 'auto' | null;
  }) => {
    capturePrefetch(prefetch);

    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

describe('PeriodProductCard', () => {
  it('호출부의 link prefetch 정책을 Next Link에 전달한다', () => {
    renderWithProviders(
      <PeriodProductCard
        href='/markets/mangwon-fresh/products/1'
        prefetch={false}
        priceText='6,500'
        productName='신선 계란 30구'
      />,
    );

    expect(screen.getByRole('link', { name: '신선 계란 30구 상품 보기' })).toBeInTheDocument();
    expect(capturePrefetch).toHaveBeenLastCalledWith(false);
  });
});
