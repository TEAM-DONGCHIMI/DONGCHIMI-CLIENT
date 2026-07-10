import { Button, Dialog } from '@dongchimi/design-system/components';

import { keepProductEditDialogOpen, openProductEditOverlay } from '../open-product-edit-overlay';
import * as S from './ProductEditConfirmModal.css';

export type ProductEditConfirmModalActionTypes = 'delete' | 'reset';

interface ProductEditConfirmModalProps {
  action: ProductEditConfirmModalActionTypes;
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

interface OpenProductEditConfirmModalParams {
  action: ProductEditConfirmModalActionTypes;
  onConfirm?: () => void;
}

const confirmModalCopyByAction = {
  delete: {
    confirmLabel: '삭제하기',
    title: '행사 기간이 아직 남았어요.\n정말 삭제하시겠어요?',
  },
  reset: {
    confirmLabel: '초기화하기',
    title: '초기화하면 모든 상품이 삭제돼요.\n정말 진행하시겠어요?',
  },
} satisfies Record<ProductEditConfirmModalActionTypes, { confirmLabel: string; title: string }>;

export const ProductEditConfirmModal = ({
  action,
  open,
  onCancel,
  onConfirm,
}: ProductEditConfirmModalProps) => {
  const copy = confirmModalCopyByAction[action];

  return (
    <Dialog open={open} onOpenChange={keepProductEditDialogOpen}>
      <Dialog.Content className={S.contentClassName}>
        <div className={S.containerClassName}>
          <Dialog.Title className={S.titleClassName}>{copy.title}</Dialog.Title>

          <div className={S.buttonGroupClassName}>
            <Button
              className={S.cancelButtonClassName}
              color='assistive'
              size='small'
              variant='solid'
              onClick={onCancel}
            >
              취소
            </Button>
            <Button
              className={S.actionButtonClassName}
              color='negative'
              size='small'
              variant='outlined'
              onClick={onConfirm}
            >
              {copy.confirmLabel}
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export const openProductEditConfirmModal = ({
  action,
  onConfirm,
}: OpenProductEditConfirmModalParams) => {
  openProductEditOverlay({
    render: ({ closeOverlay, isOpen }) => {
      const confirm = () => {
        closeOverlay();
        onConfirm?.();
      };

      return (
        <ProductEditConfirmModal
          action={action}
          open={isOpen}
          onCancel={closeOverlay}
          onConfirm={confirm}
        />
      );
    },
  });
};
