import { useQuery } from '@tanstack/react-query';

import { ownerHomeQueryOptions } from '../query-options/owner-home-query-options';

export const useOwnerHomeQuery = () => {
  return useQuery(ownerHomeQueryOptions());
};
