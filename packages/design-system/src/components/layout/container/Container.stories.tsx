import type { Meta, StoryObj } from '@storybook/react-vite';

import { storyBlockClassName, storySurfaceClassName } from '../layout-story.css';
import { Container } from './Container';

const meta = {
  title: 'Design System/Layout/Container',
  component: Container,
  tags: ['autodocs'],
} satisfies Meta<typeof Container>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {
  args: {
    children: (
      <div className={storySurfaceClassName}>
        <span className={storyBlockClassName}>Default container</span>
      </div>
    ),
  },
};

export const Narrow: StoryTypes = {
  args: {
    size: 'sm',
    children: (
      <div className={storySurfaceClassName}>
        <span className={storyBlockClassName}>Narrow</span>
      </div>
    ),
  },
};

export const NoGutter: StoryTypes = {
  args: {
    gutter: 'none',
    size: 'sm',
    children: (
      <div className={storySurfaceClassName}>
        <span className={storyBlockClassName}>No gutter</span>
      </div>
    ),
  },
};
