import { Outlet } from 'react-router';

import * as S from './AuthLayout.css';

export const AuthLayout = () => {
  return (
    <div className={S.authLayoutRootClassName}>
      <div className={S.authLayoutContentClassName}>
        <Outlet />
      </div>
    </div>
  );
};
