import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { IcChevronRight } from '@dongchimi/design-system/icons';

import { MobileHeader } from './MobileHeader';

const MobileHeaderPreview = ({ children }: { children: ReactNode }) => {
  return <div style={{ width: 390, border: '1px solid #e5e5e5' }}>{children}</div>;
};

const meta = {
  title: 'Client/Shared/MobileHeader',
  component: MobileHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
    },
  },
} satisfies Meta<typeof MobileHeader>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const LogoOnly: StoryTypes = {
  render: () => (
    <MobileHeaderPreview>
      <MobileHeader aria-label='홈 헤더'>
        <MobileHeader.Logo>
          <span>동치미</span>
        </MobileHeader.Logo>
      </MobileHeader>
    </MobileHeaderPreview>
  ),
};

export const WithBackButtonAndTitle: StoryTypes = {
  render: () => (
    <MobileHeaderPreview>
      <MobileHeader>
        <MobileHeader.BackButton aria-label='이전 화면으로 이동' icon={<IcChevronRight />} />
        <MobileHeader.Title>할인 품목</MobileHeader.Title>
      </MobileHeader>
    </MobileHeaderPreview>
  ),
};

export const LongTitle: StoryTypes = {
  render: () => (
    <MobileHeaderPreview>
      <MobileHeader>
        <MobileHeader.BackButton aria-label='이전 화면으로 이동' icon={<IcChevronRight />} />
        <MobileHeader.Title>아주 긴 마트 전단 상품 목록 제목입니다</MobileHeader.Title>
      </MobileHeader>
    </MobileHeaderPreview>
  ),
};
