import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  storyAccentBlockClassName,
  storyBlockClassName,
  storyPanelClassName,
} from '../layout-story.css';
import { Center } from './Center';

const meta = {
  title: 'Design System/Layout/Center',
  component: Center,
  tags: ['autodocs'],
} satisfies Meta<typeof Center>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {
  args: {
    className: storyPanelClassName,
    children: <span className={storyBlockClassName}>Centered</span>,
  },
};

export const ScreenHeight: StoryTypes = {
  args: {
    minHeight: 'screen',
    children: <span className={storyAccentBlockClassName}>100dvh</span>,
  },
};

export const Inline: StoryTypes = {
  args: {
    inline: true,
    children: <span className={storyBlockClassName}>Inline center</span>,
  },
};
