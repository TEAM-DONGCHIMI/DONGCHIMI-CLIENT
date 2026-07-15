import { queryOptions } from '@tanstack/react-query';

import { getProductDetail, type ProductDetailParamsTypes } from '../api/product-detail-api';
import { marketQueryKeys } from '../query-keys';

export const productDetailQueryOptions = (params: ProductDetailParamsTypes) => {
  return queryOptions({
    queryKey: marketQueryKeys.productDetail(params),
    queryFn: () => getProductDetail(params),
  });
};
