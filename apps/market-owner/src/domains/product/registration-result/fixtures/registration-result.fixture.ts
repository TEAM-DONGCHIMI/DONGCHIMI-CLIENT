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

const completedProducts: RegistrationResultProduct[] = [
  {
    category: '김치/반찬',
    discountPeriod: '2026-07-06 ~ 2026-07-12',
    id: 'completed-001',
    price: '12,900',
    productName: '전라도 포기김치 3kg',
    promotionText: '오늘만 특가로 준비했어요',
    status: 'completed',
  },
  {
    category: '정육',
    discountPeriod: '2026-07-06 ~ 2026-07-10',
    id: 'completed-002',
    price: '8,900',
    productName: '한돈 앞다리살 600g',
    promotionText: '구이와 찌개에 모두 좋아요',
    status: 'completed',
  },
  {
    category: '채소',
    discountPeriod: '2026-07-07 ~ 2026-07-12',
    id: 'completed-003',
    price: '2,980',
    productName: '햇감자 1봉',
    promotionText: '포슬포슬한 제철 감자',
    status: 'completed',
  },
  {
    category: '수산',
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
    category: '김치/반찬',
    discountPeriod: '',
    id: `needs-edit-${String(productNumber).padStart(3, '0')}`,
    price: '',
    productName: '',
    promotionText: '',
    status: 'needsEdit',
    statusReason: productNumber % 3 === 0 ? '할인기간 미입력' : '판매가격 미입력',
  };
});

export const registrationResultFixture = {
  pageSize: 10,
  products: [...needsEditProducts, ...completedProducts],
  summary: {
    completedCount: 112,
    needsEditCount: 12,
    totalCount: 128,
  },
};
