import {
  useRef,
  type ChangeEvent,
  type ChangeEventHandler,
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
import * as S from './RegistrationResult.css';

export interface ImagePreview {
  alt: string;
  src: string;
}

export interface RegistrationResultProductFieldValues {
  category: string;
  discountPeriod: string;
  price: string;
  productName: string;
  promotionText: string;
}

interface RegistrationResultProductRowProps {
  checked: boolean;
  fieldValues: RegistrationResultProductFieldValues;
  imagePreview?: ImagePreview;
  product: RegistrationResultProduct;
  onCategoryClick: (event: MouseEvent<HTMLButtonElement>) => void;
  onCheckedChange: (checked: boolean) => void;
  onFieldChange: (field: RegistrationResultEditableProductFieldTypes, value: string) => void;
  onImageFileChange: (file: File) => void;
}

interface ProductFieldParams {
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

const formatDateDigits = (value: string) => {
  if (value.length <= 4) {
    return value;
  }

  if (value.length <= 6) {
    return `${value.slice(0, 4)}-${value.slice(4)}`;
  }

  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
};

export const formatDiscountPeriodInput = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  const startDate = formatDateDigits(digits.slice(0, 8));
  const endDate = formatDateDigits(digits.slice(8, 16));

  if (endDate.length === 0) {
    return startDate;
  }

  return `${startDate} ~ ${endDate}`;
};

const getNextFieldValue = (field: RegistrationResultEditableProductFieldTypes, value: string) => {
  if (field === 'discountPeriod') {
    return formatDiscountPeriodInput(value);
  }

  return value;
};

const getFieldChangeHandler = (
  field: RegistrationResultEditableProductFieldTypes,
  onFieldChange: ProductFieldParams['onFieldChange'],
): ChangeEventHandler<HTMLInputElement> => {
  return (event) => {
    const nextValue = getNextFieldValue(field, event.currentTarget.value);

    onFieldChange(field, nextValue);
  };
};

const getProductFields = ({
  fieldValues,
  productId,
  productLabel,
  onCategoryClick,
  onFieldChange,
}: ProductFieldParams): readonly ListCellFieldProps[] => {
  return [
    {
      id: `${productId}-name`,
      onChange: getFieldChangeHandler('productName', onFieldChange),
      placeholder: '제품명을 입력하세요.',
      value: fieldValues.productName,
      width: '16rem',
    },
    {
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
      id: `${productId}-promotion`,
      onChange: getFieldChangeHandler('promotionText', onFieldChange),
      placeholder: '홍보문구를 입력하세요.',
      value: fieldValues.promotionText,
      width: '31.9rem',
    },
    {
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
