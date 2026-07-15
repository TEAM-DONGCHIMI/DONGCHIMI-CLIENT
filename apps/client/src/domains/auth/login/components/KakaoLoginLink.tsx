import { IcLogoKakaoSizeSmall } from '@dongchimi/design-system/icons';

import * as S from './KakaoLoginLink.css';

export const KakaoLoginLink = () => {
  return (
    <a className={S.linkClassName} href='/api/auth/kakao/authorize'>
      <IcLogoKakaoSizeSmall aria-hidden='true' className={S.iconClassName} />
      <span>카카오톡으로 시작하기</span>
    </a>
  );
};
