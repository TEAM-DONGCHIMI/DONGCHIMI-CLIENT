import type { ChangeEvent, FocusEvent } from 'react';
import type { FieldError, UseFormSetValue } from 'react-hook-form';

import { getVisibleFieldErrorMessage } from '@/shared/utils/form-error.utils';

import {
  formatPriceInput,
  limitProductDescriptionInput,
  limitProductNameInput,
  normalizeTodaySpecialStartDateInput,
  sanitizeProductDescription,
  sanitizeProductName,
  type TodaySpecialProductErrorMessageTypes,
  type TodaySpecialProductFormTypes,
  type TodaySpecialProductTextFieldTypes,
  type TodaySpecialRegistrationFormTypes,
} from '../model';

type TodaySpecialProductTextFieldPathTypes =
  `products.${number}.${TodaySpecialProductTextFieldTypes}`;

interface UseCurrentProductFieldParams {
  currentIndex: number;
  currentProductErrors?: Partial<Record<keyof TodaySpecialProductFormTypes, FieldError>>;
  currentProductTouchedFields?: Partial<Record<keyof TodaySpecialProductFormTypes, boolean>>;
  isSubmitted: boolean;
  setValue: UseFormSetValue<TodaySpecialRegistrationFormTypes>;
}

export const useCurrentProductField = ({
  currentIndex,
  currentProductErrors,
  currentProductTouchedFields,
  isSubmitted,
  setValue,
}: UseCurrentProductFieldParams) => {
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
    const error = currentProductErrors?.[field];
    const isTouched = Boolean(currentProductTouchedFields?.[field]);

    return getVisibleFieldErrorMessage({
      error,
      isSubmitted,
      isTouched,
    });
  };

  const productErrorMessages: TodaySpecialProductErrorMessageTypes = {
    category: getCurrentProductErrorMessage('category'),
    description: getCurrentProductErrorMessage('description'),
    name: getCurrentProductErrorMessage('name'),
    salePrice: getCurrentProductErrorMessage('salePrice'),
    specialPrice: getCurrentProductErrorMessage('specialPrice'),
    startDate: getCurrentProductErrorMessage('startDate'),
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

  const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateCurrentProductField('startDate', normalizeTodaySpecialStartDateInput(event.target.value));
  };

  const handleStartDateBlur = (event: FocusEvent<HTMLInputElement>) => {
    updateCurrentProductField(
      'startDate',
      normalizeTodaySpecialStartDateInput(event.target.value),
      {
        shouldTouch: true,
      },
    );
  };

  return {
    productInfoFieldProps: {
      onDescriptionBlur: handleDescriptionBlur,
      onDescriptionChange: handleDescriptionChange,
      onNameBlur: handleNameBlur,
      onNameChange: handleNameChange,
      productErrorMessages,
    },
    productPeriodFieldProps: {
      onStartDateBlur: handleStartDateBlur,
      onStartDateChange: handleStartDateChange,
      productErrorMessages,
    },
    productPriceFieldProps: {
      onSalePriceBlur: handleFieldBlur('salePrice'),
      onSalePriceChange: handlePriceChange('salePrice'),
      onSpecialPriceBlur: handleFieldBlur('specialPrice'),
      onSpecialPriceChange: handlePriceChange('specialPrice'),
      productErrorMessages,
    },
  };
};
