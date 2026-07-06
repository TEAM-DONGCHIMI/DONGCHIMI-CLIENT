import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Dropdown } from './Dropdown';

const meta = {
  title: 'Design System/UI/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: <Dropdown.Item>항목</Dropdown.Item>,
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {};

export const Page: StoryTypes = {
  render: () => (
    <Dropdown role='group' aria-label='정렬 기준'>
      <Dropdown.Item selected>최신순</Dropdown.Item>
      <Dropdown.Item>인기순</Dropdown.Item>
      <Dropdown.Item>가격 낮은순</Dropdown.Item>
      <Dropdown.Item>가격 높은순</Dropdown.Item>
    </Dropdown>
  ),
};

export const Category: StoryTypes = {
  render: () => (
    <Dropdown role='group' aria-label='카테고리'>
      <Dropdown.Item color='primary' selected>
        전체
      </Dropdown.Item>
      <Dropdown.Item color='primary'>카테고리 1</Dropdown.Item>
      <Dropdown.Item color='primary'>카테고리 2</Dropdown.Item>
      <Dropdown.Item color='primary'>카테고리 3</Dropdown.Item>
    </Dropdown>
  ),
};

export const Checkbox: StoryTypes = {
  render: () => {
    const categories = ['전체', '카테고리 1', '카테고리 2', '카테고리 3'];
    const [checked, setChecked] = useState<string[]>(['전체']);
    const toggle = (item: string) =>
      setChecked((prev) =>
        prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item],
      );

    return (
      <Dropdown role='group' aria-label='카테고리 필터'>
        {categories.map((item) => (
          <Dropdown.Item
            key={item}
            checkbox
            selected={checked.includes(item)}
            onClick={() => toggle(item)}
          >
            {item}
          </Dropdown.Item>
        ))}
      </Dropdown>
    );
  },
};

export const LongText: StoryTypes = {
  render: () => (
    <Dropdown>
      <Dropdown.Item selected>아주 긴 텍스트가 들어가면 말줄임표로 처리됩니다</Dropdown.Item>
      <Dropdown.Item>짧은 항목</Dropdown.Item>
    </Dropdown>
  ),
};
