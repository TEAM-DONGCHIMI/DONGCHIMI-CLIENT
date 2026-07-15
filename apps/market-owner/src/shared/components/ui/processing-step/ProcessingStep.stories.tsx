import type { Meta, StoryObj } from '@storybook/react-vite';

import { ProcessingStep, type ProcessingStepProps } from './ProcessingStep';

const defaultSteps = [
  {
    id: 'file-upload',
    title: '파일 업로드 완료',
    status: 'completed',
  },
  {
    id: 'product-name',
    title: '상품명 확인',
    status: 'processing',
  },
  {
    id: 'price',
    title: '가격 확인',
    status: 'pending',
  },
] satisfies ProcessingStepProps['steps'];

const pendingSteps = [
  {
    id: 'file-upload',
    title: '파일 업로드',
    status: 'processing',
  },
  {
    id: 'product-name',
    title: '상품명 확인',
    status: 'pending',
  },
  {
    id: 'price',
    title: '가격 확인',
    status: 'pending',
  },
] satisfies ProcessingStepProps['steps'];

const renderWithWidth = (args: ProcessingStepProps) => {
  return (
    <div style={{ width: 'min(calc(100vw - 3.2rem), 59.2rem)' }}>
      <ProcessingStep {...args} />
    </div>
  );
};

const customIconTexts = {
  completed: '완',
  processing: '중',
  pending: '대',
} satisfies Record<ProcessingStepProps['steps'][number]['status'], string>;

const meta = {
  title: 'Market Owner/Shared/UI/ProcessingStep',
  component: ProcessingStep,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    iconSlot: {
      control: false,
    },
    steps: {
      control: false,
    },
  },
  args: {
    steps: defaultSteps,
  },
} satisfies Meta<typeof ProcessingStep>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;
type ProcessingStepIconSlotStepTypes = Parameters<NonNullable<ProcessingStepProps['iconSlot']>>[0];

export const Default: StoryTypes = {
  render: renderWithWidth,
};

export const PendingFirst: StoryTypes = {
  args: {
    steps: pendingSteps,
  },
  render: renderWithWidth,
};

export const CustomIconSlot: StoryTypes = {
  args: {
    iconSlot: (step: ProcessingStepIconSlotStepTypes) => (
      <span
        aria-hidden='true'
        style={{
          alignItems: 'center',
          border: '2px solid currentColor',
          borderRadius: '999px',
          display: 'inline-flex',
          fontSize: '1.2rem',
          height: '2.8rem',
          justifyContent: 'center',
          width: '2.8rem',
        }}
      >
        {customIconTexts[step.status]}
      </span>
    ),
  },
  render: renderWithWidth,
};
