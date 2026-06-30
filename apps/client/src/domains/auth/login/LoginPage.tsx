import Link from 'next/link';

import { CLIENT_ROUTES } from '@/shared/constants';

export const LoginPage = () => {
  return (
    <main>
      <section aria-labelledby='login-title'>
        <p>모바일 전단 소식</p>
        <h1 id='login-title'>동치미 로그인</h1>
        <p>동네 마트의 할인 소식을 내 주변 기준으로 확인합니다.</p>

        <nav aria-label='로그인 후 이동'>
          <Link href={CLIENT_ROUTES.markets}>주변 마트 둘러보기</Link>
        </nav>
      </section>
    </main>
  );
};
