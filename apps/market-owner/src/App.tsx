const App = () => {
  const isNotFound = window.location.pathname !== '/';

  if (isNotFound) {
    return (
      <main>
        <section aria-labelledby='market-owner-not-found-title'>
          <p>404</p>
          <h1 id='market-owner-not-found-title'>페이지를 찾을 수 없습니다.</h1>
          <p>요청한 사장님 사이트 페이지가 없거나 주소가 변경되었습니다.</p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section aria-labelledby='market-owner-title'>
        <p>DCMSM</p>
        <h1 id='market-owner-title'>DONGCHIMI Market Owner</h1>
      </section>
    </main>
  );
};

export default App;
