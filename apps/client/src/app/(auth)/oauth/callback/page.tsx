import { Suspense } from 'react';

import { OAuthCallbackPage } from '@/domains/auth/oauth-callback/OAuthCallbackPage';

const Page = () => {
  return (
    <Suspense fallback={<p aria-live='polite'>로그인 정보를 불러오고 있습니다.</p>}>
      <OAuthCallbackPage />
    </Suspense>
  );
};

export default Page;
