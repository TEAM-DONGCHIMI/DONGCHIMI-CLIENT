import { useCallback, useMemo, type DragEventHandler } from 'react';

interface UseFileDropParams {
  disabled?: boolean;
  onFilesDrop: (files: FileList) => void;
}

interface FileDropProps<TElement extends HTMLElement> {
  onDragOver?: DragEventHandler<TElement>;
  onDrop?: DragEventHandler<TElement>;
}

export const useFileDrop = <TElement extends HTMLElement = HTMLElement>({
  disabled = false,
  onFilesDrop,
}: UseFileDropParams) => {
  const handleFilesDrop = useCallback(
    (files?: FileList | null) => {
      if (disabled || files == null || files.length === 0) {
        return;
      }

      onFilesDrop(files);
    },
    [disabled, onFilesDrop],
  );

  const handleFileDragOver: DragEventHandler<TElement> = useCallback(
    (event) => {
      if (disabled) {
        return;
      }

      event.preventDefault();
    },
    [disabled],
  );

  const handleFileDrop: DragEventHandler<TElement> = useCallback(
    (event) => {
      if (disabled) {
        return;
      }

      event.preventDefault();
      handleFilesDrop(event.dataTransfer.files);
    },
    [disabled, handleFilesDrop],
  );

  const fileDropProps: FileDropProps<TElement> = useMemo(() => {
    if (disabled) {
      return {};
    }

    return {
      onDragOver: handleFileDragOver,
      onDrop: handleFileDrop,
    };
  }, [disabled, handleFileDragOver, handleFileDrop]);

  return {
    fileDropProps,
    handleFilesDrop,
  };
};
