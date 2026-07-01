import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { fn, userEvent, within } from 'storybook/test';

import { IcChevronRight } from '../../../icons';
import { TextInput, type TextInputProps } from './TextInput';

const handleTrailingAction = fn();

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
    trailingIcon: {
      control: false,
    },
    trailingAction: {
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

export const DefaultEmpty: StoryTypes = {};

export const DefaultFilled: StoryTypes = {
  args: {
    defaultValue: '값',
  },
};

export const HoverEmpty: StoryTypes = {
  play: async ({ canvasElement }) => {
    await userEvent.hover(within(canvasElement).getByRole('textbox', { name: '주제' }));
  },
};

export const HoverFilled: StoryTypes = {
  args: {
    defaultValue: '값',
  },
  play: async ({ canvasElement }) => {
    await userEvent.hover(within(canvasElement).getByRole('textbox', { name: '주제' }));
  },
};

export const FocusEmpty: StoryTypes = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('textbox', { name: '주제' }));
  },
};

export const FocusFilled: StoryTypes = {
  args: {
    defaultValue: '값',
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('textbox', { name: '주제' }));
  },
};

export const ErrorEmpty: StoryTypes = {
  args: {
    errorMessage: '에러메시지를 나타냅니다',
    helperText: undefined,
    status: 'error',
  },
};

export const ErrorFilled: StoryTypes = {
  args: {
    defaultValue: '값',
    errorMessage: '에러메시지를 나타냅니다',
    helperText: undefined,
    status: 'error',
  },
};

export const ErrorFocused: StoryTypes = {
  args: {
    defaultValue: '값',
    errorMessage: '에러메시지를 나타냅니다',
    helperText: undefined,
    status: 'error',
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('textbox', { name: '주제' }));
  },
};

export const SuccessFilled: StoryTypes = {
  args: {
    defaultValue: '값',
    status: 'success',
  },
};

export const Disabled: StoryTypes = {
  args: {
    defaultValue: '값',
    disabled: true,
  },
};

export const ReadOnly: StoryTypes = {
  args: {
    defaultValue: '값',
    readOnly: true,
  },
};

export const Required: StoryTypes = {
  args: {
    required: true,
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
    type: 'password',
    trailingAction: (
      <button
        aria-label='비밀번호 보기'
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
    ),
  },
};

export const LayoutCombinations: StoryTypes = {
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

export const WithoutVisibleLabel: StoryTypes = {
  render: () => (
    <TextInput
      aria-label='주제'
      helperText='화면에 보이는 제목 없이 접근 가능한 이름만 제공한 상태입니다.'
      placeholder='텍스트를 입력하세요'
    />
  ),
};

export const ErrorMessagePriority: StoryTypes = {
  args: {
    errorMessage: '에러 상태에서는 이 문구를 보여줍니다.',
    helperText: '이 안내 문구는 에러 상태에서 숨겨집니다.',
    status: 'error',
  },
};

export const ConstrainedWidth: StoryTypes = {
  render: () => (
    <div style={{ width: 240 }}>
      <TextInput
        label='길이가 긴 제목은 주어진 너비 안에서 줄바꿈됩니다.'
        defaultValue='길이가 긴 입력값은 한 줄 입력 동작을 유지합니다.'
        helperText='길이가 긴 안내 문구는 입력창의 너비를 벗어나지 않고 줄바꿈됩니다.'
      />
    </div>
  ),
};
