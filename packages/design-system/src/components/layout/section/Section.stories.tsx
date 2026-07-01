import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  storyBlockClassName,
  storyPanelClassName,
  storySurfaceClassName,
} from '../layout-story.css';
import { Section } from './Section';

const meta = {
  title: 'Design System/Layout/Section',
  component: Section,
  tags: ['autodocs'],
} satisfies Meta<typeof Section>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {
  args: {
    'aria-labelledby': 'section-title',
    className: storySurfaceClassName,
    children: (
      <>
        <h2 id='section-title'>Section title</h2>
        <p>Section preserves native semantics and applies vertical spacing.</p>
      </>
    ),
  },
};

export const Compact: StoryTypes = {
  args: {
    className: storyPanelClassName,
    spacing: 'sm',
    children: <span className={storyBlockClassName}>Compact section spacing</span>,
  },
};

export const NoSpacing: StoryTypes = {
  args: {
    className: storyPanelClassName,
    spacing: 'none',
    children: <span className={storyBlockClassName}>Section without vertical spacing</span>,
  },
};

export const AsArticle: StoryTypes = {
  args: {
    as: 'article',
    className: storyPanelClassName,
    spacing: 'lg',
    children: <span className={storyBlockClassName}>Rendered as article</span>,
  },
};
