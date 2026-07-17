import { describe, expect, it, vi } from 'vitest';

import { fireEvent, render, screen, userEvent, waitFor } from '../../../test';
import { Dialog } from './Dialog';

const renderDialog = (onOpenChange?: (open: boolean) => void) => {
  return render(
    <Dialog onOpenChange={onOpenChange}>
      <Dialog.Trigger>Open Dialog</Dialog.Trigger>
      <Dialog.Content>
        <div>
          <Dialog.Title>Edit sale information</Dialog.Title>
          <Dialog.Description>Edit product sale information.</Dialog.Description>
        </div>
        <div>
          <button type='button'>Product name input</button>
        </div>
        <div>
          <Dialog.Close>Cancel</Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog>,
  );
};

describe('Dialog', () => {
  it('opens dialog content with title semantics when trigger is clicked', async () => {
    const user = userEvent.setup();
    renderDialog();

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));

    const dialog = screen.getByRole('dialog', { name: 'Edit sale information' });

    expect(dialog).toBeInTheDocument();
    await waitFor(() => {
      expect(dialog).toHaveAccessibleDescription('Edit product sale information.');
    });
  });

  it('closes dialog content when close is clicked', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes dialog content when escape key is pressed', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    screen.getByRole('dialog').focus();
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes dialog content when backdrop is pressed', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    fireEvent.mouseDown(screen.getByRole('dialog'), { clientX: -1, clientY: -1 });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('keeps focus inside when shift tab starts from the dialog container', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));

    const dialog = screen.getByRole('dialog', { name: 'Edit sale information' });
    const closeButton = screen.getByRole('button', { name: 'Cancel' });

    dialog.focus();
    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });

    expect(closeButton).toHaveFocus();
  });

  it('calls onOpenChange when open state changes', async () => {
    const handleOpenChange = vi.fn();
    const user = userEvent.setup();
    renderDialog(handleOpenChange);

    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));

    expect(handleOpenChange).toHaveBeenCalledWith(true);
  });

  it('does not call onOpenChange when the requested open state is unchanged', async () => {
    const handleOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Dialog open onOpenChange={handleOpenChange}>
        <Dialog.Trigger>Open Dialog</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Edit sale information</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    );

    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));

    expect(handleOpenChange).not.toHaveBeenCalled();
  });

  it('keeps the native modal lifecycle open when controlled content rerenders', () => {
    const initialOpenChange = vi.fn();
    const nextOpenChange = vi.fn();
    const { rerender } = render(
      <Dialog open onOpenChange={initialOpenChange}>
        <Dialog.Content>
          <Dialog.Title>Edit sale information</Dialog.Title>
          <Dialog.Description>Initial description.</Dialog.Description>
        </Dialog.Content>
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Edit sale information' });
    const close = vi.fn(() => dialog.removeAttribute('open'));
    const showModal = vi.fn(() => dialog.setAttribute('open', ''));

    Object.defineProperties(dialog, {
      close: { configurable: true, value: close },
      showModal: { configurable: true, value: showModal },
    });

    rerender(
      <Dialog open onOpenChange={nextOpenChange}>
        <Dialog.Content>
          <Dialog.Title>Edit sale information</Dialog.Title>
          <Dialog.Description>Updated description.</Dialog.Description>
        </Dialog.Content>
      </Dialog>,
    );

    expect(screen.getByRole('dialog', { name: 'Edit sale information' })).toBe(dialog);
    expect(close).not.toHaveBeenCalled();
    expect(showModal).not.toHaveBeenCalled();

    fireEvent.mouseDown(dialog, { clientX: -1, clientY: -1 });

    expect(initialOpenChange).not.toHaveBeenCalled();
    expect(nextOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not reference a missing description when description is omitted', async () => {
    render(
      <Dialog defaultOpen>
        <Dialog.Content>
          <Dialog.Title>Edit sale information</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    );

    const dialog = await screen.findByRole('dialog', { name: 'Edit sale information' });

    expect(dialog).not.toHaveAttribute('aria-describedby');
  });
});
