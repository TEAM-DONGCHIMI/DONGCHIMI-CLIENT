import type { Meta, StoryObj } from '@storybook/react-vite';

import { ListButton } from '../list-button';
import { Dropdown } from './Dropdown';

const meta = {
  title: 'Design System/UI/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: <ListButton>항목</ListButton>,
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Page: StoryTypes = {
  render: () => (
    <Dropdown>
      <ListButton selected>최신순</ListButton>
      <ListButton>인기순</ListButton>
      <ListButton>가격 낮은순</ListButton>
      <ListButton>가격 높은순</ListButton>
    </Dropdown>
  ),
};

export const Category: StoryTypes = {
  render: () => (
    <Dropdown>
      <ListButton color='primary' selected>
        전체
      </ListButton>
      <ListButton color='primary'>카테고리 1</ListButton>
      <ListButton color='primary'>카테고리 2</ListButton>
      <ListButton color='primary'>카테고리 3</ListButton>
    </Dropdown>
  ),
};

export const LongText: StoryTypes = {
  render: () => (
    <Dropdown>
      <ListButton selected>아주 긴 텍스트가 들어가면 말줄임표로 처리됩니다</ListButton>
      <ListButton>짧은 항목</ListButton>
    </Dropdown>
  ),
};
