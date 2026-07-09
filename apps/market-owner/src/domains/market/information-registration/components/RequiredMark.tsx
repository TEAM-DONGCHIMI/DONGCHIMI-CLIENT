import * as S from './RequiredMark.css';

export const RequiredMark = () => (
  <span aria-hidden='true' className={S.requiredMarkClassName}>
    *
  </span>
);
