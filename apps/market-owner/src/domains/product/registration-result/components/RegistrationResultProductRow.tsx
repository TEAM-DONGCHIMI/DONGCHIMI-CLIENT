import {
  useRef,
  type ChangeEvent,
  type ChangeEventHandler,
  type FocusEventHandler,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { ListCell, type ListCellFieldProps } from '@dongchimi/design-system/components';
import {
  IcChevronDownSizeSmall,
  IcCircleExclamationSizeXsmallColor60,
  IcPlus,
} from '@dongchimi/design-system/icons';

import type { RegistrationResultProduct } from '../fixtures';
import type { RegistrationResultEditableProductFieldTypes } from '../hooks/useRegistrationResultProductDrafts';
import {
  getRegistrationResultFieldBlurValue,
  getRegistrationResultFieldInputValue,
  type RegistrationResultProductFieldErrorTypes,
  type RegistrationResultProductFieldValues,
} from '../utils/registration-result-product-validation';
import * as S from './RegistrationResult.css';

export interface ImagePreview {
  alt: string;
  src: string;
}

interface RegistrationResultProductRowProps {
  checked: boolean;
  fieldErrors: RegistrationResultProductFieldErrorTypes;
  fieldValues: RegistrationResultProductFieldValues;
  imagePreview?: ImagePreview;
  product: RegistrationResultProduct;
  onCategoryClick: (event: MouseEvent<HTMLButtonElement>) => void;
  onCheckedChange: (checked: boolean) => void;
  onFieldChange: (field: RegistrationResultEditableProductFieldTypes, value: string) => void;
  onImageFileChange: (file: File) => void;
}

interface ProductFieldParams {
  fieldErrors: RegistrationResultProductFieldErrorTypes;
  fieldValues: RegistrationResultProductFieldValues;
  productId: string;
  productLabel: string;
  onCategoryClick: (event: MouseEvent<HTMLButtonElement>) => void;
  onFieldChange: (field: RegistrationResultEditableProductFieldTypes, value: string) => void;
}

const ProductPreview = ({ productName }: { productName: string }) => {
  return (
    <span aria-hidden='true' className={S.productPreviewClassName}>
      {productName.slice(0, 1)}
    </span>
  );
};

const getProductStatusViewModel = (product: RegistrationResultProduct) => {
  if (product.status !== 'needsEdit') {
    return {
      helperIcon: undefined,
      helperText: undefined,
      statusLabel: '등록 완료',
      statusTone: 'neutral' as const,
    };
  }

  return {
    helperIcon: <IcCircleExclamationSizeXsmallColor60 />,
    helperText: product.statusReason,
    statusLabel: '수정 필요',
    statusTone: 'negative' as const,
  };
};

const getImageAlt = ({
  imagePreview,
  product,
  productLabel,
}: {
  imagePreview?: ImagePreview;
  product: RegistrationResultProduct;
  productLabel: string;
}) => {
  if (imagePreview != null) {
    return imagePreview.alt;
  }

  return product.imageAlt ?? productLabel;
};

const getProductImageSrc = (productImage: ImagePreview | string) => {
  if (typeof productImage === 'string') {
    return productImage;
  }

  return productImage.src;
};

const getPriceUnit = (price: string) => {
  if (price.length === 0) {
    return undefined;
  }

  return '원';
};

const getMediaActionViewModel = ({
  hasProductImage,
  needsEdit,
}: {
  hasProductImage: boolean;
  needsEdit: boolean;
}) => {
  if (!needsEdit || hasProductImage) {
    return {
      icon: undefined,
      label: undefined,
      status: 'default' as const,
    };
  }

  return {
    icon: <IcPlus />,
    label: '이미지 추가',
    status: 'error' as const,
  };
};

const getFieldChangeHandler = (
  field: RegistrationResultEditableProductFieldTypes,
  onFieldChange: ProductFieldParams['onFieldChange'],
): ChangeEventHandler<HTMLInputElement> => {
  return (event) => {
    const nextValue = getRegistrationResultFieldInputValue(field, event.currentTarget.value);

    onFieldChange(field, nextValue);
  };
};

const getFieldBlurHandler = (
  field: RegistrationResultEditableProductFieldTypes,
  onFieldChange: ProductFieldParams['onFieldChange'],
): FocusEventHandler<HTMLInputElement> => {
  return (event) => {
    const nextValue = getRegistrationResultFieldBlurValue(field, event.currentTarget.value);

    if (nextValue !== event.currentTarget.value) {
      onFieldChange(field, nextValue);
    }
  };
};

const getFieldValidationProps = (
  errorMessage: string | undefined,
  options: { singleLine?: boolean } = {},
) => {
  if (errorMessage == null) {
    return { status: 'default' as const };
  }

  return {
    errorMessage: options.singleLine ? (
      <span className={S.singleLineFieldErrorClassName}>{errorMessage}</span>
    ) : (
      errorMessage
    ),
    status: 'error' as const,
  };
};

const getProductFields = ({
  fieldErrors,
  fieldValues,
  productId,
  productLabel,
  onCategoryClick,
  onFieldChange,
}: ProductFieldParams): readonly ListCellFieldProps[] => {
  return [
    {
      ...getFieldValidationProps(fieldErrors.productName),
      id: `${productId}-name`,
      onBlur: getFieldBlurHandler('productName', onFieldChange),
      onChange: getFieldChangeHandler('productName', onFieldChange),
      placeholder: '제품명을 입력하세요.',
      value: fieldValues.productName,
      width: '16rem',
    },
    {
      ...getFieldValidationProps(fieldErrors.price, { singleLine: true }),
      id: `${productId}-price`,
      inputMode: 'numeric',
      onChange: getFieldChangeHandler('price', onFieldChange),
      placeholder: '가격을 입력하세요.',
      unit: getPriceUnit(fieldValues.price),
      value: fieldValues.price,
      width: '11.2rem',
    },
    {
      'aria-label': `${productLabel} 카테고리 선택`,
      id: `${productId}-category`,
      onClick: onCategoryClick,
      trailingIcon: <IcChevronDownSizeSmall />,
      value: fieldValues.category,
      width: '12.8rem',
    },
    {
      ...getFieldValidationProps(fieldErrors.promotionText),
      id: `${productId}-promotion`,
      onBlur: getFieldBlurHandler('promotionText', onFieldChange),
      onChange: getFieldChangeHandler('promotionText', onFieldChange),
      placeholder: '홍보문구를 입력하세요.',
      value: fieldValues.promotionText,
      width: '31.9rem',
    },
    {
      ...getFieldValidationProps(fieldErrors.discountPeriod),
      'aria-label': `${productLabel} 할인 기간 입력`,
      id: `${productId}-discount-period`,
      inputMode: 'numeric',
      onChange: getFieldChangeHandler('discountPeriod', onFieldChange),
      placeholder: 'YYYY-MM-DD ~  YYYY-MM-DD',
      value: fieldValues.discountPeriod,
      width: '19.8rem',
    },
  ];
};

export const RegistrationResultProductRow = ({
  checked,
  fieldErrors,
  fieldValues,
  imagePreview,
  product,
  onCategoryClick,
  onCheckedChange,
  onFieldChange,
  onImageFileChange,
}: RegistrationResultProductRowProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const needsEdit = product.status === 'needsEdit';
  const productLabel = fieldValues.productName || product.productName || '상품';
  const productImage = imagePreview ?? product.imageUrl;
  const hasProductImage = productImage != null;
  const statusViewModel = getProductStatusViewModel(product);
  const mediaActionViewModel = getMediaActionViewModel({ hasProductImage, needsEdit });
  const productFields = getProductFields({
    fieldErrors,
    fieldValues,
    productId: product.id,
    productLabel,
    onCategoryClick,
    onFieldChange,
  });
  const openImageFileDialog = () => {
    fileInputRef.current?.click();
  };
  let media: ReactNode = undefined;

  if (!hasProductImage && !needsEdit) {
    media = <ProductPreview productName={fieldValues.productName || product.productName} />;
  }

  if (hasProductImage) {
    const imageSrc = getProductImageSrc(productImage);
    const imageAlt = getImageAlt({ imagePreview, product, productLabel });

    media = (
      <button
        aria-label={`${productLabel} 이미지 변경`}
        className={S.uploadedImageButtonClassName}
        onClick={openImageFileDialog}
        type='button'
      >
        <img alt={imageAlt} className={S.uploadedProductImageClassName} src={imageSrc} />
      </button>
    );
  }

  const handleImageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (file != null) {
      onImageFileChange(file);
    }

    event.currentTarget.value = '';
  };

  return (
    <>
      <ListCell
        aria-label={`${productLabel} 등록 결과`}
        checked={checked}
        checkboxLabel={`${productLabel} 선택`}
        className={S.productRowClassName}
        fields={productFields}
        helperIcon={statusViewModel.helperIcon}
        helperText={statusViewModel.helperText}
        media={media}
        mediaActionAriaLabel={`${productLabel} 이미지 추가`}
        mediaActionIcon={mediaActionViewModel.icon}
        mediaActionLabel={mediaActionViewModel.label}
        mediaStatus={mediaActionViewModel.status}
        onCheckedChange={onCheckedChange}
        onMediaAction={openImageFileDialog}
        statusLabel={statusViewModel.statusLabel}
        statusTone={statusViewModel.statusTone}
      />
      <input
        ref={fileInputRef}
        accept='image/*'
        aria-label={`${productLabel} 이미지 파일 선택`}
        className={S.hiddenFileInputClassName}
        onChange={handleImageInputChange}
        type='file'
      />
    </>
  );
};
