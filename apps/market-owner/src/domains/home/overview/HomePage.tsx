import { Link } from 'react-router';

import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

export const HomePage = () => {
  return (
    <main>
      <p>사장님웹</p>
      <h1>홈</h1>
      <p>사장님웹 업무 화면은 좌측 사이드바가 있는 protected layout에서 렌더링됩니다.</p>
      <p>상품 등록, 상품 수정 flow로 이동할 수 있는 업무 홈입니다.</p>
      <Link to={MARKET_OWNER_ROUTES.todaySpecialRegistration}>오늘의 특가 상품 등록으로 이동</Link>
    </main>
  );
};
