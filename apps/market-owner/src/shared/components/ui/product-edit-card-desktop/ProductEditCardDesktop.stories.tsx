import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { ProductEditCardDesktop } from './ProductEditCardDesktop';

const noop = () => undefined;

const defaultArgs = {
  categoryName: '정육',
  endDate: '2026. 8. 16',
  originalPrice: '5,000',
  productName: '삼겹살 500g',
  salePercent: '10',
  salePrice: '4,500',
  startDate: '2026. 8. 16',
  viewCount: 162,
  onDeleteClick: noop,
  onEditClick: noop,
  onSelectClick: noop,
} satisfies ComponentProps<typeof ProductEditCardDesktop>;

const renderWithCanvas = (args: ComponentProps<typeof ProductEditCardDesktop>) => {
  return (
    <div style={{ backgroundColor: '#000', padding: '2.4rem' }}>
      <ProductEditCardDesktop {...args} />
    </div>
  );
};

const meta = {
  title: 'Market Owner/Shared/UI/ProductEditCardDesktop',
  component: ProductEditCardDesktop,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: defaultArgs,
} satisfies Meta<typeof ProductEditCardDesktop>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {
  render: renderWithCanvas,
};

export const Selected: StoryTypes = {
  args: {
    selectionState: 'selected',
  },
  render: renderWithCanvas,
};

export const Selectable: StoryTypes = {
  args: {
    selectionState: 'selectable',
  },
  render: renderWithCanvas,
};

export const WithoutDiscountDetails: StoryTypes = {
  args: {
    periodDiscountDate: false,
    todayDiscountPrice: false,
  },
  render: renderWithCanvas,
};

export const LongProductName: StoryTypes = {
  args: {
    productName: '국내산 한돈 프리미엄 냉장 삼겹살 구이용 500g',
  },
  render: renderWithCanvas,
};
