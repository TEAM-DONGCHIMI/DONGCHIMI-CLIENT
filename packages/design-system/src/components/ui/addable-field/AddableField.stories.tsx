import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { fn, userEvent, within } from 'storybook/test';

import { IcChevronRight } from '../../../icons';
import { AddableField, type AddableFieldProps } from './AddableField';

const handleTrailingAction = fn();

const DemoIcon = () => <IcChevronRight />;

type AddableFieldStoryProps = Omit<
  AddableFieldProps,
  'aria-label' | 'aria-labelledby' | 'label'
> & {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  label?: ReactNode;
};

const StoryAddableField = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  label,
  ...props
}: AddableFieldStoryProps) => {
  if (label !== undefined) {
    return <AddableField {...props} label={label} />;
  }

  if (ariaLabelledBy !== undefined) {
    return <AddableField {...props} aria-labelledby={ariaLabelledBy} />;
  }

  return <AddableField {...props} aria-label={ariaLabel ?? '값 추가 필드'} />;
};

const meta = {
  title: 'Design System/UI/AddableField',
  component: AddableField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    errorIcon: {
      control: false,
    },
    leadingIcon: {
      control: false,
    },
    onTrailingAction: {
      control: false,
    },
    status: {
      control: 'select',
      options: ['default', 'error'],
    },
    trailingIcon: {
      control: false,
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'search', 'tel', 'url'],
    },
  },
  args: {
    label: '주제',
    leadingIcon: <DemoIcon />,
    onTrailingAction: handleTrailingAction,
    placeholder: '텍스트를 입력하세요',
    status: 'default',
    trailingActionLabel: '값 추가',
    trailingIcon: <DemoIcon />,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 322 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AddableField>;

export default meta;
type StoryTypes = StoryObj<AddableFieldStoryProps>;

export const DefaultEmpty: StoryTypes = {};

export const DefaultFilled: StoryTypes = {
  args: {
    defaultValue: '값',
  },
};

export const Hover: StoryTypes = {
  play: async ({ canvasElement }) => {
    await userEvent.hover(within(canvasElement).getByRole('textbox', { name: '주제' }));
  },
};

export const Focus: StoryTypes = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('textbox', { name: '주제' }));
  },
};

export const Required: StoryTypes = {
  args: {
    required: true,
  },
};

export const ErrorEmpty: StoryTypes = {
  args: {
    errorIcon: <DemoIcon />,
    errorMessage: '에러메시지를 나타냅니다',
    status: 'error',
  },
};

export const ErrorFilled: StoryTypes = {
  args: {
    defaultValue: '값',
    errorIcon: <DemoIcon />,
    errorMessage: '에러메시지를 나타냅니다',
    status: 'error',
  },
};

export const WithoutLabel: StoryTypes = {
  render: (args) => <StoryAddableField {...args} aria-label='주제' label={undefined} />,
};

export const NarrowWidth: StoryTypes = {
  decorators: [
    (Story) => (
      <div style={{ width: 220 }}>
        <Story />
      </div>
    ),
  ],
};

export const VariantMatrix: StoryTypes = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 32, width: 322 }}>
      <StoryAddableField {...args} />
      <StoryAddableField {...args} defaultValue='값' />
      <StoryAddableField
        {...args}
        errorIcon={<DemoIcon />}
        errorMessage='에러메시지를 나타냅니다'
        status='error'
      />
      <StoryAddableField
        {...args}
        defaultValue='값'
        errorIcon={<DemoIcon />}
        errorMessage='에러메시지를 나타냅니다'
        status='error'
      />
    </div>
  ),
};
