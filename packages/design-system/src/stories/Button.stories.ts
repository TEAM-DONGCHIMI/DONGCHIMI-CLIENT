import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { Button } from './Button';

const meta = {
  title: 'Examples/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Primary: StoryTypes = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Secondary: StoryTypes = {
  args: {
    label: 'Button',
  },
};
