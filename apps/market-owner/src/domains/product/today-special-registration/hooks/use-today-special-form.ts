import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState, type BaseSyntheticEvent } from 'react';
import { type FieldError, useForm, useWatch } from 'react-hook-form';

import {
  createEmptyTodaySpecialProductForm,
  todaySpecialProductFormSchema,
  todaySpecialRegistrationFormSchema,
  type TodaySpecialProductFormTypes,
  type TodaySpecialRegistrationFormTypes,
} from '../model';

const createInitialProductForm = () => createEmptyTodaySpecialProductForm();

type TodaySpecialProductTouchedFieldsTypes = Partial<
  Record<keyof TodaySpecialProductFormTypes, boolean>
>;

type TodaySpecialProductErrorsTypes = Partial<
  Record<keyof TodaySpecialProductFormTypes, FieldError>
>;

interface UpdateRegisteredProductParams {
  product: TodaySpecialProductFormTypes;
  productId: number;
  thumbnailUrl: string | null;
}

interface ResetForNextProductParams {
  previewUrl: string | null;
  productId: number;
  thumbnailUrl: string;
}

export const useTodaySpecialForm = () => {
  const {
    control,
    formState: { errors, touchedFields },
    getValues,
    reset,
    setValue,
    trigger,
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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

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
  const isSubmitDisabled = !isCurrentProductValid || isSubmitting;

  const createCurrentProductSubmitHandler =
    (onValid: (product: TodaySpecialProductFormTypes) => Promise<void> | void) =>
    async (event?: BaseSyntheticEvent) => {
      event?.preventDefault();

      if (isSubmittingRef.current) {
        return;
      }

      isSubmittingRef.current = true;
      setIsSubmitting(true);
      setIsSubmitted(true);

      try {
        const isValid = await trigger(`products.${currentIndex}`);

        if (!isValid) {
          return;
        }

        const submittedProduct = getValues(`products.${currentIndex}`);

        await onValid(submittedProduct);
      } finally {
        isSubmittingRef.current = false;
        setIsSubmitting(false);
      }
    };

  const resetForNextProduct = ({
    previewUrl,
    productId,
    thumbnailUrl,
  }: ResetForNextProductParams) => {
    const currentProducts = getValues('products');
    const registeredProducts = currentProducts.map((product, productIndex) =>
      productIndex === currentIndex
        ? {
            ...product,
            imageFile: null,
            imagePreviewUrl: previewUrl ?? thumbnailUrl,
            productId,
            thumbnailUrl,
          }
        : product,
    );

    reset({ products: [...registeredProducts, createInitialProductForm()] });
    setIsSubmitted(false);
    setRegisteredProductCount(registeredProducts.length);
    setCurrentIndex(registeredProducts.length);
  };

  const updateRegisteredProduct = ({
    product,
    productId,
    thumbnailUrl,
  }: UpdateRegisteredProductParams) => {
    const currentProducts = getValues('products');
    const targetIndex = currentProducts.findIndex((item) => item.productId === productId);

    if (targetIndex < 0 || targetIndex >= registeredProductCount) {
      return false;
    }

    const updatedProducts = currentProducts.map((item, productIndex) =>
      productIndex === targetIndex
        ? {
            ...product,
            imageFile: null,
            imagePreviewUrl: product.imagePreviewUrl ?? thumbnailUrl,
            productId,
            thumbnailUrl,
          }
        : item,
    );

    reset({ products: updatedProducts });
    setIsSubmitted(false);

    return true;
  };

  const deleteRegisteredProduct = (productId: number) => {
    const currentProducts = getValues('products');
    const targetIndex = currentProducts.findIndex((product) => product.productId === productId);

    if (targetIndex < 0 || targetIndex >= registeredProductCount) {
      return false;
    }

    const remainingProducts = currentProducts.filter(
      (_, productIndex) => productIndex !== targetIndex,
    );
    const nextProducts =
      remainingProducts.length > 0 ? remainingProducts : [createInitialProductForm()];

    reset({ products: nextProducts });
    setIsSubmitted(false);
    setRegisteredProductCount((previousCount) => Math.max(previousCount - 1, 0));
    setCurrentIndex((previousIndex) => {
      if (previousIndex > targetIndex) {
        return previousIndex - 1;
      }

      if (previousIndex === targetIndex) {
        return Math.min(targetIndex, nextProducts.length - 1);
      }

      return previousIndex;
    });

    return true;
  };

  const cancelCurrentDraft = () => {
    if (isRegisteredProduct || registeredProductCount === 0) {
      return;
    }

    const registeredProducts = getValues('products').slice(0, registeredProductCount);

    reset({ products: registeredProducts });
    setIsSubmitted(false);
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
    setIsSubmitted(false);
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
    deleteRegisteredProduct,
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
    updateRegisteredProduct,
  };
};
