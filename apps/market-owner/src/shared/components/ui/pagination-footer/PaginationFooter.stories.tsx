import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { PaginationFooter } from './PaginationFooter';

const noop = () => undefined;

const renderWithWidth = (args: ComponentProps<typeof PaginationFooter>) => {
  return (
    <div style={{ width: 'min(calc(100vw - 3.2rem), 137.6rem)' }}>
      <PaginationFooter {...args} />
    </div>
  );
};

const meta = {
  title: 'Market Owner/Shared/UI/PaginationFooter',
  component: PaginationFooter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    getPageAriaLabel: {
      control: false,
    },
    onPageChange: {
      action: 'page changed',
    },
    onPageSizeClick: {
      action: 'page size clicked',
    },
    pageSizeSuffix: {
      control: false,
    },
    pages: {
      control: false,
    },
  },
  args: {
    currentPage: 1,
    onPageChange: noop,
    onPageSizeClick: noop,
    pageSize: 10,
    pages: [1, 2, 3],
    rangeEnd: 10,
    rangeStart: 1,
    totalCount: 128,
  },
} satisfies Meta<typeof PaginationFooter>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {
  render: renderWithWidth,
};

export const MiddlePage: StoryTypes = {
  args: {
    currentPage: 2,
    rangeEnd: 20,
    rangeStart: 11,
  },
  render: renderWithWidth,
};

export const StaticPageSize: StoryTypes = {
  args: {
    onPageSizeClick: undefined,
  },
  render: renderWithWidth,
};
