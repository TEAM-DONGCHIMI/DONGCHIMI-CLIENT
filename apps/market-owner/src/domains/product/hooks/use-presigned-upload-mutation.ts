import { useMutation } from '@tanstack/react-query';

import { createPresignedUploadUrl, type PresignedUploadRequestTypes } from '@/shared/api';

export const usePresignedUploadMutation = () => {
  return useMutation({
    mutationFn: (payload: PresignedUploadRequestTypes) => createPresignedUploadUrl(payload),
  });
};
