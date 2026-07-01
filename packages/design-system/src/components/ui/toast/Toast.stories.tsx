import type { Meta, StoryObj } from '@storybook/react-vite';

import { Toast } from './Toast';

const meta = {
  title: 'Design System/UI/Toast',
  component: Toast,
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
    status: {
      control: 'select',
      options: ['completed', 'error'],
    },
  },
  args: {
    children: '링크가 복사되었어요',
    status: 'completed',
  },
} satisfies Meta<typeof Toast>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Completed: StoryTypes = {
  args: {
    status: 'completed',
  },
};

export const Error: StoryTypes = {
  args: {
    status: 'error',
  },
};

export const WithoutIcon: StoryTypes = {
  args: {
    icon: null,
  },
};

export const LongMessage: StoryTypes = {
  args: {
    children: '상품 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.',
    status: 'error',
  },
};

export const StatusMatrix: StoryTypes = {
  render: () => {
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <Toast status='completed'>링크가 복사되었어요</Toast>
        <Toast status='error'>링크가 복사되지 않았어요</Toast>
      </div>
    );
  },
};
