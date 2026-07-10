import { IcLogoKakaoSizeSmall } from '@dongchimi/design-system/icons';

import * as S from './KakaoLoginButton.css';

interface KakaoLoginButtonProps {
  disabled?: boolean;
}

export const KakaoLoginButton = ({ disabled = false }: KakaoLoginButtonProps) => {
  return (
    <button className={S.buttonClassName} disabled={disabled} type='button'>
      <IcLogoKakaoSizeSmall aria-hidden='true' className={S.iconClassName} />
      <span>카카오톡으로 시작하기</span>
    </button>
  );
};
