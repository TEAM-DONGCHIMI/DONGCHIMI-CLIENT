import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { IcChevronRight } from '../../../icons';
import { IconButton } from './IconButton';

const meta = {
  title: 'Design System/UI/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'assistive', 'negative'],
    },
    icon: {
      control: false,
    },
    size: {
      control: 'select',
      options: ['large'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'outlined'],
    },
  },
  args: {
    'aria-label': '다음',
    icon: <IcChevronRight />,
    onClick: fn(),
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const PrimarySolid: StoryTypes = {
  args: {
    color: 'primary',
    variant: 'solid',
  },
};

export const AssistiveOutlined: StoryTypes = {
  args: {
    color: 'assistive',
    variant: 'outlined',
  },
};

export const NegativeOutlined: StoryTypes = {
  args: {
    'aria-label': '삭제',
    color: 'negative',
    variant: 'outlined',
  },
};

export const Disabled: StoryTypes = {
  args: {
    color: 'assistive',
    disabled: true,
    variant: 'outlined',
  },
};

export const VariantMatrix: StoryTypes = {
  render: () => {
    return (
      <div style={{ display: 'flex', gap: 16 }}>
        <IconButton aria-label='primary solid' color='primary' icon={<IcChevronRight />} />
        <IconButton
          aria-label='assistive outlined'
          color='assistive'
          icon={<IcChevronRight />}
          variant='outlined'
        />
        <IconButton
          aria-label='negative outlined'
          color='negative'
          icon={<IcChevronRight />}
          variant='outlined'
        />
      </div>
    );
  },
};
