import { Outlet } from 'react-router';

import * as S from './NoSidebarLayout.css';

export const NoSidebarLayout = () => {
  return (
    <div className={S.noSidebarLayoutRootClassName}>
      <Outlet />
    </div>
  );
};
