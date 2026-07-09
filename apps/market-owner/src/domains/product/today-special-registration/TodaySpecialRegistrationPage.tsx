import { useNavigate } from 'react-router';

import { Button } from '@dongchimi/design-system/components';
import { IcCirclePlusSizeSmall } from '@dongchimi/design-system/icons';

import { DesktopHeader } from '@/shared/components/ui/desktop-header/DesktopHeader';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { useImagePreview } from '@/shared/hooks/useImagePreview';

import { useCategoryDropdown } from './hooks/useCategoryDropdown';
import { useCurrentProductField } from './hooks/useCurrentProductField';
import { useProductDraftNavigation } from './hooks/useProductDraftNavigation';
import { useTodaySpecialForm } from './hooks/useTodaySpecialForm';
import { isValidTodaySpecialImageFile } from './model';
import {
  ProductInfoSection,
  ProductPeriodSection,
  ProductPriceSection,
  RegistrationTitleSection,
} from './sections';
import * as S from './TodaySpecialRegistrationPage.css';

export const TodaySpecialRegistrationPage = () => {
  const navigate = useNavigate();
  const form = useTodaySpecialForm({
    onSubmit: () => {
      // TODO: presigned URL 발급, storage PUT, 상품 payload submit 순서로 API 연동.
      navigate(MARKET_OWNER_ROUTES.home);
    },
  });
  const currentProductField = useCurrentProductField({
    currentIndex: form.currentIndex,
    currentProductErrors: form.currentProductErrors,
    currentProductTouchedFields: form.currentProductTouchedFields,
    isSubmitted: form.isSubmitted,
    setValue: form.setValue,
  });
  const categoryDropdown = useCategoryDropdown({
    currentIndex: form.currentIndex,
    selectedCategory: form.currentProduct.category,
    setValue: form.setValue,
  });
  const imagePreview = useImagePreview({
    currentPreviewUrl: form.currentProduct.imagePreviewUrl,
    isValidFile: isValidTodaySpecialImageFile,
    onPreviewChange: ({ file, previewUrl }) => {
      form.setValue(`products.${form.currentIndex}.imageFile`, file, {
        shouldDirty: true,
        shouldValidate: true,
      });
      form.setValue(`products.${form.currentIndex}.imagePreviewUrl`, previewUrl, {
        shouldDirty: true,
      });
    },
    previewUrls: form.products.map((product) => product.imagePreviewUrl),
  });
  const draftNavigation = useProductDraftNavigation({
    appendProduct: form.appendProduct,
    closeCategoryDropdown: categoryDropdown.closeCategoryDropdown,
    currentIndex: form.currentIndex,
    productCount: form.products.length,
    removeProduct: form.removeProduct,
    revokeCurrentImagePreviewUrl: imagePreview.revokeCurrentPreviewUrl,
    setCurrentIndex: form.setCurrentIndex,
  });
  const productInfoSectionProps = {
    ...categoryDropdown.productCategoryProps,
    ...currentProductField.productInfoFieldProps,
    onImageChange: imagePreview.imageInputProps.onChange,
    product: form.currentProduct,
  };
  const productPriceSectionProps = {
    ...currentProductField.productPriceFieldProps,
    product: form.currentProduct,
  };
  const productPeriodSectionProps = {
    ...currentProductField.productPeriodFieldProps,
    product: form.currentProduct,
  };

  return (
    <main className={S.pageRootClassName}>
      <DesktopHeader currentLabel='오늘의 특가 상품 등록' parentLabel='홈' showSearchBar={false} />

      <form onSubmit={form.handleFormSubmit}>
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
              등록 완료
            </Button>
          </footer>
        </section>
      </form>
    </main>
  );
};
