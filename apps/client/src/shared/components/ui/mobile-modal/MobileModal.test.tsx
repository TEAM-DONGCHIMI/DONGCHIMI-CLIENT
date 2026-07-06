import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders, screen, userEvent } from '@/test';

import { MobileModal, type MobileModalProps } from './MobileModal';

const defaultProps = {
  description: '현재 영업중· 21:00까지',
  onOpenChange: vi.fn(),
  open: true,
  subText: '02-123-4567',
  title: '망원 신선마트에 전화할까요?',
} satisfies MobileModalProps;

const renderMobileModal = (props: Partial<MobileModalProps> = {}) => {
  const mergedProps = {
    ...defaultProps,
    onOpenChange: vi.fn(),
    ...props,
  };

  return {
    props: mergedProps,
    ...renderWithProviders(<MobileModal {...mergedProps} />),
  };
};

describe('MobileModal', () => {
  it('renders call confirmation information with dialog semantics', async () => {
    renderMobileModal();

    const dialog = await screen.findByRole('dialog', {
      name: defaultProps.title,
    });

    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('02-123-4567')).toBeInTheDocument();
    expect(dialog).toHaveAccessibleDescription(
      `${defaultProps.subText} ${defaultProps.description}`,
    );
  });

  it('calls onOpenChange with false when cancel is clicked', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();
    const handleCancel = vi.fn();

    renderMobileModal({
      onCancel: handleCancel,
      onOpenChange: handleOpenChange,
    });

    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(handleCancel).toHaveBeenCalledTimes(1);
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not close when cancel event is prevented', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    renderMobileModal({
      onCancel: (event) => event.preventDefault(),
      onOpenChange: handleOpenChange,
    });

    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(handleOpenChange).not.toHaveBeenCalled();
  });

  it('calls onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup();
    const handleConfirm = vi.fn();

    renderMobileModal({
      confirmLabel: '전화걸기',
      onConfirm: handleConfirm,
    });

    await user.click(screen.getByRole('button', { name: '전화걸기' }));

    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it('disables confirm action when isConfirmButtonDisabled is true', () => {
    const handleConfirm = vi.fn();

    renderMobileModal({
      confirmLabel: '전화걸기',
      isConfirmButtonDisabled: true,
      onConfirm: handleConfirm,
    });

    const callButton = screen.getByRole('button', { name: '전화걸기' });

    expect(callButton).toBeDisabled();
  });

  it('uses custom button labels', () => {
    renderMobileModal({
      cancelLabel: '닫기',
      confirmLabel: '바로 전화',
    });

    expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '바로 전화' })).toBeInTheDocument();
  });

  it('renders without sub text', async () => {
    renderMobileModal({
      subText: undefined,
    });

    expect(await screen.findByRole('dialog', { name: defaultProps.title })).toBeInTheDocument();
    expect(screen.queryByText('02-123-4567')).not.toBeInTheDocument();
  });

  it('does not render dialog content when closed', () => {
    renderMobileModal({
      open: false,
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
