import { MemoryRouter } from 'react-router';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { LoginPage } from './LoginPage';

const meta = {
  title: 'Market Owner/Auth/Login/LoginPage',
  component: LoginPage,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoginPage>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {};
