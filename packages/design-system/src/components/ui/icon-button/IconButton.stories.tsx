import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { IcChevronRight } from '../../../icons';
import { IconButton } from './IconButton';

const iconButtonColors = ['primary', 'assistive', 'negative'] as const;
const iconButtonVariants = ['solid', 'outlined', 'ghost'] as const;

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
      options: ['solid', 'outlined', 'ghost'],
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

export const AssistiveGhost: StoryTypes = {
  args: {
    'aria-label': '닫기',
    color: 'assistive',
    variant: 'ghost',
  },
};

export const AriaLabelledBy: StoryTypes = {
  render: () => {
    const labelId = 'icon-button-labelled-by-story';

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span id={labelId}>다음 단계</span>
        <IconButton aria-labelledby={labelId} icon={<IcChevronRight />} />
      </div>
    );
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, max-content)',
          gap: 16,
        }}
      >
        {iconButtonVariants.flatMap((variant) =>
          iconButtonColors.map((color) => (
            <IconButton
              key={`${color}-${variant}`}
              aria-label={`${color} ${variant}`}
              color={color}
              icon={<IcChevronRight />}
              variant={variant}
            />
          )),
        )}
      </div>
    );
  },
};
