import { createEvent, fireEvent, render, screen } from '@/test';
import { describe, expect, it, vi } from 'vitest';

import { useFileDrop } from './use-file-drop';

const DropTarget = ({
  disabled,
  onFilesDrop,
}: {
  disabled?: boolean;
  onFilesDrop: (files: FileList) => void;
}) => {
  const { fileDropProps } = useFileDrop<HTMLDivElement>({
    disabled,
    onFilesDrop,
  });

  return <div data-testid='drop-target' {...fileDropProps} />;
};

describe('useFileDrop', () => {
  it('prevents native file open and passes dropped files to the caller', () => {
    const handleFilesDrop = vi.fn();
    const file = new File(['image'], 'product.png', { type: 'image/png' });

    render(<DropTarget onFilesDrop={handleFilesDrop} />);

    const dropTarget = screen.getByTestId('drop-target');
    const dragOverEvent = createEvent.dragOver(dropTarget, {
      dataTransfer: {
        files: [file],
      },
    });
    const dropEvent = createEvent.drop(dropTarget, {
      dataTransfer: {
        files: [file],
      },
    });
    const preventDragOverDefault = vi.spyOn(dragOverEvent, 'preventDefault');
    const preventDropDefault = vi.spyOn(dropEvent, 'preventDefault');

    fireEvent(dropTarget, dragOverEvent);
    fireEvent(dropTarget, dropEvent);

    expect(preventDragOverDefault).toHaveBeenCalledTimes(1);
    expect(preventDropDefault).toHaveBeenCalledTimes(1);
    expect(handleFilesDrop).toHaveBeenCalledTimes(1);
    expect(handleFilesDrop.mock.calls[0]?.[0][0]).toBe(file);
  });

  it('does not handle dropped files when disabled', () => {
    const handleFilesDrop = vi.fn();
    const file = new File(['image'], 'product.png', { type: 'image/png' });

    render(<DropTarget disabled onFilesDrop={handleFilesDrop} />);

    fireEvent.drop(screen.getByTestId('drop-target'), {
      dataTransfer: {
        files: [file],
      },
    });

    expect(handleFilesDrop).not.toHaveBeenCalled();
  });
});
