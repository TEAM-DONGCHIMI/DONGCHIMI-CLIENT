import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcClockSizeSmallColor60 = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    overflow='visible'
    preserveAspectRatio='none'
    style={{
      display: 'block',
    }}
    viewBox='0 0 20 20'
    width='1em'
    height='1em'
    ref={ref}
    {...props}
  >
    <path
      stroke='var(--stroke-0, #6B7684)'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.667}
      d='M10 6.667V10l2.5 2.5m5-2.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcClockSizeSmallColor60);
const Memo = memo(ForwardRef);
export default Memo;
