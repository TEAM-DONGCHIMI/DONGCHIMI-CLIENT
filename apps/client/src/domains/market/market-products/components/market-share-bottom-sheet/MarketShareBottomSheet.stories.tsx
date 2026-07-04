import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn, userEvent, within } from 'storybook/test';

import { MarketShareBottomSheet } from './MarketShareBottomSheet';

const meta = {
  title: 'Client/Market/MarketProducts/MarketShareBottomSheet',
  component: MarketShareBottomSheet,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    marketName: {
      control: 'text',
    },
    onCopyLink: {
      control: false,
    },
    onOpenQrCode: {
      control: false,
    },
    onShareKakao: {
      control: false,
    },
    shareUrl: {
      control: 'text',
    },
    triggerClassName: {
      control: false,
    },
    triggerLabel: {
      control: 'text',
    },
  },
  args: {
    marketName: '망원 신선마트',
    onCopyLink: fn(),
    onOpenQrCode: fn(),
    onShareKakao: fn(),
    shareUrl: 'dongchimi.kr/mangwon-fresh',
    triggerLabel: '전단 공유하기',
  },
} satisfies Meta<typeof MarketShareBottomSheet>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {};

export const Opened: StoryTypes = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: '전단 공유하기' }));
  },
};

export const WithoutQrAction: StoryTypes = {
  args: {
    onOpenQrCode: undefined,
  },
};
