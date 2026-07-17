import { Suspense } from 'react';

import { OAuthCallbackLoading } from '@/domains/auth/oauth-callback/components/OAuthCallbackLoading';
import { OAuthCallbackPage } from '@/domains/auth/oauth-callback/OAuthCallbackPage';

const Page = () => {
  return (
    <Suspense fallback={<OAuthCallbackLoading />}>
      <OAuthCallbackPage />
    </Suspense>
  );
};

export default Page;
