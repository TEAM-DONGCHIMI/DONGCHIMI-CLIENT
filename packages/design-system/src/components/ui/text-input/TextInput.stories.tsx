import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { expect, fn, userEvent, within } from 'storybook/test';

import { IcChevronRight } from '../../../icons';
import { TextInput, type TextInputProps } from './TextInput';

const handleTrailingAction = fn();

const renderPasswordVisibilityAction = ({ disabled }: { disabled: boolean }) => (
  <button
    aria-label='비밀번호 보기'
    disabled={disabled}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 24,
      height: 24,
      padding: 0,
      border: 0,
      background: 'transparent',
      cursor: 'pointer',
    }}
    onClick={handleTrailingAction}
    type='button'
  >
    <IcChevronRight />
  </button>
);

type TextInputStoryProps = Omit<TextInputProps, 'aria-label' | 'aria-labelledby' | 'label'> & {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  label?: ReactNode;
};

const meta = {
  title: 'Design System/UI/TextInput',
  component: TextInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['default', 'error', 'success'],
    },
    trailingAction: {
      control: false,
    },
    trailingIcon: {
      control: false,
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'tel', 'url'],
    },
  },
  args: {
    helperText: '텍스트를 입력하세요',
    label: '주제',
    placeholder: '텍스트를 입력하세요',
    status: 'default',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextInput>;

export default meta;
type StoryTypes = StoryObj<TextInputStoryProps>;

export const Default: StoryTypes = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <TextInput label='빈 입력' placeholder='텍스트를 입력하세요' />
      <TextInput label='값이 있는 입력' defaultValue='값' placeholder='텍스트를 입력하세요' />
    </div>
  ),
};

export const Hover: StoryTypes = {
  args: {
    defaultValue: '값',
  },
  play: async ({ canvasElement }) => {
    await userEvent.hover(within(canvasElement).getByRole('textbox', { name: '주제' }));
  },
};

export const Focus: StoryTypes = {
  args: {
    defaultValue: '값',
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('textbox', { name: '주제' }));
  },
};

export const Error: StoryTypes = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <TextInput
        label='빈 입력'
        errorMessage='에러메시지를 나타냅니다'
        placeholder='텍스트를 입력하세요'
        status='error'
      />
      <TextInput
        label='값이 있는 입력'
        defaultValue='값'
        errorMessage='에러메시지를 나타냅니다'
        helperText='에러 상태에서는 이 문구가 숨겨집니다.'
        status='error'
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('textbox', { name: '값이 있는 입력' }));
  },
};

export const Success: StoryTypes = {
  args: {
    defaultValue: '값',
    status: 'success',
  },
};

export const Disabled: StoryTypes = {
  args: {
    defaultValue: '값',
    disabled: true,
    trailingAction: renderPasswordVisibilityAction,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('textbox', { name: '주제' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: '비밀번호 보기' })).toBeDisabled();
  },
};

export const ReadOnly: StoryTypes = {
  args: {
    defaultValue: '값',
    readOnly: true,
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('textbox', { name: '주제' })).toHaveAttribute(
      'readonly',
    );
  },
};

export const TrailingIcon: StoryTypes = {
  args: {
    defaultValue: '값',
    trailingIcon: <IcChevronRight />,
  },
};

export const TrailingAction: StoryTypes = {
  args: {
    defaultValue: '비밀번호',
    trailingAction: renderPasswordVisibilityAction,
    type: 'password',
  },
};

export const Required: StoryTypes = {
  args: {
    required: true,
  },
};

export const AriaLabel: StoryTypes = {
  render: () => (
    <TextInput
      aria-label='화면에 제목이 없는 입력'
      helperText='화면에 보이는 제목 없이 접근 가능한 이름만 제공한 상태입니다.'
      placeholder='텍스트를 입력하세요'
    />
  ),
};

export const VariantMatrix: StoryTypes = {
  render: () => (
    <div style={{ display: 'grid', gap: 32 }}>
      <TextInput label='주제' helperText='텍스트를 입력하세요' placeholder='텍스트를 입력하세요' />
      <TextInput label='주제' placeholder='텍스트를 입력하세요' />
      <TextInput
        aria-label='주제'
        helperText='텍스트를 입력하세요'
        placeholder='텍스트를 입력하세요'
      />
      <TextInput aria-label='주제' placeholder='텍스트를 입력하세요' />
    </div>
  ),
};
