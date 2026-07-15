import { Button, Dialog } from '@dongchimi/design-system/components';

import { useProductEditModalContentFocus } from '../hooks/use-product-edit-modal-content-focus';
import { openProductEditOverlay } from '../open-product-edit-overlay';
import * as S from './ProductEditConfirmModal.css';

export type ProductEditConfirmModalActionTypes = 'delete' | 'reset';

interface ProductEditConfirmModalProps {
  action: ProductEditConfirmModalActionTypes;
  isPending?: boolean;
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
}

interface OpenProductEditConfirmModalParams {
  action: ProductEditConfirmModalActionTypes;
  onConfirm?: () => void;
}

const confirmModalCopyByAction = {
  delete: {
    confirmLabel: '삭제하기',
    pendingLabel: '삭제 중',
    title: '행사 기간이 아직 남았어요.\n정말 삭제하시겠어요?',
  },
  reset: {
    confirmLabel: '초기화하기',
    pendingLabel: '초기화 중',
    title: '초기화하면 모든 상품이 삭제돼요.\n정말 진행하시겠어요?',
  },
} satisfies Record<
  ProductEditConfirmModalActionTypes,
  { confirmLabel: string; pendingLabel: string; title: string }
>;

export const ProductEditConfirmModal = ({
  action,
  isPending = false,
  open,
  onCancel,
  onConfirm,
  title,
}: ProductEditConfirmModalProps) => {
  const copy = confirmModalCopyByAction[action];
  const contentRef = useProductEditModalContentFocus(open);
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && !isPending) {
      onCancel();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Dialog.Content ref={contentRef} className={S.contentClassName}>
        <div className={S.containerClassName}>
          <Dialog.Title className={S.titleClassName}>{title ?? copy.title}</Dialog.Title>

          <div className={S.buttonGroupClassName}>
            <Button
              className={S.cancelButtonClassName}
              color='assistive'
              disabled={isPending}
              size='small'
              variant='solid'
              onClick={onCancel}
            >
              취소
            </Button>
            <Button
              className={S.actionButtonClassName}
              color='negative'
              disabled={isPending}
              size='small'
              variant='outlined'
              onClick={onConfirm}
            >
              {isPending ? copy.pendingLabel : copy.confirmLabel}
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
