import { pretendardFontClass } from '@dongchimi/design-system/styles/fonts.css';

export const HomePage = () => {
  return (
    <main className={pretendardFontClass}>
      <section aria-labelledby='market-owner-title'>
        <p>DCMSM</p>
        <h1 id='market-owner-title'>DONGCHIMI Market Owner</h1>
      </section>
    </main>
  );
};
