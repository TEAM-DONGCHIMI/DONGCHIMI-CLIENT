import type { Meta, StoryObj } from '@storybook/react-vite';

import { NumButton } from './NumButton';

const stateMatrixStyle = {
  display: 'flex',
  gap: 12,
} as const;

const meta = {
  title: 'Design System/UI/NumButton',
  component: NumButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    selected: {
      control: 'boolean',
    },
  },
  args: {
    children: 2,
  },
} satisfies Meta<typeof NumButton>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {
  args: {
    selected: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default 상태입니다. 배경은 명시하지 않고 숫자 텍스트만 neutral 90으로 표시합니다.',
      },
    },
  },
};

export const Selected: StoryTypes = {
  args: {
    selected: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Selected 상태입니다. neutral 30 배경을 사용하고 hover에서도 selected 배경을 유지합니다.',
      },
    },
  },
};

export const StateMatrix: StoryTypes = {
  parameters: {
    docs: {
      description: {
        story:
          'Figma에서 정의된 default, hover, selected 상태 중 default와 selected를 나란히 확인합니다. hover는 브라우저 hover로 확인합니다.',
      },
    },
  },
  render: () => {
    return (
      <div style={stateMatrixStyle}>
        <NumButton>1</NumButton>
        <NumButton>2</NumButton>
        <NumButton selected>3</NumButton>
        <NumButton>4</NumButton>
      </div>
    );
  },
};
