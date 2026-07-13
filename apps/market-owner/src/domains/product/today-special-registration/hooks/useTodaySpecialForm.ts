import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { type FieldError, useFieldArray, useForm, useWatch } from 'react-hook-form';

import {
  createEmptyTodaySpecialProductForm,
  todaySpecialRegistrationFormSchema,
  type TodaySpecialProductFormTypes,
  type TodaySpecialRegistrationFormTypes,
} from '../model';

const createInitialProductForm = () => createEmptyTodaySpecialProductForm();

interface UseTodaySpecialFormParams {
  onSubmit: (values: TodaySpecialRegistrationFormTypes) => Promise<void> | void;
}

type TodaySpecialProductTouchedFieldsTypes = Partial<
  Record<keyof TodaySpecialProductFormTypes, boolean>
>;

type TodaySpecialProductErrorsTypes = Partial<
  Record<keyof TodaySpecialProductFormTypes, FieldError>
>;

export const useTodaySpecialForm = ({ onSubmit }: UseTodaySpecialFormParams) => {
  const {
    control,
    formState: { errors, isSubmitted, isSubmitting, isValid, touchedFields },
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
  const watchedProducts = useWatch({ control, name: 'products' });
  const products = watchedProducts ?? [];

  const currentProduct = products[currentIndex] ?? createInitialProductForm();
  const currentProductErrors = errors.products?.[currentIndex] as
    | TodaySpecialProductErrorsTypes
    | undefined;
  const currentProductTouchedFields = touchedFields.products?.[currentIndex] as
    | TodaySpecialProductTouchedFieldsTypes
    | undefined;
  const isSubmitDisabled = products.length === 0 || !isValid || isSubmitting;

  return {
    appendProduct: append,
    currentIndex,
    currentProduct,
    currentProductErrors,
    currentProductTouchedFields,
    handleFormSubmit: handleSubmit(onSubmit),
    isSubmitted,
    isSubmitting,
    isSubmitDisabled,
    products,
    removeProduct: remove,
    setCurrentIndex,
    setValue,
  };
};
