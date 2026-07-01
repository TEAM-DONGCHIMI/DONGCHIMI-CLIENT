import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { atomic, semantic } from '../../../tokens';
import { BottomSheet } from './BottomSheet';

const meta = {
  title: 'Design System/UI/BottomSheet',
  component: BottomSheet,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: null,
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

const triggerStyle = {
  padding: '1.2rem 1.6rem',
  border: 0,
  borderRadius: '1.2rem',
  backgroundColor: semantic.primary.normal,
  color: atomic.common[0],
  cursor: 'pointer',
  fontSize: '1.6rem',
  fontWeight: 600,
} as const;

const fieldStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  minHeight: '5.6rem',
  padding: '0 1.6rem',
  borderRadius: '1.6rem',
  backgroundColor: atomic.neutral[10],
  color: atomic.neutral[60],
  fontSize: '1.6rem',
} as const;

const actionButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1.6rem',
  minHeight: '5.6rem',
  border: 0,
  backgroundColor: 'transparent',
  color: atomic.neutral[80],
  cursor: 'pointer',
  fontSize: '1.8rem',
  fontWeight: 600,
  textAlign: 'left',
} as const;

const iconCircleStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '4.8rem',
  height: '4.8rem',
  border: `0.1rem solid ${atomic.neutral[40]}`,
  borderRadius: '999rem',
} as const;

const ShareContent = () => {
  return (
    <>
      <BottomSheet.Handle />
      <BottomSheet.Header>
        <BottomSheet.Title>콘텐츠 공유하기</BottomSheet.Title>
        <BottomSheet.Description>공유 링크와 액션은 사용처에서 조합합니다.</BottomSheet.Description>
      </BottomSheet.Header>
      <BottomSheet.Body>
        <div style={fieldStyle}>
          <span>dongchimi.kr/share</span>
          <span aria-hidden='true'>⧉</span>
        </div>
        <button style={actionButtonStyle} type='button'>
          <span aria-hidden='true' style={iconCircleStyle}>
            ⧉
          </span>
          링크 복사
        </button>
        <button style={actionButtonStyle} type='button'>
          <span aria-hidden='true' style={iconCircleStyle}>
            ↗
          </span>
          외부로 공유
        </button>
      </BottomSheet.Body>
      <BottomSheet.Footer>
        <BottomSheet.Close>닫기</BottomSheet.Close>
      </BottomSheet.Footer>
    </>
  );
};

const ControlledExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <BottomSheet open={open} onOpenChange={setOpen}>
      <BottomSheet.Trigger style={triggerStyle}>Controlled BottomSheet</BottomSheet.Trigger>
      <BottomSheet.Content>
        <ShareContent />
      </BottomSheet.Content>
    </BottomSheet>
  );
};

export const Default: StoryTypes = {
  render: () => {
    return (
      <BottomSheet>
        <BottomSheet.Trigger style={triggerStyle}>BottomSheet 열기</BottomSheet.Trigger>
        <BottomSheet.Content>
          <ShareContent />
        </BottomSheet.Content>
      </BottomSheet>
    );
  },
};

export const Controlled: StoryTypes = {
  render: () => {
    return <ControlledExample />;
  },
};

export const LongContent: StoryTypes = {
  render: () => {
    return (
      <BottomSheet>
        <BottomSheet.Trigger style={triggerStyle}>긴 콘텐츠 열기</BottomSheet.Trigger>
        <BottomSheet.Content>
          <BottomSheet.Handle />
          <BottomSheet.Header>
            <BottomSheet.Title>긴 콘텐츠</BottomSheet.Title>
            <BottomSheet.Description>
              본문 영역은 높이 제한 안에서 스크롤됩니다.
            </BottomSheet.Description>
          </BottomSheet.Header>
          <BottomSheet.Body>
            {Array.from({ length: 10 }, (_, index) => (
              <button key={index} style={actionButtonStyle} type='button'>
                <span aria-hidden='true' style={iconCircleStyle}>
                  {index + 1}
                </span>
                액션 {index + 1}
              </button>
            ))}
          </BottomSheet.Body>
          <BottomSheet.Footer>
            <BottomSheet.Close>닫기</BottomSheet.Close>
          </BottomSheet.Footer>
        </BottomSheet.Content>
      </BottomSheet>
    );
  },
};
