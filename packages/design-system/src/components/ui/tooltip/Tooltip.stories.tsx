import type { Meta, StoryObj } from '@storybook/react-vite';

import { Tooltip } from './Tooltip';

const meta = {
  title: 'Design System/UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
    },
    space: {
      control: 'inline-radio',
      options: ['top', 'bottom'],
    },
  },
  args: {
    children: '메시지에 마침표를 찍어요.',
    space: 'top',
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {
  args: {
    space: 'top',
  },
};

export const SpaceBottom: StoryTypes = {
  args: {
    space: 'bottom',
  },
};

export const LongText: StoryTypes = {
  args: {
    children: '아주 긴 안내 문구가 들어가면 최대 너비 안에서 자동으로 줄바꿈되어 표시됩니다.',
  },
};
