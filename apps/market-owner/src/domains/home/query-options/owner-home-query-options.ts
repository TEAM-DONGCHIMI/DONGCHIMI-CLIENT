import { queryOptions } from '@tanstack/react-query';

import { getOwnerHome } from '../api/get-owner-home';
import { homeQueryKeys } from '../query-keys';

export const ownerHomeQueryOptions = () => {
  return queryOptions({
    queryKey: homeQueryKeys.ownerHome(),
    queryFn: getOwnerHome,
    throwOnError: false,
  });
};
