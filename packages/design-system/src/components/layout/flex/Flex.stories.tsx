import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  storyAccentBlockClassName,
  storyBlockClassName,
  storyNarrowPanelClassName,
  storyPanelClassName,
} from '../layout-story.css';
import { Flex } from './Flex';

const meta = {
  title: 'Design System/Layout/Flex',
  component: Flex,
  tags: ['autodocs'],
} satisfies Meta<typeof Flex>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {
  args: {
    align: 'center',
    gap: 'md',
    children: (
      <>
        <span className={storyBlockClassName}>A</span>
        <span className={storyAccentBlockClassName}>B</span>
        <span className={storyBlockClassName}>C</span>
      </>
    ),
  },
};

export const Column: StoryTypes = {
  args: {
    direction: 'column',
    gap: 'sm',
    children: (
      <>
        <span className={storyBlockClassName}>One</span>
        <span className={storyAccentBlockClassName}>Two</span>
        <span className={storyBlockClassName}>Three</span>
      </>
    ),
  },
};

export const SpaceBetween: StoryTypes = {
  args: {
    align: 'center',
    className: storyPanelClassName,
    justify: 'between',
    children: (
      <>
        <span className={storyBlockClassName}>Start</span>
        <span className={storyAccentBlockClassName}>End</span>
      </>
    ),
  },
};

export const Wrapped: StoryTypes = {
  args: {
    className: storyNarrowPanelClassName,
    gap: 'sm',
    wrap: 'wrap',
    children: (
      <>
        <span className={storyBlockClassName}>Alpha</span>
        <span className={storyAccentBlockClassName}>Beta</span>
        <span className={storyBlockClassName}>Gamma</span>
        <span className={storyAccentBlockClassName}>Delta</span>
      </>
    ),
  },
};
