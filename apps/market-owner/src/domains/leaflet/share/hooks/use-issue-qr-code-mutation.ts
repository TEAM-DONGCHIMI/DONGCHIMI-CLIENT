import { useMutation } from '@tanstack/react-query';

import { issueQrCode } from '../api';

export const useIssueQrCodeMutation = () => {
  return useMutation({
    mutationFn: issueQrCode,
  });
};
