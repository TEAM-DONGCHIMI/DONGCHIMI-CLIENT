import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  storyChipClassName,
  storyNarrowPanelClassName,
  storyPanelClassName,
} from '../layout-story.css';
import { Inline } from './Inline';

const meta = {
  title: 'Design System/Layout/Inline',
  component: Inline,
  tags: ['autodocs'],
} satisfies Meta<typeof Inline>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {
  args: {
    children: (
      <>
        <span className={storyChipClassName}>전체</span>
        <span className={storyChipClassName}>신규</span>
        <span className={storyChipClassName}>인기</span>
      </>
    ),
  },
};

export const NoWrap: StoryTypes = {
  args: {
    className: storyNarrowPanelClassName,
    gap: 'sm',
    wrap: false,
    children: (
      <>
        <span className={storyChipClassName}>긴 라벨 항목</span>
        <span className={storyChipClassName}>줄바꿈 없음</span>
      </>
    ),
  },
};

export const Justified: StoryTypes = {
  args: {
    className: storyPanelClassName,
    justify: 'between',
    children: (
      <>
        <span className={storyChipClassName}>좌측</span>
        <span className={storyChipClassName}>우측</span>
      </>
    ),
  },
};
