import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, userEvent, within } from 'storybook/test';

import { Button } from '@dongchimi/design-system';

import { MobileModal, type MobileModalProps } from './MobileModal';

const meta = {
  title: 'Client/Shared/MobileModal',
  component: MobileModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    cancelLabel: {
      control: 'text',
    },
    className: {
      control: false,
    },
    isConfirmButtonDisabled: {
      control: 'boolean',
    },
    confirmLabel: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    onCancel: {
      control: false,
    },
    onConfirm: {
      control: false,
    },
    onOpenChange: {
      control: false,
    },
    open: {
      control: 'boolean',
    },
    subText: {
      control: 'text',
    },
    title: {
      control: 'text',
    },
  },
  args: {
    cancelLabel: '취소',
    isConfirmButtonDisabled: false,
    confirmLabel: '전화걸기',
    description: '현재 영업중· 21:00까지',
    onCancel: fn(),
    onConfirm: fn(),
    onOpenChange: fn(),
    open: true,
    subText: '02-123-4567',
    title: '망원 신선마트에 전화할까요?',
  },
} satisfies Meta<typeof MobileModal>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

const ControlledPreview = (args: Partial<MobileModalProps>) => {
  const [open, setOpen] = useState(false);
  const mobileModalProps = {
    cancelLabel: '취소',
    isConfirmButtonDisabled: false,
    confirmLabel: '전화걸기',
    description: '현재 영업중· 21:00까지',
    onCancel: fn(),
    onConfirm: fn(),
    onOpenChange: fn(),
    subText: '02-123-4567',
    title: '망원 신선마트에 전화할까요?',
    ...args,
  } satisfies Omit<MobileModalProps, 'open'>;

  return (
    <>
      <Button onClick={() => setOpen(true)} size='mobile'>
        모달 열기
      </Button>
      <MobileModal
        {...mobileModalProps}
        open={open}
        onOpenChange={(nextOpen) => {
          mobileModalProps.onOpenChange(nextOpen);
          setOpen(nextOpen);
        }}
      />
    </>
  );
};

export const Default: StoryTypes = {};

export const Controlled: StoryTypes = {
  args: {
    open: false,
  },
  render: (args: Partial<MobileModalProps>) => <ControlledPreview {...args} />,
};

export const ConfirmDisabled: StoryTypes = {
  args: {
    isConfirmButtonDisabled: true,
    description: '현재 영업 종료',
    open: true,
  },
};

export const LongMarketName: StoryTypes = {
  args: {
    open: true,
    title: '망원동 아주 긴 이름을 가진 신선마트에 전화할까요?',
  },
};

export const OpenByTrigger: StoryTypes = {
  args: {
    open: false,
  },
  render: (args: Partial<MobileModalProps>) => <ControlledPreview {...args} />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: '모달 열기' }));
  },
};
