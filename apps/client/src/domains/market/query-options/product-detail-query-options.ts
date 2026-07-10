import { queryOptions } from '@tanstack/react-query';

import { getProductDetail, type ProductDetailParamsTypes } from '../api/product-detail-api';
import { productDetailQueryKeys } from '../query-keys';

export const productDetailQueryOptions = (params: ProductDetailParamsTypes) => {
  return queryOptions({
    queryKey: productDetailQueryKeys.detail(params),
    queryFn: () => getProductDetail(params),
  });
};
