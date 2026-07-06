import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcProgress = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      fill='var(--fill-0, #8B95A1)'
      d='M20.125 12a8.125 8.125 0 1 0-16.25 0 8.125 8.125 0 0 0 16.25 0M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcProgress);
const Memo = memo(ForwardRef);
export default Memo;
