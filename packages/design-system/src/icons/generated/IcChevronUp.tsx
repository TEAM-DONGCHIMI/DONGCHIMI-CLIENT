import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcChevronUp = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d='M4.237 15.758a.797.797 0 0 0 1.144 0L12 8.995l6.619 6.763a.797.797 0 0 0 1.144 0 .84.84 0 0 0 0-1.169l-7.191-7.347a.797.797 0 0 0-1.144 0L4.237 14.59a.84.84 0 0 0 0 1.169'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcChevronUp);
const Memo = memo(ForwardRef);
export default Memo;
