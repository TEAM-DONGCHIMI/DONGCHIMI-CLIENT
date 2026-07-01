import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import * as S from './ProductCard.css';
import { productCardItemsFixture } from './ProductCard.fixtures';
import { ProductCard } from './ProductCard';
import { type ProductCardProps } from './ProductCard.types';

const handleActionClick = fn();

const renderWithResponsiveWidth = (args: ProductCardProps, maxWidth: string) => {
  return (
    <div style={{ width: `min(calc(100vw - 3.2rem), ${maxWidth})` }}>
      <ProductCard {...args} />
    </div>
  );
};

const meta = {
  title: 'Shared/Product/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    actionSlot: {
      control: false,
    },
    itemVariant: {
      control: 'select',
      options: ['today', 'period'],
    },
    items: {
      control: false,
    },
    onProductClick: {
      control: false,
    },
    surface: {
      control: 'select',
      options: ['elevated', 'flat'],
    },
  },
  args: {
    collapseLabel: '상품 접기',
    emptyMessage: '표시할 상품이 없습니다.',
    initialVisibleCount: 4,
    itemVariant: 'today',
    items: productCardItemsFixture,
    onProductClick: fn(),
    showMoreLabel: '더 많은 상품 보기',
    surface: 'elevated',
    title: '오늘의 특가 상품',
    totalCount: 30,
  },
} satisfies Meta<typeof ProductCard>;

export default meta;

type StoryTypes = StoryObj<typeof meta>;

export const TodayDesktop: StoryTypes = {
  render: (args) => renderWithResponsiveWidth(args, '34.2rem'),
};

export const TodayDesktopWithAction: StoryTypes = {
  render: (args) => {
    return (
      <div style={{ width: 'min(calc(100vw - 3.2rem), 34.2rem)' }}>
        <ProductCard
          {...args}
          actionSlot={
            <button className={S.toggleButtonClassName} onClick={handleActionClick} type='button'>
              더 많은 상품 보러가기
            </button>
          }
        />
      </div>
    );
  },
};

export const TodayMobile: StoryTypes = {
  args: {
    initialVisibleCount: 2,
    surface: 'flat',
    totalCount: productCardItemsFixture.length,
  },
  render: (args) => renderWithResponsiveWidth(args, '33.8rem'),
};

export const PeriodRanking: StoryTypes = {
  args: {
    initialVisibleCount: 2,
    itemVariant: 'period',
    surface: 'flat',
    title: '기간 할인 상품',
    totalCount: productCardItemsFixture.length,
  },
  render: (args) => renderWithResponsiveWidth(args, '33.8rem'),
};

export const Empty: StoryTypes = {
  args: {
    items: [],
    title: '등록된 상품',
    totalCount: 0,
  },
  render: (args) => renderWithResponsiveWidth(args, '34.2rem'),
};
