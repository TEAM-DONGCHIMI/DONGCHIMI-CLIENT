import { zodResolver } from '@hookform/resolvers/zod';
import { type ChangeEvent, type FocusEvent, useEffect, useRef, useState } from 'react';
import { type FieldError, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { Button } from '@dongchimi/design-system/components';
import { IcCirclePlusSizeSmall } from '@dongchimi/design-system/icons';

import { DesktopHeader } from '@/shared/components/ui/desktop-header/DesktopHeader';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

import {
  createEmptyTodaySpecialProductForm,
  formatPriceInput,
  isValidTodaySpecialImageFile,
  limitProductDescriptionInput,
  limitProductNameInput,
  resolveEndDateAfterStartDateChange,
  revokePreviewUrl,
  sanitizeProductDescription,
  sanitizeProductName,
  todaySpecialRegistrationFormSchema,
  type TodaySpecialProductErrorMessageTypes,
  type TodaySpecialProductForm,
  type TodaySpecialProductTextFieldTypes,
  type TodaySpecialRegistrationForm,
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
type TodaySpecialProductTextFieldPathTypes =
  `products.${number}.${TodaySpecialProductTextFieldTypes}`;

export const TodaySpecialRegistrationPage = () => {
  const navigate = useNavigate();
  const {
    control,
    formState: { errors, isSubmitted, isValid, touchedFields },
    handleSubmit,
    setValue,
  } = useForm<TodaySpecialRegistrationForm>({
    defaultValues: {
      products: [createInitialProductForm()],
    },
    mode: 'onChange',
    resolver: zodResolver(todaySpecialRegistrationFormSchema),
  });
  const { append, fields, remove } = useFieldArray({
    control,
    name: 'products',
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const products = useWatch({ control, name: 'products' });
  const productsRef = useRef<TodaySpecialProductForm[]>(products); // 이미지 preview 정리

  const currentProduct = products[currentIndex] ?? createInitialProductForm();
  const currentProductErrors = errors.products?.[currentIndex];
  const currentProductTouchedFields = touchedFields.products?.[currentIndex];
  const isSubmitDisabled = products.length === 0 || !isValid;

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

  const updateCurrentProductField = (
    field: TodaySpecialProductTextFieldTypes,
    value: string,
    options?: {
      shouldTouch?: boolean;
    },
  ) => {
    setValue(`products.${currentIndex}.${field}` as TodaySpecialProductTextFieldPathTypes, value, {
      shouldDirty: true,
      shouldTouch: options?.shouldTouch,
      shouldValidate: true,
    });
  };

  const getVisibleErrorMessage = (field: keyof TodaySpecialProductForm) => {
    const error = currentProductErrors?.[field] as FieldError | undefined;
    const isTouched = currentProductTouchedFields?.[field];

    return isSubmitted || isTouched ? error?.message : undefined;
  };

  const currentProductErrorMessages: TodaySpecialProductErrorMessageTypes = {
    category: getVisibleErrorMessage('category'),
    description: getVisibleErrorMessage('description'),
    endDate: getVisibleErrorMessage('endDate'),
    name: getVisibleErrorMessage('name'),
    salePrice: getVisibleErrorMessage('salePrice'),
    specialPrice: getVisibleErrorMessage('specialPrice'),
    startDate: getVisibleErrorMessage('startDate'),
  };

  const handleFieldChange =
    (field: TodaySpecialProductTextFieldTypes) => (event: ChangeEvent<HTMLInputElement>) => {
      updateCurrentProductField(field, event.target.value);
    };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateCurrentProductField('name', limitProductNameInput(event.target.value));
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateCurrentProductField('description', limitProductDescriptionInput(event.target.value));
  };

  const handleFieldBlur =
    (field: TodaySpecialProductTextFieldTypes) => (event: FocusEvent<HTMLInputElement>) => {
      updateCurrentProductField(field, event.target.value, { shouldTouch: true });
    };

  const handleNameBlur = (event: FocusEvent<HTMLInputElement>) => {
    updateCurrentProductField('name', sanitizeProductName(event.target.value), {
      shouldTouch: true,
    });
  };

  const handleDescriptionBlur = (event: FocusEvent<HTMLInputElement>) => {
    updateCurrentProductField('description', sanitizeProductDescription(event.target.value), {
      shouldTouch: true,
    });
  };

  const handlePriceChange =
    (field: Extract<TodaySpecialProductTextFieldTypes, 'salePrice' | 'specialPrice'>) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      updateCurrentProductField(field, formatPriceInput(event.target.value));
    };

  const handleCategoryOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setValue(`products.${currentIndex}.category`, currentProduct.category, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }

    setIsCategoryOpen(isOpen);
  };

  const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const startDate = event.target.value;

    setValue(`products.${currentIndex}.startDate`, startDate, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(
      `products.${currentIndex}.endDate`,
      resolveEndDateAfterStartDateChange(startDate, currentProduct.endDate),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
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
    setValue(`products.${currentIndex}.imageFile`, file, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(`products.${currentIndex}.imagePreviewUrl`, previewUrl, {
      shouldDirty: true,
    });
  };

  const handleCategorySelect = (category: string) => {
    setValue(`products.${currentIndex}.category`, category, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setIsCategoryOpen(false);
  };

  const handleAddProduct = () => {
    append(createInitialProductForm());
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
    remove(currentIndex);
    setCurrentIndex((previousIndex) => Math.min(previousIndex, products.length - 2));
    setIsCategoryOpen(false);
  };

  const handleFormSubmit = handleSubmit(() => {
    // TODO: presigned URL 발급, storage PUT, 상품 payload submit 순서로 API 연동.
    navigate(MARKET_OWNER_ROUTES.home);
  });

  return (
    <main className={S.pageRootClassName}>
      <DesktopHeader currentLabel='오늘의 특가 상품 등록' parentLabel='홈' showSearchBar={false} />

      <form onSubmit={handleFormSubmit}>
        <section
          className={S.formContentClassName}
          aria-labelledby='today-special-registration-title'
        >
          <RegistrationTitleSection
            currentIndex={currentIndex}
            onNextProduct={handleNextProduct}
            onPreviousProduct={handlePreviousProduct}
            onRemoveCurrentProduct={handleRemoveCurrentProduct}
            productCount={fields.length}
          />

          <div className={S.fieldSectionsClassName}>
            <ProductInfoSection
              isCategoryOpen={isCategoryOpen}
              onCategoryOpenChange={handleCategoryOpenChange}
              onCategorySelect={handleCategorySelect}
              onDescriptionBlur={handleDescriptionBlur}
              onDescriptionChange={handleDescriptionChange}
              onImageChange={handleImageChange}
              onNameBlur={handleNameBlur}
              onNameChange={handleNameChange}
              product={currentProduct}
              productErrorMessages={currentProductErrorMessages}
            />
            <ProductPriceSection
              onSalePriceBlur={handleFieldBlur('salePrice')}
              onSalePriceChange={handlePriceChange('salePrice')}
              onSpecialPriceBlur={handleFieldBlur('specialPrice')}
              onSpecialPriceChange={handlePriceChange('specialPrice')}
              product={currentProduct}
              productErrorMessages={currentProductErrorMessages}
            />
            <ProductPeriodSection
              onEndDateBlur={handleFieldBlur('endDate')}
              onEndDateChange={handleFieldChange('endDate')}
              onStartDateBlur={handleFieldBlur('startDate')}
              onStartDateChange={handleStartDateChange}
              product={currentProduct}
              productErrorMessages={currentProductErrorMessages}
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
