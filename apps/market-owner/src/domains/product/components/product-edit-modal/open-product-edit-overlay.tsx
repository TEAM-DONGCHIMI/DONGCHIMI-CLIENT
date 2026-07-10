import { type ReactNode } from 'react';
import { overlay } from 'overlay-kit';

interface OpenProductEditOverlayParams {
  render: (params: { closeOverlay: () => void; isOpen: boolean }) => ReactNode;
}

export const keepProductEditDialogOpen = () => undefined;

export const openProductEditOverlay = ({ render }: OpenProductEditOverlayParams) => {
  overlay.open(({ isOpen, close, unmount }) => {
    const closeOverlay = () => {
      close();
      unmount();
    };

    return render({ closeOverlay, isOpen });
  });
};
