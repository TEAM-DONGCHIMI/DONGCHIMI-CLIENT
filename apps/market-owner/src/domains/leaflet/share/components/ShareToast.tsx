import { Toast, type ToastProps } from '@dongchimi/design-system/components';

import * as S from './ShareToast.css';

export type ShareToastProps = ToastProps;

export const ShareToast = (props: ShareToastProps) => {
  return <Toast className={S.toastClassName} {...props} />;
};
