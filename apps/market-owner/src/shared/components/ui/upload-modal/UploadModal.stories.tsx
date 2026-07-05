import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { UploadModal } from './UploadModal';

const noop = () => undefined;
const sampleText = '텍스트를 입력하세요 텍스트를 입력하세요 텍스트를 입력하세요';

const renderModal = (args: ComponentProps<typeof UploadModal>) => {
  return <UploadModal {...args} />;
};

const meta = {
  title: 'Market Owner/Shared/UI/UploadModal',
  component: UploadModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    accept: '.xlsx,.xls',
    label: sampleText,
    onCancel: noop,
    onOpenChange: noop,
    onUpload: noop,
    open: true,
  },
} satisfies Meta<typeof UploadModal>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {
  render: renderModal,
};

export const Upload: StoryTypes = {
  args: {
    description: sampleText,
    selectedFileText: sampleText,
    state: 'upload',
  },
  render: renderModal,
};

export const Error: StoryTypes = {
  args: {
    label: sampleText,
    state: 'error',
  },
  render: renderModal,
};
