import type { FieldError } from 'react-hook-form';

interface GetVisibleFieldErrorMessageParams {
  error?: FieldError;
  isSubmitted: boolean;
  isTouched?: unknown;
}

export const getVisibleFieldErrorMessage = ({
  error,
  isSubmitted,
  isTouched,
}: GetVisibleFieldErrorMessageParams) => {
  return isSubmitted || Boolean(isTouched) ? error?.message : undefined;
};
