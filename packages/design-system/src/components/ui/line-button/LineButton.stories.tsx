import type { Meta, StoryObj } from '@storybook/react-vite';

import { LineButton } from './LineButton';

const meta = {
  title: 'Design System/UI/LineButton',
  component: LineButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'POS 에서 상품 파일 추출 방법 보기',
  },
} satisfies Meta<typeof LineButton>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {
  parameters: {
    docs: {
      description: {
        story:
          'Default 상태입니다. neutral 40 텍스트만 표시하고 밑줄은 없습니다. Figma의 action 상태(밑줄)는 hover/focus-visible CSS pseudo state로 지원하며 브라우저 hover 또는 키보드 focus로 확인합니다.',
      },
    },
  },
};

export const Disabled: StoryTypes = {
  args: {
    disabled: true,
  },
};
