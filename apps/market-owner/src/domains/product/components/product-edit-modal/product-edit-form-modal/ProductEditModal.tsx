import { useEffect } from 'react';

import { Button, Dialog } from '@dongchimi/design-system/components';
import { useToast } from '@dongchimi/shared/toast';

import { useProductDetailQuery, useProductUpdateFlow } from '@/domains/product/hooks';
import { type OwnerApiTypes } from '@/shared/api';

import {
  type ProductEditCardProps,
  type ProductEditCardVariantTypes,
} from '../../product-edit-product-list';
import { useProductEditModalContentFocus } from '../hooks/use-product-edit-modal-content-focus';
import { keepProductEditDialogOpen, openProductEditOverlay } from '../open-product-edit-overlay';
import { ProductInfoSection } from './ProductInfoSection';
import * as S from './ProductEditModal.css';
import { ProductPriceAndPeriodSection } from './ProductPriceAndPeriodSection';
import { createUpdatedProductCard, type ProductEditFormValues } from './product-edit-form.utils';
import { useProductEditForm } from './use-product-edit-form';

interface ProductEditModalProps {
  marketId: number;
  open: boolean;
  product: ProductEditCardProps;
  productId: number;
  variant: ProductEditCardVariantTypes;
  onClose: () => void;
  onSubmit?: (product: ProductEditCardProps) => void;
}

interface OpenProductEditModalParams {
  marketId: number;
  product: ProductEditCardProps;
  productId: number;
  onClose?: () => void;
  onSubmit?: (product: ProductEditCardProps) => void;
  variant: ProductEditCardVariantTypes;
}

const PRODUCT_DETAIL_LOAD_ERROR_MESSAGE = '상품 정보를 불러오지 못했어요. 다시 시도해주세요.';

interface ProductEditModalFormProps extends Omit<
  ProductEditModalProps,
  'marketId' | 'onSubmit' | 'product' | 'productId'
> {
  detail: OwnerApiTypes.OwnerProductDetailResponse;
  isSubmitting: boolean;
  onSubmit: (values: ProductEditFormValues) => Promise<boolean>;
}

const ProductEditModalForm = ({
  detail,
  isSubmitting,
  open,
  variant,
  onClose,
  onSubmit,
}: ProductEditModalFormProps) => {
  const contentRef = useProductEditModalContentFocus(open);
  const {
    categoryDropdownStyle,
    categoryFieldRef,
    categoryTriggerRef,
    closeCategoryDropdown,
    imageInputOnChange,
    isCategoryDropdownOpen,
    isDateRangeValid,
    isEdited,
    isStartDateValid,
    isTodayOnly,
    selectCategory,
    toggleCategoryDropdown,
    toggleTodayOnlyPeriod,
    updateValue,
    values,
  } = useProductEditForm({ detail, variant });

  const closeModal = () => {
    closeCategoryDropdown();
    onClose();
  };

  const submitModal = async () => {
    const didUpdate = await onSubmit(values);

    if (didUpdate) {
      closeModal();
    }
  };

  return (
    <Dialog open={open} onOpenChange={keepProductEditDialogOpen}>
      <Dialog.Content ref={contentRef} className={S.contentClassName}>
        <div aria-busy={isSubmitting} className={S.containerClassName}>
          <Dialog.Title className={S.titleClassName}>판매 정보를 수정해주세요</Dialog.Title>

          <div className={S.bodyClassName}>
            <ProductInfoSection
              categoryDropdownStyle={categoryDropdownStyle}
              categoryFieldRef={categoryFieldRef}
              categoryTriggerRef={categoryTriggerRef}
              imageInputOnChange={imageInputOnChange}
              isCategoryDropdownOpen={isCategoryDropdownOpen}
              selectCategory={selectCategory}
              toggleCategoryDropdown={toggleCategoryDropdown}
              updateValue={updateValue}
              values={values}
            />
            <ProductPriceAndPeriodSection
              isTodayOnly={isTodayOnly}
              toggleTodayOnlyPeriod={toggleTodayOnlyPeriod}
              updateValue={updateValue}
              values={values}
              variant={variant}
            />
          </div>

          <div className={S.footerClassName}>
            <Button
              className={S.footerButtonClassName}
              color='assistive'
              disabled={isSubmitting}
              size='small'
              variant='outlined'
              onClick={closeModal}
            >
              취소
            </Button>
            <Button
              className={S.footerButtonClassName}
              disabled={isSubmitting || !isEdited || !isStartDateValid || !isDateRangeValid}
              size='small'
              variant='solid'
              onClick={submitModal}
            >
              변경하기
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export const ProductEditModal = ({
  marketId,
  open,
  product,
  productId,
  variant,
  onClose,
  onSubmit,
}: ProductEditModalProps) => {
  const toast = useToast();
  const productDetailQuery = useProductDetailQuery({ marketId, productId });
  const productUpdateFlow = useProductUpdateFlow();

  useEffect(() => {
    if (!productDetailQuery.isError) {
      return;
    }

    toast.error(PRODUCT_DETAIL_LOAD_ERROR_MESSAGE);
    onClose();
  }, [onClose, productDetailQuery.isError, toast]);

  if (productDetailQuery.isPending || productDetailQuery.isError) {
    return null;
  }

  const detail = productDetailQuery.data.data;

  const submitProductUpdate = async (values: ProductEditFormValues) => {
    const result = await productUpdateFlow.submitProductUpdate({
      currentThumbnailUrl: detail.thumbnailUrl ?? null,
      dealType: detail.dealType,
      imageFile: values.imageFile,
      marketId,
      productId,
      values,
    });

    if (result.success) {
      onSubmit?.(createUpdatedProductCard({ product, values, variant }));
    }

    return result.success;
  };

  return (
    <ProductEditModalForm
      detail={detail}
      isSubmitting={productUpdateFlow.isPending}
      open={open}
      variant={variant}
      onClose={onClose}
      onSubmit={submitProductUpdate}
    />
  );
};

export const openProductEditModal = ({
  marketId,
  product,
  productId,
  variant,
  onClose,
  onSubmit,
}: OpenProductEditModalParams) => {
  openProductEditOverlay({
    render: ({ closeOverlay, isOpen }) => (
      <ProductEditModal
        marketId={marketId}
        open={isOpen}
        product={product}
        productId={productId}
        variant={variant}
        onClose={() => {
          closeOverlay();
          onClose?.();
        }}
        onSubmit={onSubmit}
      />
    ),
  });
};
