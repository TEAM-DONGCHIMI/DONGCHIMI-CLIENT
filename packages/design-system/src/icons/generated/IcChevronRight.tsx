import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcChevronRight = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='none'
    viewBox='0 0 24 24'
    ref={ref}
    {...props}
  >
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='m9 18 6-6-6-6'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcChevronRight);
const Memo = memo(ForwardRef);
export default Memo;
