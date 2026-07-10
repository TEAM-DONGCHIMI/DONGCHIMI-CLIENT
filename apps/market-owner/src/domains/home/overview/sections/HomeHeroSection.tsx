import { useNavigate } from 'react-router';

import { HomeQuickButton } from '../components/home-quick-button';
import { homeHeroActions } from '../fixtures';
import * as S from '../HomePage.css';

export const HomeHeroSection = () => {
  const navigate = useNavigate();

  return (
    <section aria-label='홈 대표 영역' className={S.heroSectionClassName}>
      <div className={S.heroActionListClassName}>
        {homeHeroActions.map((action) => (
          <HomeQuickButton
            description={action.description}
            key={action.id}
            label={action.title}
            onClick={() => navigate(action.route)}
          />
        ))}
      </div>
    </section>
  );
};
