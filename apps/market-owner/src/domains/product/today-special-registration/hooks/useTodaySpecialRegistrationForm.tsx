import { zodResolver } from '@hookform/resolvers/zod';
import {
  type CSSProperties,
  type ChangeEvent,
  type FocusEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { type FieldError, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { overlay } from 'overlay-kit';

import { Dropdown } from '@dongchimi/design-system/components';

import { getVisibleFieldErrorMessage } from '@/shared/utils/form-error.utils';

import { todaySpecialCategoryOptions } from '../fixtures';
import {
  createEmptyTodaySpecialProductForm,
  formatPriceInput,
  isValidTodaySpecialImageFile,
  limitProductDescriptionInput,
  limitProductNameInput,
  revokePreviewUrl,
  sanitizeProductDescription,
  sanitizeProductName,
  todaySpecialRegistrationFormSchema,
  type TodaySpecialProductErrorMessageTypes,
  type TodaySpecialProductFormTypes,
  type TodaySpecialProductTextFieldTypes,
  type TodaySpecialRegistrationFormTypes,
} from '../model';
import * as S from '../TodaySpecialRegistrationPage.css';

// 새 상품 등록시 빈 form 생성
const createInitialProductForm = () => createEmptyTodaySpecialProductForm();
const categoryDropdownId = 'today-special-product-category-dropdown';
const categoryOverlayId = 'today-special-product-category-dropdown-overlay';

type TodaySpecialProductTextFieldPathTypes =
  `products.${number}.${TodaySpecialProductTextFieldTypes}`;

interface UseTodaySpecialRegistrationFormParams {
  onSubmit: () => void;
}

export const useTodaySpecialRegistrationForm = ({
  onSubmit,
}: UseTodaySpecialRegistrationFormParams) => {
  const {
    control,
    formState: { errors, isSubmitted, isValid, touchedFields },
    handleSubmit,
    setValue,
  } = useForm<TodaySpecialRegistrationFormTypes>({
    defaultValues: {
      products: [createInitialProductForm()],
    },
    mode: 'onChange',
    resolver: zodResolver(todaySpecialRegistrationFormSchema),
  });
  const { append, remove } = useFieldArray({
    control,
    name: 'products',
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const products = useWatch({ control, name: 'products' });
  const categoryTriggerRef = useRef<HTMLButtonElement>(null);
  const productsRef = useRef<TodaySpecialProductFormTypes[]>(products); // 이미지 preview 정리

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
      overlay.close(categoryOverlayId);
      overlay.unmount(categoryOverlayId);
    };
  }, []);

  // 현재 상품의 단일 필드 값을 RHF 상태에 반영
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

  // touched/submitted 상태를 기준으로 현재 상품 필드의 에러 메시지를 계산
  const getCurrentProductErrorMessage = (field: keyof TodaySpecialProductFormTypes) => {
    const error = currentProductErrors?.[field] as FieldError | undefined;
    const isTouched = currentProductTouchedFields?.[field];

    return getVisibleFieldErrorMessage({
      error,
      isSubmitted,
      isTouched,
    });
  };

  const currentProductErrorMessages: TodaySpecialProductErrorMessageTypes = {
    category: getCurrentProductErrorMessage('category'),
    description: getCurrentProductErrorMessage('description'),
    name: getCurrentProductErrorMessage('name'),
    salePrice: getCurrentProductErrorMessage('salePrice'),
    specialPrice: getCurrentProductErrorMessage('specialPrice'),
    startDate: getCurrentProductErrorMessage('startDate'),
  };

  // 일반 텍스트 필드 변경값을 저장
  const handleFieldChange =
    (field: TodaySpecialProductTextFieldTypes) => (event: ChangeEvent<HTMLInputElement>) => {
      updateCurrentProductField(field, event.target.value);
    };

  // 상품명은 입력 중 최대 글자 수만 제한
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateCurrentProductField('name', limitProductNameInput(event.target.value));
  };

  // 홍보문구는 입력 중 최대 글자 수만 제한
  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateCurrentProductField('description', limitProductDescriptionInput(event.target.value));
  };

  // blur 시 필드를 touched 처리해 에러 메시지 노출 기준에 포함
  const handleFieldBlur =
    (field: TodaySpecialProductTextFieldTypes) => (event: FocusEvent<HTMLInputElement>) => {
      updateCurrentProductField(field, event.target.value, { shouldTouch: true });
    };

  // 상품명은 blur 시 앞뒤 공백을 정리
  const handleNameBlur = (event: FocusEvent<HTMLInputElement>) => {
    updateCurrentProductField('name', sanitizeProductName(event.target.value), {
      shouldTouch: true,
    });
  };

  // 홍보문구는 blur 시 앞뒤 공백을 정리
  const handleDescriptionBlur = (event: FocusEvent<HTMLInputElement>) => {
    updateCurrentProductField('description', sanitizeProductDescription(event.target.value), {
      shouldTouch: true,
    });
  };

  // 가격 필드는 숫자만 남기고 천 단위 콤마를 표시
  const handlePriceChange =
    (field: Extract<TodaySpecialProductTextFieldTypes, 'salePrice' | 'specialPrice'>) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      updateCurrentProductField(field, formatPriceInput(event.target.value));
    };

  // 선택한 카테고리를 현재 상품 form 값에 반영
  const handleCategorySelect = useCallback(
    (category: string) => {
      setValue(`products.${currentIndex}.category`, category, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [currentIndex, setValue],
  );

  const getCategoryDropdownOverlayStyle = () => {
    const triggerRect = categoryTriggerRef.current?.getBoundingClientRect();

    return {
      '--today-special-category-dropdown-left': `${triggerRect?.left ?? 0}px`,
      '--today-special-category-dropdown-top': `${(triggerRect?.bottom ?? 0) + 8}px`,
    } as CSSProperties;
  };

  // OverlayKit에 등록한 카테고리 드롭다운을 닫고 필요하면 category를 touched 처리
  const closeCategoryDropdown = useCallback(
    (shouldTouchCategory = true) => {
      if (!isCategoryOpen) {
        return;
      }

      overlay.close(categoryOverlayId);
      overlay.unmount(categoryOverlayId);
      setIsCategoryOpen(false);

      if (shouldTouchCategory) {
        setValue(`products.${currentIndex}.category`, currentProduct.category, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      }
    },
    [currentIndex, currentProduct.category, isCategoryOpen, setValue],
  );

  // Trigger 위치 기준으로 OverlayKit에 실제 Dropdown UI를 렌더링
  const openCategoryDropdown = () => {
    setIsCategoryOpen(true);

    overlay.open(
      ({ close, unmount }) => (
        <div
          className={S.categoryDropdownOverlayClassName}
          data-today-special-category-overlay
          style={getCategoryDropdownOverlayStyle()}
        >
          <Dropdown className={S.categoryDropdownClassName} id={categoryDropdownId}>
            {todaySpecialCategoryOptions.map((category) => (
              <Dropdown.Item
                checkbox={false}
                className={S.categoryDropdownItemClassName}
                color='primary'
                key={category}
                onClick={() => {
                  handleCategorySelect(category);
                  close();
                  unmount();
                  setIsCategoryOpen(false);
                }}
                selected={category === currentProduct.category}
              >
                {category}
              </Dropdown.Item>
            ))}
          </Dropdown>
        </div>
      ),
      { overlayId: categoryOverlayId },
    );
  };

  useEffect(() => {
    if (!isCategoryOpen) {
      return;
    }

    const closeCategoryDropdownOnPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement;

      if (
        !target.closest('[data-today-special-category-overlay]') &&
        !target.closest('[data-today-special-category-trigger]')
      ) {
        closeCategoryDropdown();
      }
    };

    const closeCategoryDropdownOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCategoryDropdown();
      }
    };

    document.addEventListener('pointerdown', closeCategoryDropdownOnPointerDown);
    document.addEventListener('keydown', closeCategoryDropdownOnEscape);

    return () => {
      document.removeEventListener('pointerdown', closeCategoryDropdownOnPointerDown);
      document.removeEventListener('keydown', closeCategoryDropdownOnEscape);
    };
  }, [closeCategoryDropdown, isCategoryOpen]);

  // Trigger 클릭시 OverlayKit Dropdown을 열거나 닫기
  const handleCategoryTriggerClick = () => {
    if (isCategoryOpen) {
      closeCategoryDropdown();
      return;
    }

    openCategoryDropdown();
  };

  // 이미지 파일을 검증하고 미리보기 object URL을 생성
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

  // 새 빈 상품 draft를 추가하고 해당 draft로 이동
  const handleAddProduct = () => {
    append(createInitialProductForm());
    setCurrentIndex(products.length);
    closeCategoryDropdown();
  };

  // 이전 상품 draft로 이동
  const handlePreviousProduct = () => {
    setCurrentIndex((previousIndex) => Math.max(previousIndex - 1, 0));
    closeCategoryDropdown();
  };

  // 다음 상품 draft로 이동
  const handleNextProduct = () => {
    setCurrentIndex((previousIndex) => Math.min(previousIndex + 1, products.length - 1));
    closeCategoryDropdown();
  };

  // 현재 상품 draft를 제거하고 연결된 이미지 preview URL을 정리
  const handleRemoveCurrentProduct = () => {
    if (products.length <= 1) {
      return;
    }

    revokePreviewUrl(currentProduct.imagePreviewUrl);
    remove(currentIndex);
    setCurrentIndex((previousIndex) => Math.min(previousIndex, products.length - 2));
    closeCategoryDropdown();
  };

  return {
    actionSectionProps: {
      isSubmitDisabled,
      onAddProduct: handleAddProduct,
    },
    handleFormSubmit: handleSubmit(onSubmit),
    productInfoSectionProps: {
      categoryDropdownId,
      categoryTriggerRef,
      isCategoryOpen,
      onCategoryTriggerClick: handleCategoryTriggerClick,
      onDescriptionBlur: handleDescriptionBlur,
      onDescriptionChange: handleDescriptionChange,
      onImageChange: handleImageChange,
      onNameBlur: handleNameBlur,
      onNameChange: handleNameChange,
      product: currentProduct,
      productErrorMessages: currentProductErrorMessages,
    },
    productPeriodSectionProps: {
      onStartDateBlur: handleFieldBlur('startDate'),
      onStartDateChange: handleFieldChange('startDate'),
      product: currentProduct,
      productErrorMessages: currentProductErrorMessages,
    },
    productPriceSectionProps: {
      onSalePriceBlur: handleFieldBlur('salePrice'),
      onSalePriceChange: handlePriceChange('salePrice'),
      onSpecialPriceBlur: handleFieldBlur('specialPrice'),
      onSpecialPriceChange: handlePriceChange('specialPrice'),
      product: currentProduct,
      productErrorMessages: currentProductErrorMessages,
    },
    titleSectionProps: {
      currentIndex,
      onNextProduct: handleNextProduct,
      onPreviousProduct: handlePreviousProduct,
      onRemoveCurrentProduct: handleRemoveCurrentProduct,
      productCount: products.length,
    },
  };
};
