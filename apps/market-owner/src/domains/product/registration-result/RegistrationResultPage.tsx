import { Link } from 'react-router';

import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

export const RegistrationResultPage = () => {
  return (
    <main>
      <p>등록 결과</p>
      <h1>상품 등록 결과 확인</h1>
      <p>상품 등록 결과 확인 화면은 protected route이지만 sidebar 없는 layout에서 렌더링됩니다.</p>
      <p>등록 결과 데이터, 완료 CTA, 공유 진입은 후속 flow 이슈에서 구현합니다.</p>
      <Link to={MARKET_OWNER_ROUTES.home}>홈으로 이동</Link>
    </main>
  );
};
