import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcPlus = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d='M12 3a.91.91 0 0 1 .91.91v7.18h7.18a.91.91 0 0 1 0 1.82h-7.18v7.18a.91.91 0 0 1-1.82 0v-7.18H3.91a.91.91 0 0 1 0-1.82h7.18V3.91A.91.91 0 0 1 12 3'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcPlus);
const Memo = memo(ForwardRef);
export default Memo;
