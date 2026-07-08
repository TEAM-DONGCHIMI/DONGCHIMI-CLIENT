import * as S from '../NearbyMarketsPage.css';

export const NearbyMarketsMapSection = () => {
  return (
    <section aria-label='지도 영역'>
      <div aria-label='지도 영역' className={S.mapAreaClassName} role='img' />
    </section>
  );
};
