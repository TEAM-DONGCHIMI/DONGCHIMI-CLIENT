import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { PeriodProductCard } from './PeriodProductCard';

const squareProductImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='188' height='188' viewBox='0 0 188 188'%3E%3Crect width='188' height='188' fill='%23f2f4f6'/%3E%3Ccircle cx='94' cy='76' r='44' fill='%23ffb84d'/%3E%3Crect x='42' y='102' width='104' height='42' rx='20' fill='%2315c47e'/%3E%3C/svg%3E";
const wideProductImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='140' viewBox='0 0 280 140'%3E%3Crect width='280' height='140' fill='%23e6faf2'/%3E%3Cellipse cx='90' cy='72' rx='62' ry='42' fill='%23ff9200'/%3E%3Cellipse cx='182' cy='72' rx='62' ry='42' fill='%23ff6362'/%3E%3C/svg%3E";
const tallProductImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='240' viewBox='0 0 120 240'%3E%3Crect width='120' height='240' fill='%23f9fafb'/%3E%3Crect x='26' y='30' width='68' height='180' rx='34' fill='%230066ff'/%3E%3Ccircle cx='60' cy='72' r='24' fill='%23ffffff'/%3E%3C/svg%3E";
const defaultProductName = '\uC0BC\uACB9\uC0B4 500G';
const defaultProductImageAlt = `${defaultProductName} \uC0C1\uD488 \uC774\uBBF8\uC9C0`;
const longProductName =
  '\uAD6D\uB0B4\uC0B0 \uBB34\uD56D\uC0DD\uC81C \uB0C9\uC7A5 \uC0BC\uACB9\uC0B4 \uAD6C\uC774\uC6A9 500G \uC624\uB298\uB9CC \uD2B9\uAC00 \uC0C1\uD488';
const wideImageProductName = '\uAC00\uB85C\uD615 \uC0C1\uD488 \uC774\uBBF8\uC9C0';
const tallImageProductName = '\uC138\uB85C\uD615 \uC0C1\uD488 \uC774\uBBF8\uC9C0';

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
    imageAlt: {
      control: 'text',
    },
    imageSrc: {
      control: 'text',
    },
    onClick: {
      control: false,
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
    imageSrc: squareProductImage,
    priceText: '4,900',
    productName: defaultProductName,
  },
} satisfies Meta<typeof PeriodProductCard>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {};

export const Clickable: StoryTypes = {
  args: {
    onClick: fn(),
  },
};

export const LongProductName: StoryTypes = {
  args: {
    productName: longProductName,
  },
};

export const LongPrice: StoryTypes = {
  args: {
    priceText: '123,456,789',
  },
};

export const WithoutImage: StoryTypes = {
  args: {
    imageSrc: undefined,
  },
};

export const WideImage: StoryTypes = {
  args: {
    imageSrc: wideProductImage,
    productName: wideImageProductName,
  },
};

export const TallImage: StoryTypes = {
  args: {
    imageSrc: tallProductImage,
    productName: tallImageProductName,
  },
};
