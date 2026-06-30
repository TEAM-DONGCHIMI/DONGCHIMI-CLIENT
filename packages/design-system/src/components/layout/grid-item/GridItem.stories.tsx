import type { Meta, StoryObj } from '@storybook/react-vite';

import { Grid } from '../grid';
import {
  storyAccentBlockClassName,
  storyBlockClassName,
  storyCanvasClassName,
} from '../layout-story.css';
import { GridItem } from './GridItem';

const meta = {
  title: 'Design System/Layout/GridItem',
  component: GridItem,
  tags: ['autodocs'],
} satisfies Meta<typeof GridItem>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const ColumnSpan: StoryTypes = {
  args: {
    colSpan: 2,
    children: <span className={storyAccentBlockClassName}>Spans 2 columns</span>,
  },
  render: (args) => (
    <Grid className={storyCanvasClassName} columns={4} gap='md'>
      <GridItem {...args} />
      <span className={storyBlockClassName}>B</span>
      <span className={storyBlockClassName}>C</span>
    </Grid>
  ),
};

export const FullWidth: StoryTypes = {
  args: {
    colSpan: 'full',
    children: <span className={storyAccentBlockClassName}>Full width item</span>,
  },
  render: (args) => (
    <Grid className={storyCanvasClassName} columns={4} gap='md'>
      <span className={storyBlockClassName}>A</span>
      <GridItem {...args} />
      <span className={storyBlockClassName}>B</span>
      <span className={storyBlockClassName}>C</span>
    </Grid>
  ),
};

export const ColumnStart: StoryTypes = {
  args: {
    colStart: 2,
    colSpan: 2,
    children: <span className={storyAccentBlockClassName}>Starts at column 2</span>,
  },
  render: (args) => (
    <Grid className={storyCanvasClassName} columns={4} gap='md'>
      <GridItem {...args} />
      <span className={storyBlockClassName}>Next</span>
    </Grid>
  ),
};
