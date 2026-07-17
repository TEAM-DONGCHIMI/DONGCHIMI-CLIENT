import { IcLogoKakaoSizeSmall } from '@dongchimi/design-system/icons';

import { buildKakaoAuthorizeHref } from '@/shared/auth/auth-return-to';

import * as S from './KakaoLoginLink.css';

type KakaoLoginLinkProps = Readonly<{
  returnTo: string;
}>;

export const KakaoLoginLink = ({ returnTo }: KakaoLoginLinkProps) => {
  return (
    <a className={S.linkClassName} href={buildKakaoAuthorizeHref(returnTo)}>
      <IcLogoKakaoSizeSmall aria-hidden='true' className={S.iconClassName} />
      <span>카카오톡으로 시작하기</span>
    </a>
  );
};
