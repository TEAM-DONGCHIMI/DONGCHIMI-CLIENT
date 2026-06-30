import type { Meta, StoryObj } from '@storybook/react-vite';

import { storyCanvasClassName, storyPanelClassName } from '../layout-story.css';
import { List } from './List';

const meta = {
  title: 'Design System/Layout/List',
  component: List,
  tags: ['autodocs'],
} satisfies Meta<typeof List>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {
  args: {
    'aria-label': 'Plain list',
    className: storyCanvasClassName,
    children: (
      <>
        <List.Item>First list item</List.Item>
        <List.Item>Second list item</List.Item>
        <List.Item>Third list item</List.Item>
      </>
    ),
  },
};

export const Ordered: StoryTypes = {
  args: {
    'aria-label': 'Ordered list',
    as: 'ol',
    className: storyPanelClassName,
    marker: 'decimal',
    children: (
      <>
        <List.Item>Prepare layout primitive spec</List.Item>
        <List.Item>Implement public API</List.Item>
        <List.Item>Verify semantic list rendering</List.Item>
      </>
    ),
  },
};

export const LongContent: StoryTypes = {
  args: {
    'aria-label': 'Long content list',
    className: storyPanelClassName,
    marker: 'disc',
    children: (
      <>
        <List.Item>
          This item contains a long sentence that should wrap inside the list container without
          forcing horizontal overflow.
        </List.Item>
        <List.Item>Short item</List.Item>
      </>
    ),
  },
};
