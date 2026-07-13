import { useNavigate } from 'react-router';

import { Button } from '@dongchimi/design-system/components';
import { IcCirclePlusSizeSmall } from '@dongchimi/design-system/icons';
import { useToast } from '@dongchimi/shared/toast';

import { DesktopHeader } from '@/shared/components/ui/desktop-header/DesktopHeader';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { type ImagePreviewChangePayload, useImagePreview } from '@/shared/hooks/useImagePreview';
import {
  imageUploadErrorMessages,
  isValidImageUploadFile,
} from '@/shared/utils/image-upload.utils';

import { useCategoryDropdown } from './hooks/useCategoryDropdown';
import { useCurrentProductField } from './hooks/useCurrentProductField';
import { useProductDraftNavigation } from './hooks/useProductDraftNavigation';
import { useTodaySpecialForm } from './hooks/useTodaySpecialForm';
import { useTodaySpecialImageUpload } from './hooks/useTodaySpecialImageUpload';
import {
  ProductInfoSection,
  ProductPeriodSection,
  ProductPriceSection,
  RegistrationTitleSection,
} from './sections';
import * as S from './TodaySpecialRegistrationPage.css';

export const TodaySpecialRegistrationPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { uploadProductImages } = useTodaySpecialImageUpload();
  const form = useTodaySpecialForm({
    onSubmit: async ({ products }) => {
      try {
        await uploadProductImages(products);
        navigate(MARKET_OWNER_ROUTES.todaySpecialEdit);
      } catch {
        toast.error(imageUploadErrorMessages.uploadFailed);
      }
    },
  });
  const { currentIndex, currentProduct, products, setValue } = form;
  const productCount = products.length;
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
  const draftNavigation = useProductDraftNavigation({
    appendProduct: form.appendProduct,
    closeCategoryDropdown: categoryDropdown.closeCategoryDropdown,
    currentIndex,
    productCount,
    removeProduct: form.removeProduct,
    revokeCurrentImagePreviewUrl: imagePreview.revokeCurrentPreviewUrl,
    setCurrentIndex: form.setCurrentIndex,
  });
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

  return (
    <main className={S.pageRootClassName}>
      <DesktopHeader currentLabel='오늘의 특가 상품 등록' parentLabel='홈' showSearchBar={false} />

      <form aria-busy={form.isSubmitting} onSubmit={form.handleFormSubmit}>
        <section
          className={S.formContentClassName}
          aria-labelledby='today-special-registration-title'
        >
          <RegistrationTitleSection {...draftNavigation.titleSectionProps} />

          <div className={S.fieldSectionsClassName}>
            <ProductInfoSection {...productInfoSectionProps} />
            <ProductPriceSection {...productPriceSectionProps} />
            <ProductPeriodSection {...productPeriodSectionProps} />
          </div>

          <footer className={S.actionSectionClassName}>
            <Button
              className={S.actionButtonClassName}
              color='assistive'
              disabled={form.isSubmitting}
              leftIcon={<IcCirclePlusSizeSmall />}
              onClick={draftNavigation.actionSectionProps.onAddProduct}
              size='small'
              variant='outlined'
            >
              상품 계속 등록
            </Button>
            <Button
              className={S.actionButtonClassName}
              disabled={form.isSubmitDisabled}
              size='small'
              type='submit'
            >
              {form.isSubmitting ? '등록 중' : '등록 완료'}
            </Button>
          </footer>
        </section>
      </form>
    </main>
  );
};
