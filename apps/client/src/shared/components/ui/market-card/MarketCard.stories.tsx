import type { Meta, StoryObj } from '@storybook/react-vite';

import { MarketCard } from './MarketCard';

const meta = {
  title: 'Client/Shared/UI/MarketCard',
  component: MarketCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: false,
    },
    imageAlt: {
      control: 'text',
    },
    imageSrc: {
      control: 'text',
    },
    hasSaleChip: {
      control: 'boolean',
    },
    price: {
      control: 'text',
    },
    productName: {
      control: 'text',
    },
    saleChipLabel: {
      control: 'text',
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium'],
    },
  },
  args: {
    hasSaleChip: false,
    imageAlt: '삼겹살 500g',
    imageSrc: '/exampleImg.png',
    price: '6,900원',
    productName: '삼겹살 500g',
    saleChipLabel: '10%',
    size: 'medium',
  },
} satisfies Meta<typeof MarketCard>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Medium: StoryTypes = {};

export const MediumWithSaleChip: StoryTypes = {
  args: {
    hasSaleChip: true,
  },
};

export const Small: StoryTypes = {
  args: {
    size: 'small',
  },
};

export const SmallWithSaleChip: StoryTypes = {
  args: {
    hasSaleChip: true,
    size: 'small',
  },
};

export const LongText: StoryTypes = {
  args: {
    hasSaleChip: true,
    price: '12,345,678원',
    productName: '국내산 냉장 삼겹살 구이용 500g',
  },
};
