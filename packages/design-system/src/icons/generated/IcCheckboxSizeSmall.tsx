import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcCheckboxSizeSmall = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='none'
    viewBox='0 0 20 20'
    ref={ref}
    {...props}
  >
    <rect
      width={16.25}
      height={16.25}
      x={1.875}
      y={1.875}
      stroke='#4E5968'
      strokeWidth={1.25}
      rx={3.958}
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcCheckboxSizeSmall);
const Memo = memo(ForwardRef);
export default Memo;
