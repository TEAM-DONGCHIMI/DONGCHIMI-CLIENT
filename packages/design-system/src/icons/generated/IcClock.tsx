import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcClock = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      stroke='var(--stroke-0, #191F28)'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcClock);
const Memo = memo(ForwardRef);
export default Memo;
