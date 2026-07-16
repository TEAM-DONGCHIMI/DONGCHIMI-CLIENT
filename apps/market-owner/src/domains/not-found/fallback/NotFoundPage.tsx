import { Button } from '@dongchimi/design-system';
import { useNavigate } from 'react-router';

import Svg404Img from '@/shared/assets/images/generated/404Img';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

import * as S from './NotFoundPage.css';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <main className={S.pageClassName}>
      <section aria-labelledby='market-owner-not-found-title' className={S.contentClassName}>
        <Svg404Img aria-hidden='true' className={S.illustrationClassName} focusable='false' />
        <h1 className={S.titleClassName} id='market-owner-not-found-title'>
          페이지를 찾을 수 없습니다.
        </h1>
        <Button
          className={S.homeButtonClassName}
          color='assistive'
          onClick={() => navigate(MARKET_OWNER_ROUTES.home)}
          size='small'
        >
          메인으로 가기
        </Button>
      </section>
    </main>
  );
};
