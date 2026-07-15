import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcCalendarPlus = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      fill='currentColor'
      d='M16 1a1 1 0 0 1 1 1v1h2a3 3 0 0 1 3 3v7a1 1 0 1 1-2 0v-2H4v9a1 1 0 0 0 1 1h8a1 1 0 1 1 0 2H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h2V2a1 1 0 0 1 2 0v1h6V2a1 1 0 0 1 1-1m3 14a1 1 0 0 1 1 1v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2h-2a1 1 0 1 1 0-2h2v-2a1 1 0 0 1 1-1M5 5a1 1 0 0 0-1 1v3h16V6a1 1 0 0 0-1-1h-2v1a1 1 0 1 1-2 0V5H9v1a1 1 0 0 1-2 0V5z'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcCalendarPlus);
const Memo = memo(ForwardRef);
export default Memo;
