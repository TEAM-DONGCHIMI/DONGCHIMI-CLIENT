import { IcLogoKakaoSizeSmall } from '@dongchimi/design-system/icons';

import * as S from './KakaoLoginButton.css';

export const KakaoLoginButton = () => {
  return (
    <button className={S.buttonClassName} type='button'>
      <IcLogoKakaoSizeSmall aria-hidden='true' className={S.iconClassName} />
      <span>카카오톡으로 시작하기</span>
    </button>
  );
};
