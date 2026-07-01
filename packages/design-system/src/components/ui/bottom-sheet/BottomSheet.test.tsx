import { describe, expect, it, vi } from 'vitest';

import { fireEvent, render, screen, userEvent, waitFor } from '../../../test';
import { BottomSheet } from './BottomSheet';

const renderBottomSheet = (onOpenChange?: (open: boolean) => void) => {
  return render(
    <BottomSheet onOpenChange={onOpenChange}>
      <BottomSheet.Trigger>공유하기</BottomSheet.Trigger>
      <BottomSheet.Content>
        <BottomSheet.Handle />
        <BottomSheet.Header>
          <BottomSheet.Title>콘텐츠 공유하기</BottomSheet.Title>
          <BottomSheet.Description>공유 액션을 선택합니다.</BottomSheet.Description>
        </BottomSheet.Header>
        <BottomSheet.Body>
          <button type='button'>링크 복사</button>
        </BottomSheet.Body>
        <BottomSheet.Footer>
          <BottomSheet.Close>닫기</BottomSheet.Close>
        </BottomSheet.Footer>
      </BottomSheet.Content>
    </BottomSheet>,
  );
};

describe('BottomSheet', () => {
  it('opens dialog content with title semantics when trigger is clicked', async () => {
    const user = userEvent.setup();
    renderBottomSheet();

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '공유하기' }));

    const dialog = screen.getByRole('dialog', { name: '콘텐츠 공유하기' });

    expect(dialog).toBeInTheDocument();
    await waitFor(() => {
      expect(dialog).toHaveAccessibleDescription('공유 액션을 선택합니다.');
    });
  });

  it('closes dialog content when close is clicked', async () => {
    const user = userEvent.setup();
    renderBottomSheet();

    await user.click(screen.getByRole('button', { name: '공유하기' }));
    await user.click(screen.getByRole('button', { name: '닫기' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes dialog content when escape key is pressed', async () => {
    const user = userEvent.setup();
    renderBottomSheet();

    await user.click(screen.getByRole('button', { name: '공유하기' }));
    screen.getByRole('dialog').focus();
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes dialog content when backdrop is pressed', async () => {
    const user = userEvent.setup();
    renderBottomSheet();

    await user.click(screen.getByRole('button', { name: '공유하기' }));
    fireEvent.mouseDown(screen.getByRole('dialog'), { clientX: -1, clientY: -1 });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('keeps focus inside when shift tab starts from the dialog container', async () => {
    const user = userEvent.setup();
    renderBottomSheet();

    await user.click(screen.getByRole('button', { name: '공유하기' }));

    const dialog = screen.getByRole('dialog', { name: '콘텐츠 공유하기' });
    const closeButton = screen.getByRole('button', { name: '닫기' });

    dialog.focus();
    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });

    expect(closeButton).toHaveFocus();
  });

  it('calls onOpenChange when open state changes', async () => {
    const handleOpenChange = vi.fn();
    const user = userEvent.setup();
    renderBottomSheet(handleOpenChange);

    await user.click(screen.getByRole('button', { name: '공유하기' }));

    expect(handleOpenChange).toHaveBeenCalledWith(true);
  });

  it('does not call onOpenChange when the requested open state is unchanged', async () => {
    const handleOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <BottomSheet open onOpenChange={handleOpenChange}>
        <BottomSheet.Trigger>공유하기</BottomSheet.Trigger>
        <BottomSheet.Content>
          <BottomSheet.Title>콘텐츠 공유하기</BottomSheet.Title>
        </BottomSheet.Content>
      </BottomSheet>,
    );

    await user.click(screen.getByRole('button', { name: '공유하기' }));

    expect(handleOpenChange).not.toHaveBeenCalled();
  });

  it('does not reference a missing description when description is omitted', async () => {
    render(
      <BottomSheet defaultOpen>
        <BottomSheet.Content>
          <BottomSheet.Title>콘텐츠 공유하기</BottomSheet.Title>
        </BottomSheet.Content>
      </BottomSheet>,
    );

    const dialog = await screen.findByRole('dialog', { name: '콘텐츠 공유하기' });

    expect(dialog).not.toHaveAttribute('aria-describedby');
  });
});
