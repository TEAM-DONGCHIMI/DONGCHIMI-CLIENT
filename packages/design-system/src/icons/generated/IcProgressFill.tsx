import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcProgressFill = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      fill='var(--fill-0, #15C47E)'
      d='M18.125 10a8.125 8.125 0 1 0-16.25 0 8.125 8.125 0 0 0 16.25 0M0 10a10 10 0 1 1 20 0 10 10 0 0 1-20 0'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcProgressFill);
const Memo = memo(ForwardRef);
export default Memo;
