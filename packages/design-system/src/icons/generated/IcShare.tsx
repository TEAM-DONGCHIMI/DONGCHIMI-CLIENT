import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcShare = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      fill='var(--fill-0, #191F28)'
      fillRule='evenodd'
      d='M16.656 2a3.346 3.346 0 0 0-3.257 4.11L7.756 9.18A3.346 3.346 0 0 0 2 11.5a3.346 3.346 0 0 0 5.754 2.32l5.645 3.07A3.346 3.346 0 0 0 16.656 21 3.346 3.346 0 0 0 20 17.653a3.346 3.346 0 0 0-5.756-2.32l-5.643-3.07a3.36 3.36 0 0 0 0-1.526l5.644-3.07A3.346 3.346 0 0 0 20 5.347 3.346 3.346 0 0 0 16.656 2m-1.574 3.347a1.574 1.574 0 1 1 3.149-.001 1.574 1.574 0 0 1-3.149.001M3.77 11.5a1.575 1.575 0 1 1 3.15 0 1.575 1.575 0 0 1-3.15 0m11.312 6.154a1.574 1.574 0 1 1 3.149-.002 1.574 1.574 0 0 1-3.149.002'
      clipRule='evenodd'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcShare);
const Memo = memo(ForwardRef);
export default Memo;
