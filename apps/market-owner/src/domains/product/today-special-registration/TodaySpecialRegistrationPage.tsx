import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@dongchimi/design-system/components';
import { IcCirclePlusSizeSmall } from '@dongchimi/design-system/icons';

import { DesktopHeader } from '@/shared/components/ui/desktop-header/DesktopHeader';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

import {
  createEmptyTodaySpecialProductForm,
  formatPriceInput,
  isTodaySpecialProductFormComplete,
  isValidTodaySpecialImageFile,
  resolveEndDateAfterStartDateChange,
  revokePreviewUrl,
  sanitizeProductDescription,
  sanitizeProductName,
  type TodaySpecialProductForm,
  type TodaySpecialProductTextFieldTypes,
} from './model';
import {
  ProductInfoSection,
  ProductPeriodSection,
  ProductPriceSection,
  RegistrationTitleSection,
} from './sections';
import * as S from './TodaySpecialRegistrationPage.css';

// 새 상품 등록시 빈 form 생성
const createInitialProductForm = () => createEmptyTodaySpecialProductForm();

export const TodaySpecialRegistrationPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<TodaySpecialProductForm[]>([createInitialProductForm()]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const productsRef = useRef(products); // 이미지 preview 정리

  const currentProduct = products[currentIndex];
  const isSubmitDisabled =
    products.length === 0 ||
    products.some((product) => !isTodaySpecialProductFormComplete(product));

  // 이미지 변경시 초기화
  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  useEffect(() => {
    return () => {
      productsRef.current.forEach((product) => {
        revokePreviewUrl(product.imagePreviewUrl);
      });
    };
  }, []);

  // 현재 상품 업데이트
  const updateCurrentProduct = (nextProduct: TodaySpecialProductForm) => {
    setProducts((previousProducts) =>
      previousProducts.map((product, index) => (index === currentIndex ? nextProduct : product)),
    );
  };

  const handleFieldChange =
    (field: TodaySpecialProductTextFieldTypes) => (event: ChangeEvent<HTMLInputElement>) => {
      updateCurrentProduct({
        ...currentProduct,
        [field]: event.target.value,
      });
    };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateCurrentProduct({
      ...currentProduct,
      name: sanitizeProductName(event.target.value),
    });
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateCurrentProduct({
      ...currentProduct,
      description: sanitizeProductDescription(event.target.value),
    });
  };

  const handlePriceChange =
    (field: Extract<TodaySpecialProductTextFieldTypes, 'salePrice' | 'specialPrice'>) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      updateCurrentProduct({
        ...currentProduct,
        [field]: formatPriceInput(event.target.value),
      });
    };

  const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const startDate = event.target.value;

    updateCurrentProduct({
      ...currentProduct,
      startDate,
      endDate: resolveEndDateAfterStartDateChange(startDate, currentProduct.endDate),
    });
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!isValidTodaySpecialImageFile(file)) {
      event.target.value = '';
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    revokePreviewUrl(currentProduct.imagePreviewUrl);
    updateCurrentProduct({
      ...currentProduct,
      imageFile: file,
      imagePreviewUrl: previewUrl,
    });
  };

  const handleCategorySelect = (category: string) => {
    updateCurrentProduct({
      ...currentProduct,
      category,
    });
    setIsCategoryOpen(false);
  };

  const handleAddProduct = () => {
    setProducts((previousProducts) => [...previousProducts, createInitialProductForm()]);
    setCurrentIndex(products.length);
    setIsCategoryOpen(false);
  };

  const handlePreviousProduct = () => {
    setCurrentIndex((previousIndex) => Math.max(previousIndex - 1, 0));
    setIsCategoryOpen(false);
  };

  const handleNextProduct = () => {
    setCurrentIndex((previousIndex) => Math.min(previousIndex + 1, products.length - 1));
    setIsCategoryOpen(false);
  };

  const handleRemoveCurrentProduct = () => {
    if (products.length <= 1) {
      return;
    }

    revokePreviewUrl(currentProduct.imagePreviewUrl);
    setProducts((previousProducts) =>
      previousProducts.filter((_, index) => index !== currentIndex),
    );
    setCurrentIndex((previousIndex) => Math.min(previousIndex, products.length - 2));
    setIsCategoryOpen(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    // TODO: presigned URL 발급, storage PUT, 상품 payload submit 순서로 API 연동.
    navigate(MARKET_OWNER_ROUTES.home);
  };

  return (
    <main className={S.pageRootClassName}>
      <DesktopHeader currentLabel='오늘의 특가 상품 등록' parentLabel='홈' showSearchBar={false} />

      <form onSubmit={handleSubmit}>
        <section
          className={S.formContentClassName}
          aria-labelledby='today-special-registration-title'
        >
          <RegistrationTitleSection
            currentIndex={currentIndex}
            onNextProduct={handleNextProduct}
            onPreviousProduct={handlePreviousProduct}
            onRemoveCurrentProduct={handleRemoveCurrentProduct}
            productCount={products.length}
          />

          <div className={S.fieldSectionsClassName}>
            <ProductInfoSection
              isCategoryOpen={isCategoryOpen}
              onCategoryOpenChange={setIsCategoryOpen}
              onCategorySelect={handleCategorySelect}
              onDescriptionChange={handleDescriptionChange}
              onImageChange={handleImageChange}
              onNameChange={handleNameChange}
              product={currentProduct}
            />
            <ProductPriceSection
              onSalePriceChange={handlePriceChange('salePrice')}
              onSpecialPriceChange={handlePriceChange('specialPrice')}
              product={currentProduct}
            />
            <ProductPeriodSection
              onEndDateChange={handleFieldChange('endDate')}
              onStartDateChange={handleStartDateChange}
              product={currentProduct}
            />
          </div>

          <footer className={S.actionSectionClassName}>
            <Button
              className={S.actionButtonClassName}
              color='assistive'
              leftIcon={<IcCirclePlusSizeSmall />}
              onClick={handleAddProduct}
              size='small'
              variant='outlined'
            >
              상품 계속 등록
            </Button>
            <Button
              className={S.actionButtonClassName}
              disabled={isSubmitDisabled}
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
