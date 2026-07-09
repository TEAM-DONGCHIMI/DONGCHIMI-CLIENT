import { Flex } from '@dongchimi/design-system/components';

import { LoginForm, SignupPrompt } from './sections';
import * as S from './LoginPage.css';

const TITLE_ID = 'market-owner-login-title';

export const LoginPage = () => {
  return (
    <main>
      <Flex
        aria-labelledby={TITLE_ID}
        as='section'
        align='center'
        className={S.cardClassName}
        direction='column'
        justify='start'
      >
        <Flex align='center' className={S.headerClassName} direction='column'>
          <div aria-hidden='true' className={S.logoSlotClassName} />
          <h1 className={S.titleClassName} id={TITLE_ID}>
            마트 관리자 로그인
          </h1>
        </Flex>
        <Flex className={S.contentClassName} direction='column'>
          <LoginForm />
          <SignupPrompt />
        </Flex>
      </Flex>
    </main>
  );
};
