export const productNameMaxLength = 15;
export const productPromotionTextMaxLength = 25;

export const limitProductNameInput = (value: string) => {
  return value.slice(0, productNameMaxLength);
};

export const limitProductPromotionTextInput = (value: string) => {
  return value.slice(0, productPromotionTextMaxLength);
};

export const formatProductPriceInput = (value: string) => {
  const digits = value.replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  return Number(digits).toLocaleString('ko-KR');
};

export const sanitizeProductName = (value: string) => {
  return limitProductNameInput(value.trim());
};

export const sanitizeProductPromotionText = (value: string) => {
  return limitProductPromotionTextInput(value.trim());
};
