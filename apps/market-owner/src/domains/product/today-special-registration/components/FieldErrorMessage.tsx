import { IcCircleExclamationSizeSmallColorNegative } from '@dongchimi/design-system/icons';

import * as S from '../TodaySpecialRegistrationPage.css';

interface FieldErrorMessageProps {
  id: string;
  message: string;
}

export const FieldErrorMessage = ({ id, message }: FieldErrorMessageProps) => {
  return (
    <p className={S.fieldErrorMessageClassName} id={id}>
      <IcCircleExclamationSizeSmallColorNegative
        className={S.fieldErrorIconClassName}
        aria-hidden='true'
      />
      <span>{message}</span>
    </p>
  );
};
