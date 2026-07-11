import type { ComponentProps } from 'react';

import { describe, expect, it, vi } from 'vitest';

import { fireEvent, render, screen, userEvent } from '../../../../test';
import { UploadModal } from './UploadModal';

const dialogName = '파일 업로드';
const fileSelectLabel = '파일 선택';
const uploadButtonLabel = '파일 업로드';
const cancelLabel = '취소';

const defaultProps = {
  accept: '.xlsx,.xls',
  heading: dialogName,
  label: '엑셀 파일을 선택해주세요',
  onOpenChange: vi.fn(),
  open: true,
} satisfies ComponentProps<typeof UploadModal>;

const renderUploadModal = (props: Partial<ComponentProps<typeof UploadModal>> = {}) => {
  return render(<UploadModal {...defaultProps} {...props} />);
};

const getFileSelectTrigger = () => {
  return screen.getByRole('button', { name: fileSelectLabel });
};

describe('UploadModal', () => {
  it('renders an accessible dialog with default state controls', () => {
    renderUploadModal();

    expect(screen.getByRole('dialog', { name: dialogName })).toHaveAccessibleDescription(
      defaultProps.label,
    );
    expect(screen.getByLabelText(fileSelectLabel)).toHaveAttribute('accept', '.xlsx,.xls');
    expect(screen.getByRole('button', { name: uploadButtonLabel })).toBeDisabled();
  });

  it('renders a caller-provided file select icon slot', () => {
    renderUploadModal({
      fileSelectIcon: <span data-testid='file-select-icon' />,
    });

    expect(
      screen.getByTestId('file-select-icon').closest('[aria-hidden="true"]'),
    ).toBeInTheDocument();
  });

  it('renders a caller-provided file select tooltip label', () => {
    const tooltipLabel = '지원 파일은 .xlsx, .csv예요.';

    renderUploadModal({
      fileSelectTooltipLabel: tooltipLabel,
    });

    expect(screen.getByText(tooltipLabel)).toBeInTheDocument();
  });

  it('renders upload state with optional description and enabled upload action', () => {
    const description = '선택한 파일을 확인해주세요';

    renderUploadModal({
      description,
      selectedFileText: 'products.xlsx',
      state: 'upload',
    });

    expect(screen.getByText(description)).toBeInTheDocument();
    expect(screen.getByText('products.xlsx')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: uploadButtonLabel })).toBeEnabled();
  });

  it('renders error state and keeps upload action disabled', () => {
    const errorLabel = '엑셀 파일 형식을 확인해주세요';

    renderUploadModal({
      label: errorLabel,
      state: 'error',
    });

    expect(screen.getByRole('dialog', { name: dialogName })).toHaveAccessibleDescription(
      errorLabel,
    );
    expect(screen.getByRole('button', { name: uploadButtonLabel })).toBeDisabled();
  });

  it('calls file change and upload handlers', async () => {
    const handleFileChange = vi.fn();
    const handleUpload = vi.fn();
    const user = userEvent.setup();
    const file = new File(['name,price'], 'products.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    renderUploadModal({
      onFileChange: handleFileChange,
      onUpload: handleUpload,
      selectedFileText: 'products.xlsx',
      state: 'upload',
    });

    await user.upload(screen.getByLabelText(fileSelectLabel), file);
    await user.click(screen.getByRole('button', { name: uploadButtonLabel }));

    expect(handleFileChange).toHaveBeenCalledTimes(1);
    expect(handleUpload).toHaveBeenCalledTimes(1);
  });

  it('resets the file input value before opening the file picker', async () => {
    const user = userEvent.setup();
    const file = new File(['name,price'], 'products.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    renderUploadModal();

    const fileInput = screen.getByLabelText(fileSelectLabel) as HTMLInputElement;

    await user.upload(fileInput, file);
    expect(fileInput.files).toHaveLength(1);

    await user.click(getFileSelectTrigger());

    expect(fileInput.value).toBe('');
  });

  it('prevents native cancel requests without closing the controlled dialog', async () => {
    const handleOpenChange = vi.fn();
    const handleFileChange = vi.fn();
    const file = new File(['name,price'], 'products.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    renderUploadModal({
      onFileChange: handleFileChange,
      onOpenChange: handleOpenChange,
    });

    const cancelEvent = new Event('cancel', { cancelable: true });

    fireEvent(screen.getByRole('dialog', { name: dialogName }), cancelEvent);
    await userEvent.upload(screen.getByLabelText(fileSelectLabel), file);

    expect(cancelEvent.defaultPrevented).toBe(true);
    expect(handleOpenChange).not.toHaveBeenCalledWith(false);
    expect(handleFileChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('dialog', { name: dialogName })).toBeInTheDocument();
  });

  it('closes through the cancel button', async () => {
    const handleCancel = vi.fn();
    const handleOpenChange = vi.fn();
    const user = userEvent.setup();

    renderUploadModal({
      onCancel: handleCancel,
      onOpenChange: handleOpenChange,
    });

    await user.click(screen.getByRole('button', { name: cancelLabel }));

    expect(handleCancel).toHaveBeenCalledTimes(1);
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});
