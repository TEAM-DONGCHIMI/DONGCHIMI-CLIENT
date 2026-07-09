export type TextInputStatusPropsTypes =
  | {
      errorMessage: string;
      status: 'error';
    }
  | {
      status: 'default';
    };

export const getTextInputStatusProps = (
  errorMessage: string | undefined,
): TextInputStatusPropsTypes => {
  if (errorMessage !== undefined) {
    return {
      errorMessage,
      status: 'error',
    };
  }

  return {
    status: 'default',
  };
};
