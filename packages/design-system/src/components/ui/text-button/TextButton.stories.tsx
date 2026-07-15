import type { Meta, StoryObj } from '@storybook/react-vite';

import { TextButton } from './TextButton';

const stateMatrixStyle = {
  display: 'flex',
  gap: 12,
  alignItems: 'center',
} as const;

const meta = {
  title: 'Design System/UI/TextButton',
  component: TextButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['default', 'negative'],
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    children: 'Button',
  },
} satisfies Meta<typeof TextButton>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {
  args: {
    tone: 'default',
  },
};

export const Negative: StoryTypes = {
  args: {
    tone: 'negative',
  },
};

export const Disabled: StoryTypes = {
  args: {
    disabled: true,
  },
};

export const Variants: StoryTypes = {
  render: () => (
    <div style={stateMatrixStyle}>
      <TextButton>Button</TextButton>
      <TextButton tone='negative'>Button</TextButton>
      <TextButton disabled>Button</TextButton>
      <TextButton tone='negative' disabled>
        Button
      </TextButton>
    </div>
  ),
};
