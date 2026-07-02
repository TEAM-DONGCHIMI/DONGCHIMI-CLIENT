import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { ListButton } from './ListButton';
import { IcChevronRight } from '../../../icons';

const stateMatrixStyle = {
  display: 'grid',
  gap: 12,
  justifyItems: 'start',
} as const;

const DemoIcon = () => <IcChevronRight />;

const meta = {
  title: 'Design System/UI/ListButton',
  component: ListButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['assistive', 'primary'],
    },
    selected: {
      control: 'boolean',
    },
    leftIcon: {
      control: false,
    },
  },
  args: {
    children: '기본',
  },
} satisfies Meta<typeof ListButton>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {
  args: {
    selected: false,
  },
};

export const AssistiveSelected: StoryTypes = {
  args: {
    color: 'assistive',
    selected: true,
  },
};

export const PrimarySelected: StoryTypes = {
  args: {
    color: 'primary',
    selected: true,
  },
};

export const WithLeftIcon: StoryTypes = {
  args: {
    children: '전체',
    leftIcon: <DemoIcon />,
    selected: true,
  },
};

export const ToggleWithLeftIcon: StoryTypes = {
  render: () => {
    const [selected, setSelected] = useState(false);

    return (
      <ListButton
        leftIcon={<DemoIcon />}
        selected={selected}
        onClick={() => setSelected((prev) => !prev)}
      >
        전체
      </ListButton>
    );
  },
};

export const StateMatrix: StoryTypes = {
  render: () => {
    const [selectedCategory, setSelectedCategory] = useState('전체');

    return (
      <div style={stateMatrixStyle}>
        <ListButton>기본</ListButton>
        <ListButton selected>기본</ListButton>
        <ListButton color='primary' selected>
          기본
        </ListButton>
        {['전체', '카테고리 1', '카테고리 2'].map((category) => (
          <ListButton
            key={category}
            leftIcon={<DemoIcon />}
            selected={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </ListButton>
        ))}
      </div>
    );
  },
};
