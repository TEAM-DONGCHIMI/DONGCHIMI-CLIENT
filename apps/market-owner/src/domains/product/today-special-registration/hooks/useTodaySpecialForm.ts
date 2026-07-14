import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { type FieldError, useForm, useWatch } from 'react-hook-form';

import {
  createEmptyTodaySpecialProductForm,
  todaySpecialProductFormSchema,
  todaySpecialRegistrationFormSchema,
  type TodaySpecialProductFormTypes,
  type TodaySpecialRegistrationFormTypes,
} from '../model';

const createInitialProductForm = () => createEmptyTodaySpecialProductForm();

interface UseTodaySpecialFormParams {
  onSubmit: (product: TodaySpecialProductFormTypes) => Promise<void> | void;
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
    formState: { errors, isSubmitted, isSubmitting, touchedFields },
    handleSubmit,
    getValues,
    reset,
    setValue,
  } = useForm<TodaySpecialRegistrationFormTypes>({
    defaultValues: {
      products: [createInitialProductForm()],
    },
    mode: 'onChange',
    resolver: zodResolver(todaySpecialRegistrationFormSchema),
  });
  const watchedProducts = useWatch({ control, name: 'products' });
  const products = watchedProducts ?? [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentProduct = products[currentIndex] ?? createInitialProductForm();
  const currentProductErrors = errors.products?.[currentIndex] as
    | TodaySpecialProductErrorsTypes
    | undefined;
  const currentProductTouchedFields = touchedFields.products?.[currentIndex] as
    | TodaySpecialProductTouchedFieldsTypes
    | undefined;
  const isCurrentProductValid = todaySpecialProductFormSchema.safeParse(currentProduct).success;
  const isRegisteredProduct = currentIndex < products.length - 1;
  const isSubmitDisabled = isRegisteredProduct || !isCurrentProductValid || isSubmitting;

  const createCurrentProductSubmitHandler = (
    onValid: (product: TodaySpecialProductFormTypes) => Promise<void> | void,
  ) =>
    handleSubmit(async ({ products: submittedProducts }) => {
      const submittedProduct = submittedProducts[currentIndex];

      if (submittedProduct) {
        await onValid(submittedProduct);
      }
    });

  const resetForNextProduct = () => {
    const currentProducts = getValues('products');

    reset({ products: [...currentProducts, createInitialProductForm()] });
    setCurrentIndex(currentProducts.length);
  };

  const moveToPreviousProduct = () => {
    setCurrentIndex((previousIndex) => Math.max(previousIndex - 1, 0));
  };

  const moveToNextProduct = () => {
    setCurrentIndex((previousIndex) => Math.min(previousIndex + 1, products.length - 1));
  };

  const moveToLatestProduct = () => {
    setCurrentIndex(products.length - 1);
  };

  return {
    createCurrentProductSubmitHandler,
    currentIndex,
    currentProduct,
    currentProductErrors,
    currentProductTouchedFields,
    handleFormSubmit: createCurrentProductSubmitHandler(onSubmit),
    isSubmitted,
    isSubmitting,
    isRegisteredProduct,
    isSubmitDisabled,
    moveToLatestProduct,
    moveToNextProduct,
    moveToPreviousProduct,
    products,
    resetForNextProduct,
    setValue,
  };
};
