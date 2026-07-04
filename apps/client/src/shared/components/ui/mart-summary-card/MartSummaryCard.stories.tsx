import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { MartSummaryCard } from './MartSummaryCard';

const sampleProduct = {
  imageSrc: '/exampleImg.png',
  price: '6,900원',
  productName: '삼겹살 500g',
  saleChipLabel: '10%',
};

const sampleProducts = Array.from({ length: 6 }, (_, index) => ({
  hasSaleChip: index === 0,
  imageAlt: `삼겹살 500g ${index + 1}`,
  ...sampleProduct,
}));

const meta = {
  title: 'Client/Shared/UI/MartSummaryCard',
  component: MartSummaryCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    actionLabel: {
      control: 'text',
    },
    areaName: {
      control: 'text',
    },
    className: {
      control: false,
    },
    discountCount: {
      control: 'number',
    },
    martName: {
      control: 'text',
    },
    onActionClick: {
      control: false,
    },
    products: {
      control: 'object',
    },
    profileImageAlt: {
      control: 'text',
    },
    profileImageSrc: {
      control: 'text',
    },
    timeText: {
      control: 'text',
    },
  },
  args: {
    areaName: '망원동',
    discountCount: 6,
    martName: '망원 신선마트',
    onActionClick: fn(),
    products: sampleProducts,
    profileImageAlt: '망원 신선마트',
    profileImageSrc: '/exampleImg.png',
    timeText: '도보 5분',
  },
} satisfies Meta<typeof MartSummaryCard>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {};

export const LongText: StoryTypes = {
  args: {
    martName: '망원동에서 가장 신선한 우리동네 프리미엄 마트',
    products: sampleProducts.map((product, index) =>
      index === 0
        ? {
            ...product,
            imageAlt: '국내산 냉장 삼겹살 구이용 500g',
            price: '12,345,678원',
            productName: '국내산 냉장 삼겹살 구이용 500g',
          }
        : product,
    ),
  },
};

export const NoProducts: StoryTypes = {
  args: {
    products: [],
  },
};

export const CustomActionLabel: StoryTypes = {
  args: {
    actionLabel: '진단보기',
  },
};
