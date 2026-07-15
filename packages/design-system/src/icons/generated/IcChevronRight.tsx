import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcChevronRight = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d='M7.269 3.267a.904.904 0 0 0 0 1.287L14.783 12l-7.514 7.446a.904.904 0 0 0 0 1.287.924.924 0 0 0 1.299 0l8.163-8.09a.904.904 0 0 0 0-1.287l-8.163-8.09a.924.924 0 0 0-1.299 0'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcChevronRight);
const Memo = memo(ForwardRef);
export default Memo;
