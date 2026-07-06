import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcChevronLeftColor50 = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d='M16.731 3.267a.904.904 0 0 1 0 1.287L9.217 12l7.514 7.446a.904.904 0 0 1 0 1.287.924.924 0 0 1-1.299 0l-8.163-8.09a.904.904 0 0 1 0-1.287l8.163-8.09a.924.924 0 0 1 1.299 0'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcChevronLeftColor50);
const Memo = memo(ForwardRef);
export default Memo;
