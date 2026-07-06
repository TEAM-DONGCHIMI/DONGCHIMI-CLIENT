import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcClockSizeXsmallColor60 = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    overflow='visible'
    preserveAspectRatio='none'
    style={{
      display: 'block',
    }}
    viewBox='0 0 12 12'
    width='1em'
    height='1em'
    ref={ref}
    {...props}
  >
    <path
      stroke='var(--stroke-0, #6B7684)'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M6 4v2l1.5 1.5m3-1.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcClockSizeXsmallColor60);
const Memo = memo(ForwardRef);
export default Memo;
