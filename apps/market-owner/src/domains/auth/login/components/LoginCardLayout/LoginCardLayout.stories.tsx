import type { Meta, StoryObj } from '@storybook/react-vite';

import { LoginCardLayout } from './LoginCardLayout';

const meta = {
  title: 'Market Owner/Auth/Login/LoginCardLayout',
  component: LoginCardLayout,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoginCardLayout>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {
  args: {
    'aria-label': 'Login card layout',
  },
};
