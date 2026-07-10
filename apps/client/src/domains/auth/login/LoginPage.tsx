import * as S from './LoginPage.css';
import { KakaoLoginButton } from './components/KakaoLoginButton';

export const LoginPage = () => {
  return (
    <main className={S.pageClassName}>
      <h1 className={S.visuallyHiddenClassName}>동치미 로그인</h1>

      <div aria-hidden='true' className={S.onboardingImageClassName} />

      <section aria-label='로그인' className={S.loginSectionClassName}>
        <KakaoLoginButton />

        <p className={S.termsClassName}>
          가입 시 이용약관 및 개인정보처리방침에
          <br />
          동의한 것으로 간주됩니다.
        </p>
      </section>
    </main>
  );
};
