import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';

import { RequiredMark } from './RequiredMark';

const meta = {
  title: 'Design System/UI/RequiredMark',
  component: RequiredMark,
  decorators: [
    (Story) => (
      <div style={{ padding: 80 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RequiredMark>;

export default meta;

type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {};

export const Hover: StoryTypes = {
  play: async ({ canvasElement }) => {
    await userEvent.hover(within(canvasElement).getByText('*'));
  },
};
