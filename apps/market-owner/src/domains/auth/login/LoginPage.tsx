import { Link } from 'react-router';

import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

export const LoginPage = () => {
  return (
    <main>
      <p>Public Auth</p>
      <h1>로그인</h1>
      <p>
        로그인 화면은 public auth layout에서 sidebar 없이 렌더링됩니다. 실제 로그인 API 연동은 후속
        이슈에서 연결합니다.
      </p>
      <p>DCMSM-15에서는 route와 layout boundary만 고정합니다.</p>
      <Link to={MARKET_OWNER_ROUTES.signup}>회원가입으로 이동</Link>
    </main>
  );
};
