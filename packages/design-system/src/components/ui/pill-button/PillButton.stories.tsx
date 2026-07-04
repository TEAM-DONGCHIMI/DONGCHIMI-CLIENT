import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { IcChevronRight } from '../../../icons';
import { PillButton } from './PillButton';

const meta = {
  title: 'Design System/UI/PillButton',
  component: PillButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
    },
    icon: {
      control: false,
    },
    platform: {
      control: 'select',
      options: ['desktop', 'mobile'],
    },
    variant: {
      control: 'select',
      options: ['outlined-light', 'outlined', 'filled'],
    },
  },
  args: {
    children: '상품 등록 순',
    onClick: fn(),
    platform: 'desktop',
    variant: 'outlined-light',
  },
} satisfies Meta<typeof PillButton>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const DesktopOutlinedLight: StoryTypes = {
  args: {
    platform: 'desktop',
    variant: 'outlined-light',
  },
};

export const DesktopOutlined: StoryTypes = {
  args: {
    platform: 'desktop',
    variant: 'outlined',
  },
};

export const DesktopFilled: StoryTypes = {
  args: {
    platform: 'desktop',
    variant: 'filled',
  },
};

export const MobileOutlinedLight: StoryTypes = {
  args: {
    children: '상품',
    platform: 'mobile',
    variant: 'outlined-light',
  },
};

export const MobileFilled: StoryTypes = {
  args: {
    children: '상품',
    platform: 'mobile',
    variant: 'filled',
  },
};

export const WithIcon: StoryTypes = {
  args: {
    icon: <IcChevronRight />,
    platform: 'desktop',
    variant: 'outlined-light',
  },
};

export const Disabled: StoryTypes = {
  args: {
    disabled: true,
    platform: 'desktop',
    variant: 'outlined-light',
  },
};

export const VariantMatrix: StoryTypes = {
  render: () => {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'max-content max-content',
          alignItems: 'center',
          justifyItems: 'start',
          columnGap: 40,
          rowGap: 20,
        }}
      >
        <PillButton platform='desktop' variant='outlined-light'>
          상품 등록 순
        </PillButton>
        <PillButton platform='mobile' variant='outlined-light'>
          상품
        </PillButton>

        <PillButton platform='desktop' variant='outlined'>
          상품 등록 순
        </PillButton>
        <span />

        <PillButton platform='desktop' variant='filled'>
          상품 등록 순
        </PillButton>
        <PillButton platform='mobile' variant='filled'>
          상품
        </PillButton>
      </div>
    );
  },
};
