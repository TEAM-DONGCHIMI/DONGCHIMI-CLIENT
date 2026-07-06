import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcCheckbox = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='none'
    viewBox='0 0 24 24'
    ref={ref}
    {...props}
  >
    <rect
      width={19.5}
      height={19.5}
      x={2.25}
      y={2.25}
      stroke='#4E5968'
      strokeWidth={1.5}
      rx={4.75}
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcCheckbox);
const Memo = memo(ForwardRef);
export default Memo;
