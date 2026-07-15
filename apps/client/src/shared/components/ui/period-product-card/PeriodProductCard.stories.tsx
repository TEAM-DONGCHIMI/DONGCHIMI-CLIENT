import type { Meta, StoryObj } from '@storybook/react-vite';

import { PeriodProductCard } from './PeriodProductCard';

const defaultProductImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='188' height='168' viewBox='0 0 188 168'%3E%3Crect width='188' height='168' fill='%23f2f4f6'/%3E%3Cellipse cx='94' cy='78' rx='58' ry='44' fill='%23ffb84d'/%3E%3Crect x='42' y='100' width='104' height='34' rx='17' fill='%2315c47e'/%3E%3C/svg%3E";
const squareProductImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='188' height='188' viewBox='0 0 188 188'%3E%3Crect width='188' height='188' fill='%23f2f4f6'/%3E%3Ccircle cx='94' cy='76' r='44' fill='%23ffb84d'/%3E%3Crect x='42' y='102' width='104' height='42' rx='20' fill='%2315c47e'/%3E%3C/svg%3E";
const longProductImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='240' viewBox='0 0 120 240'%3E%3Crect width='120' height='240' fill='%23f9fafb'/%3E%3Crect x='26' y='30' width='68' height='180' rx='34' fill='%230066ff'/%3E%3Ccircle cx='60' cy='72' r='24' fill='%23ffffff'/%3E%3C/svg%3E";
const defaultProductName = '삼겹살 500G';
const defaultProductImageAlt = `${defaultProductName} 상품 이미지`;
const twoLineProductName = '국내산 무항생제 냉장 삼겹살 구이용';

const meta = {
  title: 'Client/Shared/UI/PeriodProductCard',
  component: PeriodProductCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: false,
    },
    href: {
      control: 'text',
    },
    imageAlt: {
      control: 'text',
    },
    imageSrc: {
      control: 'text',
    },
    onClick: {
      control: false,
    },
    prefetch: {
      control: 'boolean',
    },
    priceText: {
      control: 'text',
    },
    productName: {
      control: 'text',
    },
  },
  args: {
    imageAlt: defaultProductImageAlt,
    imageSrc: defaultProductImage,
    priceText: '4,900',
    productName: defaultProductName,
  },
} satisfies Meta<typeof PeriodProductCard>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {};

export const TwoLineName: StoryTypes = {
  args: {
    productName: twoLineProductName,
  },
};

export const LongImage: StoryTypes = {
  args: {
    imageSrc: longProductImage,
  },
};

export const SquareImage: StoryTypes = {
  args: {
    imageSrc: squareProductImage,
  },
};

export const WithoutImage: StoryTypes = {
  args: {
    imageAlt: undefined,
    imageSrc: undefined,
  },
};

export const LongPrice: StoryTypes = {
  args: {
    priceText: '12,345,678,900',
  },
};

export const ProductLink: StoryTypes = {
  args: {
    href: '/markets/sample-market/products/samgyeopsal-500g',
  },
};
