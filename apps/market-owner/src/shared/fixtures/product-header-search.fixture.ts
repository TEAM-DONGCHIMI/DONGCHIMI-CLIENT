import { type ProductHeaderSearchProductTypes } from '@/shared/components';

export const productHeaderSearchProducts = [
  {
    dealType: 'DAILY',
    name: '딸기 2팩',
    productId: 101,
  },
  {
    dealType: 'DAILY',
    name: '풀무원 콩나물 100g',
    productId: 124,
  },
  {
    dealType: 'DAILY',
    name: '방울토마토 750g',
    productId: 103,
  },
  {
    dealType: 'PERIODIC',
    name: '햇감자 1kg',
    productId: 201,
  },
  {
    dealType: 'PERIODIC',
    name: '애호박 1개',
    productId: 206,
  },
  {
    dealType: 'PERIODIC',
    isProductInfoLoadable: false,
    name: '대란 30구',
    productId: 211,
  },
] satisfies ProductHeaderSearchProductTypes[];
