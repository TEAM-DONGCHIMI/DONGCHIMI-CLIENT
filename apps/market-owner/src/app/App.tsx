import { RouterProvider } from 'react-router';

import { AppProviders } from './AppProviders';
import { router } from './router';
import { useAuthBootstrap } from './use-auth-bootstrap';

export const App = () => {
  useAuthBootstrap();

  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
};
