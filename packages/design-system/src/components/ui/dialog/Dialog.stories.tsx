import { useState, type CSSProperties } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../button';
import { Dialog } from './Dialog';

const meta = {
  title: 'Design System/UI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
    },
    defaultOpen: {
      control: 'boolean',
    },
    onOpenChange: {
      control: false,
    },
    open: {
      control: false,
    },
  },
  args: {
    children: null,
    defaultOpen: false,
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

const fieldStyle = {
  display: 'grid',
  gap: '0.8rem',
  minHeight: '8rem',
  padding: '1.6rem',
  border: '0.1rem solid #e5e7eb',
  borderRadius: '0.8rem',
  backgroundColor: '#f9fafb',
  color: '#4b5563',
  fontSize: '1.4rem',
} satisfies CSSProperties;

const modalLayoutStyle = {
  display: 'grid',
  gridTemplateRows: 'auto minmax(0, 1fr) auto',
  maxHeight: 'inherit',
} satisfies CSSProperties;

const modalHeaderStyle = {
  display: 'grid',
  gap: '0.8rem',
  padding: '2.4rem 2.4rem 1.2rem',
} satisfies CSSProperties;

const modalTitleStyle = {
  margin: 0,
  color: '#111827',
  fontSize: '2rem',
  fontWeight: 700,
  lineHeight: 1.4,
} satisfies CSSProperties;

const modalDescriptionStyle = {
  margin: 0,
  color: '#6b7280',
  fontSize: '1.4rem',
  fontWeight: 500,
  lineHeight: 1.5,
} satisfies CSSProperties;

const modalBodyStyle = {
  display: 'grid',
  gap: '1.2rem',
  overflowY: 'auto',
  padding: '1.2rem 2.4rem',
} satisfies CSSProperties;

const modalFooterStyle = {
  display: 'flex',
  flexShrink: 0,
  justifyContent: 'flex-end',
  gap: '0.8rem',
  padding: '1.2rem 2.4rem 2.4rem',
} satisfies CSSProperties;

const mobileFooterStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  flexShrink: 0,
  gap: '0.8rem',
  padding: '1.2rem 2rem 2rem',
} satisfies CSSProperties;

const closeButtonStyle = {
  minWidth: '8rem',
  minHeight: '4rem',
  border: '0.1rem solid #d1d5db',
  borderRadius: '0.8rem',
  backgroundColor: '#ffffff',
  color: '#374151',
  cursor: 'pointer',
  fontSize: '1.4rem',
  fontWeight: 600,
} satisfies CSSProperties;

const mobileCloseButtonStyle = {
  ...closeButtonStyle,
  width: '100%',
  minWidth: 0,
  minHeight: '3.5rem',
} satisfies CSSProperties;

const mobileActionButtonStyle = {
  width: '100%',
  minWidth: 0,
  padding: '0 1.2rem',
} satisfies CSSProperties;

const triggerStyle = {
  width: 'auto',
  minWidth: '12rem',
  padding: '1.2rem 1.8rem',
} satisfies CSSProperties;

const defaultContentStyle = {
  width: '44rem',
} satisfies CSSProperties;

const largeContentStyle = {
  width: '64rem',
} satisfies CSSProperties;

const mobileContentStyle = {
  width: '31.2rem',
} satisfies CSSProperties;

const DialogContentExample = ({ style }: { style?: CSSProperties }) => {
  return (
    <Dialog.Content style={{ ...defaultContentStyle, ...style }}>
      <div style={modalLayoutStyle}>
        <div style={modalHeaderStyle}>
          <Dialog.Title style={modalTitleStyle}>판매 정보를 수정해주세요</Dialog.Title>
          <Dialog.Description style={modalDescriptionStyle}>
            Dialog는 overlay, focus, keyboard interaction만 공통으로 제공합니다.
          </Dialog.Description>
        </div>
        <div style={modalBodyStyle}>
          <div style={fieldStyle}>
            <strong>상품 정보</strong>
            <span>사용처에서 실제 입력 필드와 액션을 조합합니다.</span>
          </div>
        </div>
        <div style={modalFooterStyle}>
          <Dialog.Close style={closeButtonStyle}>취소</Dialog.Close>
          <Button size='xsmall'>확인</Button>
        </div>
      </div>
    </Dialog.Content>
  );
};

const ControlledExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger style={triggerStyle}>Controlled Dialog</Dialog.Trigger>
      <DialogContentExample />
    </Dialog>
  );
};

export const Default: StoryTypes = {
  render: ({ defaultOpen }: { defaultOpen?: boolean }) => {
    return (
      <Dialog defaultOpen={defaultOpen}>
        <Dialog.Trigger style={triggerStyle}>Dialog 열기</Dialog.Trigger>
        <DialogContentExample />
      </Dialog>
    );
  },
};

export const OpenByDefault: StoryTypes = {
  args: {
    defaultOpen: true,
  },
  render: ({ defaultOpen }: { defaultOpen?: boolean }) => {
    return (
      <Dialog defaultOpen={defaultOpen}>
        <Dialog.Trigger style={triggerStyle}>Dialog 열기</Dialog.Trigger>
        <DialogContentExample />
      </Dialog>
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
      <Dialog>
        <Dialog.Trigger style={triggerStyle}>긴 콘텐츠 열기</Dialog.Trigger>
        <Dialog.Content style={largeContentStyle}>
          <div style={modalLayoutStyle}>
            <div style={modalHeaderStyle}>
              <Dialog.Title style={modalTitleStyle}>긴 콘텐츠 모달</Dialog.Title>
              <Dialog.Description style={modalDescriptionStyle}>
                본문 영역은 viewport 높이를 넘으면 내부에서 스크롤됩니다.
              </Dialog.Description>
            </div>
            <div style={modalBodyStyle}>
              {Array.from({ length: 12 }, (_, index) => (
                <button key={index} style={fieldStyle} type='button'>
                  옵션 {index + 1}
                </button>
              ))}
            </div>
            <div style={modalFooterStyle}>
              <Dialog.Close style={closeButtonStyle}>닫기</Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog>
    );
  },
};

export const MobileWidth: StoryTypes = {
  args: {
    defaultOpen: true,
  },
  render: ({ defaultOpen }: { defaultOpen?: boolean }) => {
    return (
      <Dialog defaultOpen={defaultOpen}>
        <Dialog.Trigger style={triggerStyle}>모바일 Dialog 열기</Dialog.Trigger>
        <Dialog.Content style={mobileContentStyle}>
          <div style={modalLayoutStyle}>
            <div style={modalHeaderStyle}>
              <Dialog.Title style={modalTitleStyle}>망원 신선마트에 전화할까요?</Dialog.Title>
              <Dialog.Description style={modalDescriptionStyle}>
                현재 영업 상태를 확인하고 전화를 연결합니다.
              </Dialog.Description>
            </div>
            <div style={mobileFooterStyle}>
              <Dialog.Close style={mobileCloseButtonStyle}>취소</Dialog.Close>
              <Button size='mobile' style={mobileActionButtonStyle}>
                전화걸기
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog>
    );
  },
};

export const WithoutDescription: StoryTypes = {
  args: {
    defaultOpen: true,
  },
  render: ({ defaultOpen }: { defaultOpen?: boolean }) => {
    return (
      <Dialog defaultOpen={defaultOpen}>
        <Dialog.Trigger style={triggerStyle}>설명 없는 Dialog 열기</Dialog.Trigger>
        <Dialog.Content aria-label='설명 없는 Dialog' style={defaultContentStyle}>
          <div style={modalBodyStyle}>
            <div style={fieldStyle}>사용처에서 aria-label을 직접 제공할 수 있습니다.</div>
          </div>
          <div style={modalFooterStyle}>
            <Dialog.Close style={closeButtonStyle}>닫기</Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog>
    );
  },
};
