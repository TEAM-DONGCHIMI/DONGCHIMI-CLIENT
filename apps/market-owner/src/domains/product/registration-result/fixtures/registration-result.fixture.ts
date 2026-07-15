export type RegistrationResultProductStatusTypes = 'completed' | 'needsEdit';

export interface RegistrationResultProduct {
  category: string;
  discountPeriod: string;
  id: string;
  imageAlt?: string;
  imageUrl?: string;
  price: string;
  productName: string;
  promotionText: string;
  status: RegistrationResultProductStatusTypes;
  statusReason?: string;
}

interface RegistrationResultProductImageFixture {
  imageAlt?: string;
  imageUrl?: string;
}

const existingProductImageFixture: RegistrationResultProductImageFixture = {
  imageAlt: '등록된 상품 이미지',
  imageUrl:
    'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2264%22 height=%2264%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 rx=%228%22 fill=%22%23E5F7EF%22/%3E%3Cpath d=%22M18 43h28L36 28l-7 9-4-5-7 11Z%22 fill=%22%2324C383%22/%3E%3Ccircle cx=%2223%22 cy=%2222%22 r=%224%22 fill=%22%2324C383%22/%3E%3C/svg%3E',
};

const getNeedsEditProductImageFixture = (index: number): RegistrationResultProductImageFixture => {
  if (index !== 0) {
    return {};
  }

  return existingProductImageFixture;
};

const completedProducts: RegistrationResultProduct[] = [
  {
    category: '가공식품',
    discountPeriod: '2026-07-06 ~ 2026-07-12',
    id: 'completed-001',
    price: '12,900',
    productName: '전라도 포기김치 3kg',
    promotionText: '오늘만 특가로 준비했어요',
    status: 'completed',
  },
  {
    category: '정육/달걀',
    discountPeriod: '2026-07-06 ~ 2026-07-10',
    id: 'completed-002',
    price: '8,900',
    productName: '한돈 앞다리살 600g',
    promotionText: '구이와 찌개에 모두 좋아요',
    status: 'completed',
  },
  {
    category: '채소/과일',
    discountPeriod: '2026-07-07 ~ 2026-07-12',
    id: 'completed-003',
    price: '2,980',
    productName: '햇감자 1봉',
    promotionText: '포슬포슬한 제철 감자',
    status: 'completed',
  },
  {
    category: '수산물',
    discountPeriod: '2026-07-08 ~ 2026-07-14',
    id: 'completed-004',
    price: '6,500',
    productName: '손질 고등어 2팩',
    promotionText: '저녁 반찬으로 간편하게',
    status: 'completed',
  },
];

const needsEditProducts = Array.from({ length: 12 }, (_, index): RegistrationResultProduct => {
  const productNumber = index + 1;

  return {
    category: '가공식품',
    discountPeriod: '',
    id: `needs-edit-${String(productNumber).padStart(3, '0')}`,
    price: '',
    productName: '',
    promotionText: '',
    status: 'needsEdit',
    statusReason: productNumber % 3 === 0 ? '할인기간 미입력' : '판매가격 미입력',
    ...getNeedsEditProductImageFixture(index),
  };
});

export const registrationResultFixture = {
  pageSize: 10,
  products: [...needsEditProducts, ...completedProducts],
  summary: {
    completedCount: 112,
    needsEditCount: 12,
    totalCount: 124,
  },
};
