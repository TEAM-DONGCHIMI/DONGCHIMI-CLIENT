import { useMutation } from '@tanstack/react-query';

import { publishLeaflet } from '../api';

export const usePublishLeafletMutation = () => {
  return useMutation({
    mutationFn: publishLeaflet,
  });
};
