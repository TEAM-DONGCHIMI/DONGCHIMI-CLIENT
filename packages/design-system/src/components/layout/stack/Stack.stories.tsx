import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  storyAccentBlockClassName,
  storyBlockClassName,
  storyNarrowPanelClassName,
} from '../layout-story.css';
import { Stack } from './Stack';

const meta = {
  title: 'Design System/Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
} satisfies Meta<typeof Stack>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {
  args: {
    gap: 'md',
    children: (
      <>
        <span className={storyBlockClassName}>Top</span>
        <span className={storyAccentBlockClassName}>Middle</span>
        <span className={storyBlockClassName}>Bottom</span>
      </>
    ),
  },
};

export const Horizontal: StoryTypes = {
  args: {
    align: 'center',
    direction: 'horizontal',
    gap: 'sm',
    children: (
      <>
        <span className={storyBlockClassName}>Left</span>
        <span className={storyAccentBlockClassName}>Right</span>
      </>
    ),
  },
};

export const Wrapped: StoryTypes = {
  args: {
    className: storyNarrowPanelClassName,
    direction: 'horizontal',
    gap: 'sm',
    wrap: true,
    children: (
      <>
        <span className={storyBlockClassName}>One</span>
        <span className={storyAccentBlockClassName}>Two</span>
        <span className={storyBlockClassName}>Three</span>
      </>
    ),
  },
};
