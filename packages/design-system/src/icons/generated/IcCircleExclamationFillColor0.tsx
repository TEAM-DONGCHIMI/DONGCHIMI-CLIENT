import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcCircleExclamationFillColor0 = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>,
) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    overflow='visible'
    preserveAspectRatio='none'
    style={{
      display: 'block',
    }}
    viewBox='0 0 24 24'
    width='1em'
    height='1em'
    ref={ref}
    {...props}
  >
    <path
      fill='var(--fill-0, white)'
      fillRule='evenodd'
      d='M2 12C2 6.477 6.476 2 12 2s10 4.477 10 10-4.478 10-10 10S2 17.523 2 12m10-4.95a.91.91 0 0 1 .909.91v4.545a.91.91 0 0 1-1.819 0V7.96a.91.91 0 0 1 .91-.91m1.01 8.99a1.01 1.01 0 1 1-2.02 0 1.01 1.01 0 0 1 2.02 0'
      clipRule='evenodd'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcCircleExclamationFillColor0);
const Memo = memo(ForwardRef);
export default Memo;
