import type { Meta, StoryObj } from '@storybook/react-vite';

import { QrDownloadModal } from './QrDownloadModal';

const noop = () => undefined;
const sampleQrImage = `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <rect width="120" height="120" fill="white"/>
    <path fill="black" d="M8 8h32v32H8zM16 16v16h16V16zM80 8h32v32H80zM88 16v16h16V16zM8 80h32v32H8zM16 88v16h16V88zM52 8h12v12H52zM52 28h20v12H52zM48 48h16v16H48zM72 48h12v12H72zM92 52h20v12H92zM52 72h12v20H52zM72 68h16v16H72zM92 76h20v12H92zM68 92h20v20H68zM96 96h16v16H96z"/>
  </svg>
`)}`;

const meta = {
  title: 'Market Owner/Shared/UI/QrDownloadModal',
  component: QrDownloadModal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    imageLabel: '매장 고유 QR코드',
    imageSrc: sampleQrImage,
    onClose: noop,
    onDownload: noop,
    open: true,
  },
  argTypes: {
    onClose: {
      action: 'closed',
    },
    onDownload: {
      action: 'downloaded',
    },
  },
} satisfies Meta<typeof QrDownloadModal>;

export default meta;
type StoryTypes = StoryObj<typeof meta>;

export const Default: StoryTypes = {};
