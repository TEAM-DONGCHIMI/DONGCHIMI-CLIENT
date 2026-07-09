import type { FieldError } from 'react-hook-form';

interface GetVisibleFieldErrorMessageParams {
  error?: FieldError;
  isSubmitted: boolean;
  isTouched?: boolean;
}

export const getVisibleFieldErrorMessage = ({
  error,
  isSubmitted,
  isTouched,
}: GetVisibleFieldErrorMessageParams) => {
  return isSubmitted || isTouched ? error?.message : undefined;
};
