import { useNavigate } from 'react-router';

import dailyRegistrationImageUrl from '../assets/img-homecard-daily-registration.svg';
import periodicRegistrationImageUrl from '../assets/img-homecard-periodic-registration.svg';
import productEditImageUrl from '../assets/img-homecard-product-edit.svg';
import { HomeQuickButton } from '../components/home-quick-button';
import { homeHeroActions } from '../fixtures';
import * as S from '../HomePage.css';

const actionImageUrls = {
  'daily-registration': dailyRegistrationImageUrl,
  'periodic-registration': periodicRegistrationImageUrl,
  'product-edit': productEditImageUrl,
} satisfies Record<(typeof homeHeroActions)[number]['id'], string>;

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
            visual={<img alt='' src={actionImageUrls[action.id]} />}
          />
        ))}
      </div>
    </section>
  );
};
