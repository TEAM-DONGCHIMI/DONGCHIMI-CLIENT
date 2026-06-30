import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  storyBlockClassName,
  storyPanelClassName,
  storySurfaceClassName,
} from '../layout-story.css';
import { Box } from './Box';

const meta = {
  title: 'Design System/Layout/Box',
  component: Box,
  tags: ['autodocs'],
} satisfies Meta<typeof Box>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {
  args: {
    children: <span className={storyBlockClassName}>Box</span>,
  },
};

export const SemanticElement: StoryTypes = {
  args: {
    as: 'section',
    className: storyPanelClassName,
    children: <span className={storyBlockClassName}>section</span>,
  },
};

export const InlineBlock: StoryTypes = {
  render: () => (
    <div className={storySurfaceClassName}>
      Text before{' '}
      <Box display='inlineBlock'>
        <span className={storyBlockClassName}>inline block</span>
      </Box>{' '}
      text after
    </div>
  ),
};
