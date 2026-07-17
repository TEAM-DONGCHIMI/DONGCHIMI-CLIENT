import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';

import { Button } from '@dongchimi/design-system/components';
import { IcCirclePlusSizeSmall } from '@dongchimi/design-system/icons';

import { DesktopHeader } from '@/shared/components/ui/desktop-header/DesktopHeader';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { type ImagePreviewChangePayload, useImagePreview } from '@/shared/hooks/useImagePreview';
import { useAuthStore } from '@/shared/stores/auth-store';
import { isValidImageUploadFile } from '@/shared/utils/image-upload.utils';

import { ProductEditConfirmModal } from '../components/product-edit-modal';
import { useProductDeletionActions, useProductUpdateFlow } from '../hooks';
import { useCategoryDropdown } from './hooks/useCategoryDropdown';
import { useCurrentProductField } from './hooks/useCurrentProductField';
import { useTodaySpecialForm } from './hooks/use-today-special-form';
import { useTodaySpecialProductRegistration } from './hooks/use-today-special-product-registration';
import { createTodaySpecialProductUpdateValues } from './model';
import {
  ProductInfoSection,
  ProductPeriodSection,
  ProductPriceSection,
  RegistrationTitleSection,
} from './sections';
import * as S from './today-special-registration-page.css';

const getSubmitButtonLabel = (isPending: boolean) => (isPending ? '등록 중' : '등록 완료');

interface TodaySpecialRegistrationPageContentProps {
  marketId: number;
}

const TodaySpecialRegistrationPageContent = ({
  marketId,
}: TodaySpecialRegistrationPageContentProps) => {
  const navigate = useNavigate();
  const [deleteTargetProductId, setDeleteTargetProductId] = useState<number | null>(null);
  const { registerProduct } = useTodaySpecialProductRegistration(marketId);
  const productUpdateFlow = useProductUpdateFlow();
  const { deleteProduct, isDeletePending } = useProductDeletionActions(marketId);
  const form = useTodaySpecialForm();
  const { currentIndex, currentProduct, products, setValue } = form;
  const currentProductField = useCurrentProductField({
    currentIndex,
    currentProductErrors: form.currentProductErrors,
    currentProductTouchedFields: form.currentProductTouchedFields,
    isSubmitted: form.isSubmitted,
    setValue,
  });
  const categoryDropdown = useCategoryDropdown({
    currentIndex,
    selectedCategory: currentProduct.category,
    setValue,
  });
  const handleImagePreviewChange = ({ file, previewUrl }: ImagePreviewChangePayload) => {
    setValue(`products.${currentIndex}.imageFile`, file, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(`products.${currentIndex}.imagePreviewUrl`, previewUrl, {
      shouldDirty: true,
    });
  };
  const imagePreview = useImagePreview({
    currentPreviewUrl: currentProduct.imagePreviewUrl,
    isValidFile: isValidImageUploadFile,
    onPreviewChange: handleImagePreviewChange,
    previewUrls: products.map((product) => product.imagePreviewUrl),
  });
  const handleFormSubmit = form.createCurrentProductSubmitHandler(async (product) => {
    if (product.productId != null) {
      const result = await productUpdateFlow.submitProductUpdate({
        currentThumbnailUrl: product.thumbnailUrl ?? product.imagePreviewUrl,
        dealType: 'DAILY',
        imageFile: product.imageFile,
        marketId,
        productId: product.productId,
        values: createTodaySpecialProductUpdateValues(product),
      });

      if (result.success) {
        categoryDropdown.closeCategoryDropdown();
        form.updateRegisteredProduct({
          product,
          productId: product.productId,
          thumbnailUrl: result.thumbnailUrl,
        });
      }

      return;
    }

    const result = await registerProduct(product);

    if (result.success) {
      navigate(MARKET_OWNER_ROUTES.home);
    }
  });
  const handleContinueRegistration = form.createCurrentProductSubmitHandler(async (product) => {
    const result = await registerProduct(product);

    if (result.success) {
      categoryDropdown.closeCategoryDropdown();
      form.resetForNextProduct({
        previewUrl: product.imagePreviewUrl,
        productId: result.productId,
        thumbnailUrl: result.thumbnailUrl,
      });
    }
  });
  const handleDeleteRegisteredProduct = async () => {
    if (deleteTargetProductId == null) {
      return;
    }

    const isDeleted = await deleteProduct(deleteTargetProductId);

    if (!isDeleted) {
      return;
    }

    imagePreview.revokeCurrentPreviewUrl();
    categoryDropdown.closeCategoryDropdown();
    form.deleteRegisteredProduct(deleteTargetProductId);
    setDeleteTargetProductId(null);
  };
  const productInfoSectionProps = {
    ...categoryDropdown.productCategoryProps,
    ...currentProductField.productInfoFieldProps,
    onImageChange: imagePreview.imageInputProps.onChange,
    product: currentProduct,
  };
  const productPriceSectionProps = {
    ...currentProductField.productPriceFieldProps,
    product: currentProduct,
  };
  const productPeriodSectionProps = {
    ...currentProductField.productPeriodFieldProps,
    product: currentProduct,
  };
  const isProductSubmitPending = form.isSubmitting || productUpdateFlow.isPending;
  const isActionPending = isProductSubmitPending || isDeletePending;
  const submitButtonLabel = getSubmitButtonLabel(isProductSubmitPending);

  return (
    <main className={S.pageRootClassName}>
      <DesktopHeader currentLabel='오늘의 특가 상품 등록' parentLabel='홈' showSearchBar={false} />

      <form aria-busy={isActionPending} onSubmit={handleFormSubmit}>
        <section
          className={S.formContentClassName}
          aria-labelledby='today-special-registration-title'
        >
          <RegistrationTitleSection
            canCancelCurrentDraft={form.canCancelCurrentDraft}
            canDeleteRegisteredProduct={
              form.isRegisteredProduct && currentProduct.productId != null
            }
            currentIndex={currentIndex}
            isInteractionPending={isActionPending}
            onCancelCurrentDraft={() => {
              imagePreview.revokeCurrentPreviewUrl();
              categoryDropdown.closeCategoryDropdown();
              form.cancelCurrentDraft();
            }}
            onDeleteRegisteredProduct={() => {
              if (currentProduct.productId != null) {
                setDeleteTargetProductId(currentProduct.productId);
              }
            }}
            onNextProduct={() => {
              categoryDropdown.closeCategoryDropdown();
              form.moveToNextProduct();
            }}
            onPreviousProduct={() => {
              categoryDropdown.closeCategoryDropdown();
              form.moveToPreviousProduct();
            }}
            productCount={products.length}
          />

          <fieldset className={S.fieldSectionsClassName} disabled={isActionPending}>
            <ProductInfoSection {...productInfoSectionProps} />
            <ProductPriceSection {...productPriceSectionProps} />
            <ProductPeriodSection {...productPeriodSectionProps} />
          </fieldset>

          <footer className={S.actionSectionClassName}>
            <Button
              className={S.actionButtonClassName}
              color='assistive'
              disabled={isActionPending}
              leftIcon={<IcCirclePlusSizeSmall />}
              onClick={
                form.isRegisteredProduct ? form.openNextProductDraft : handleContinueRegistration
              }
              size='small'
              type='button'
              variant='outlined'
            >
              상품 계속 등록
            </Button>
            <Button
              className={S.actionButtonClassName}
              disabled={form.isSubmitDisabled || isActionPending}
              size='small'
              type='submit'
            >
              {submitButtonLabel}
            </Button>
          </footer>
        </section>
      </form>

      <ProductEditConfirmModal
        action='delete'
        isPending={isDeletePending}
        open={deleteTargetProductId != null}
        title='정말 삭제하시겠어요?'
        onCancel={() => setDeleteTargetProductId(null)}
        onConfirm={() => void handleDeleteRegisteredProduct()}
      />
    </main>
  );
};

export const TodaySpecialRegistrationPage = () => {
  const marketId = useAuthStore((state) => state.marketId);

  if (marketId == null) {
    return <Navigate replace to={MARKET_OWNER_ROUTES.marketInformationRegistration} />;
  }

  return <TodaySpecialRegistrationPageContent marketId={marketId} />;
};
