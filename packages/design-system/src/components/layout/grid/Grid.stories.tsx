import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  storyAccentBlockClassName,
  storyBlockClassName,
  storyCanvasClassName,
} from '../layout-story.css';
import { Grid } from './Grid';

const meta = {
  title: 'Design System/Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
} satisfies Meta<typeof Grid>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {
  args: {
    className: storyCanvasClassName,
    columns: 3,
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

export const AutoFit: StoryTypes = {
  args: {
    autoFit: 'md',
    className: storyCanvasClassName,
    gap: 'md',
    children: (
      <>
        <span className={storyBlockClassName}>Card 1</span>
        <span className={storyAccentBlockClassName}>Card 2</span>
        <span className={storyBlockClassName}>Card 3</span>
        <span className={storyAccentBlockClassName}>Card 4</span>
      </>
    ),
  },
};

export const JustifiedItems: StoryTypes = {
  args: {
    className: storyCanvasClassName,
    columns: 3,
    gap: 'md',
    justify: 'center',
    children: (
      <>
        <span className={storyBlockClassName}>One</span>
        <span className={storyAccentBlockClassName}>Two</span>
        <span className={storyBlockClassName}>Three</span>
      </>
    ),
  },
};
