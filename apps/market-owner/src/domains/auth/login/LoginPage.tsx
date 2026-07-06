import { LoginCardLayout } from './components';
import { LoginForm, SignupPrompt } from './sections';
import * as S from './LoginPage.css';

export const LoginPage = () => {
  return (
    <main>
      <LoginCardLayout>
        <div className={S.contentClassName}>
          <LoginForm />
          <SignupPrompt />
        </div>
      </LoginCardLayout>
    </main>
  );
};
