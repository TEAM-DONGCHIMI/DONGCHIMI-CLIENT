import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcChevronDown = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d='M3.364 7.363a.9.9 0 0 1 1.272 0L12 14.727l7.364-7.364a.9.9 0 0 1 1.272 1.273l-8 8a.9.9 0 0 1-1.272 0l-8-8a.9.9 0 0 1 0-1.273'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcChevronDown);
const Memo = memo(ForwardRef);
export default Memo;
