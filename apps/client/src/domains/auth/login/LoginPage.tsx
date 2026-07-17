import Image from 'next/image';

import mobileOnboardingImage from '@/shared/assets/images/img_mobile_onboarding.svg';

import * as S from './LoginPage.css';
import { KakaoLoginLink } from './components/KakaoLoginLink';
import { LoginRequiredToast } from './components/LoginRequiredToast';

type LoginPageProps = Readonly<{
  isAuthRequired: boolean;
  returnTo: string;
}>;

export const LoginPage = ({ isAuthRequired, returnTo }: LoginPageProps) => {
  return (
    <main className={S.pageClassName}>
      <LoginRequiredToast enabled={isAuthRequired} />
      <h1 className={S.visuallyHiddenClassName}>동치미 로그인</h1>

      <Image
        alt=''
        aria-hidden='true'
        className={S.onboardingImageClassName}
        priority
        src={mobileOnboardingImage}
      />

      <section aria-label='로그인' className={S.loginSectionClassName}>
        <KakaoLoginLink returnTo={returnTo} />

        <p className={S.termsClassName}>
          가입 시 이용약관 및 개인정보처리방침에
          <br />
          동의한 것으로 간주됩니다.
        </p>
      </section>
    </main>
  );
};
