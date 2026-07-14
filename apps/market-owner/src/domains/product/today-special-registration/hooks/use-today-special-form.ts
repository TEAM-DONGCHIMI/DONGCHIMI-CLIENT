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
  const [registeredProductCount, setRegisteredProductCount] = useState(0);

  const currentProduct = products[currentIndex] ?? createInitialProductForm();
  const currentProductErrors = errors.products?.[currentIndex] as
    | TodaySpecialProductErrorsTypes
    | undefined;
  const currentProductTouchedFields = touchedFields.products?.[currentIndex] as
    | TodaySpecialProductTouchedFieldsTypes
    | undefined;
  const isCurrentProductValid = todaySpecialProductFormSchema.safeParse(currentProduct).success;
  const hasUnregisteredDraft = products.length > registeredProductCount;
  const isRegisteredProduct = currentIndex < registeredProductCount;
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
    setRegisteredProductCount(currentProducts.length);
    setCurrentIndex(currentProducts.length);
  };

  const cancelCurrentDraft = () => {
    if (isRegisteredProduct || registeredProductCount === 0) {
      return;
    }

    const registeredProducts = getValues('products').slice(0, registeredProductCount);

    reset({ products: registeredProducts });
    setCurrentIndex(registeredProductCount - 1);
  };

  const moveToPreviousProduct = () => {
    setCurrentIndex((previousIndex) => Math.max(previousIndex - 1, 0));
  };

  const moveToNextProduct = () => {
    setCurrentIndex((previousIndex) => Math.min(previousIndex + 1, products.length - 1));
  };

  const openNextProductDraft = () => {
    if (hasUnregisteredDraft) {
      setCurrentIndex(products.length - 1);

      return;
    }

    const currentProducts = getValues('products');

    reset({ products: [...currentProducts, createInitialProductForm()] });
    setCurrentIndex(currentProducts.length);
  };

  return {
    canCancelCurrentDraft: hasUnregisteredDraft && !isRegisteredProduct && products.length > 1,
    cancelCurrentDraft,
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
    moveToNextProduct,
    moveToPreviousProduct,
    openNextProductDraft,
    products,
    resetForNextProduct,
    setValue,
  };
};
