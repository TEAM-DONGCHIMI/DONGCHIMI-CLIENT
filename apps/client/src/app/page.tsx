import { redirect } from 'next/navigation';

import { CLIENT_ROUTES } from '@/shared/constants';

const RootPage = () => {
  redirect(CLIENT_ROUTES.login);
};

export default RootPage;
