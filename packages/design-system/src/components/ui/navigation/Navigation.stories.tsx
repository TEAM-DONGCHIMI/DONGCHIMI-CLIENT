import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { Navigation } from './Navigation';

const tenPages = Array.from({ length: 10 }, (_, index) => index + 1);

const meta = {
  title: 'Design System/UI/Navigation',
  component: Navigation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: { min: 1, type: 'number' },
    },
    getPageAriaLabel: {
      control: false,
    },
    nextIcon: {
      control: false,
    },
    onPageChange: {
      control: false,
    },
    pages: {
      control: false,
    },
    previousIcon: {
      control: false,
    },
  },
  args: {
    currentPage: 2,
    onPageChange: fn(),
    pages: tenPages,
  },
} satisfies Meta<typeof Navigation>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {};

export const FirstPage: StoryTypes = {
  args: {
    currentPage: 1,
  },
};

export const LastPage: StoryTypes = {
  args: {
    currentPage: 10,
  },
};

export const ManyPages: StoryTypes = {
  args: {
    currentPage: 6,
    pages: Array.from({ length: 15 }, (_, index) => index + 1),
  },
  render: (args) => {
    return (
      <div style={{ width: 'min(calc(100vw - 3.2rem), 60rem)', overflow: 'hidden' }}>
        <Navigation {...args} />
      </div>
    );
  },
};

export const CustomLabels: StoryTypes = {
  args: {
    'aria-label': '상품 목록 페이지',
    getPageAriaLabel: (page, selected) =>
      selected ? `상품 목록 ${page} 페이지, 현재 페이지` : `상품 목록 ${page} 페이지`,
    nextLabel: '다음 상품 페이지',
    previousLabel: '이전 상품 페이지',
  },
};
