import { pretendardFontClass } from '@dongchimi/design-system/styles/fonts.css';

const NotFoundPage = () => {
  return (
    <main
      className={pretendardFontClass}
      style={{
        display: 'grid',
        minHeight: '100vh',
        placeItems: 'center',
        padding: '32px',
        textAlign: 'center',
      }}
    >
      <section aria-labelledby='not-found-title'>
        <p style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 700 }}>404</p>
        <h1 id='not-found-title' style={{ margin: 0, fontSize: '28px' }}>
          페이지를 찾을 수 없습니다.
        </h1>
        <p style={{ margin: '12px 0 0', color: '#667085' }}>
          요청한 동치미 페이지가 없거나 주소가 변경되었습니다.
        </p>
      </section>
    </main>
  );
};

export default NotFoundPage;
