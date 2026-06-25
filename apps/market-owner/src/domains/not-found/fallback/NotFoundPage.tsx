import { Link } from 'react-router';

import { MARKET_OWNER_ROUTES } from '../../../shared/constants/routes';

export const NotFoundPage = () => {
  return (
    <main>
      <section aria-labelledby='market-owner-not-found-title'>
        <p>404</p>
        <h1 id='market-owner-not-found-title'>페이지를 찾을 수 없습니다.</h1>
        <p>요청한 사장님 페이지가 존재하지 않거나 이동되었습니다.</p>
        <Link to={MARKET_OWNER_ROUTES.home}>홈으로 이동</Link>
      </section>
    </main>
  );
};
