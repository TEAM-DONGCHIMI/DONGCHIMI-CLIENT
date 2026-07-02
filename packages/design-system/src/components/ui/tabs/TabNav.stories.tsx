import type { Meta, StoryObj } from '@storybook/react-vite';

import { TabNav } from './TabNav';

const meta = {
  title: 'Design System/UI/TabNav',
  component: TabNav,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TabNav>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const QueryString: StoryTypes = {
  render: () => {
    return (
      <TabNav aria-label='할인 유형 링크'>
        <TabNav.List>
          <TabNav.Item href='?discountType=today' selected>
            오늘의 특가
          </TabNav.Item>
          <TabNav.Item href='?discountType=period'>기간 할인</TabNav.Item>
        </TabNav.List>
      </TabNav>
    );
  },
};

export const ActiveRight: StoryTypes = {
  render: () => {
    return (
      <TabNav aria-label='할인 유형 링크'>
        <TabNav.List>
          <TabNav.Item href='?discountType=today'>오늘의 특가</TabNav.Item>
          <TabNav.Item href='?discountType=period' selected>
            기간 할인
          </TabNav.Item>
        </TabNav.List>
      </TabNav>
    );
  },
};

export const Disabled: StoryTypes = {
  render: () => {
    return (
      <TabNav aria-label='할인 유형 링크'>
        <TabNav.List>
          <TabNav.Item href='?discountType=today' selected>
            오늘의 특가
          </TabNav.Item>
          <TabNav.Item disabled href='?discountType=period'>
            기간 할인
          </TabNav.Item>
        </TabNav.List>
      </TabNav>
    );
  },
};
