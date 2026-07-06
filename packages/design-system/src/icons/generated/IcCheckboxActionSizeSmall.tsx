import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcCheckboxActionSizeSmall = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='none'
    viewBox='0 0 20 20'
    ref={ref}
    {...props}
  >
    <rect width={15.833} height={15.833} x={2.083} y={2.083} fill='#15C47E' rx={3.75} />
    <rect
      width={15.833}
      height={15.833}
      x={2.083}
      y={2.083}
      stroke='#15C47E'
      strokeWidth={0.833}
      rx={3.75}
    />
    <path
      fill='#fff'
      d='M14.214 7.043a.59.59 0 0 1 0 .81l-5.515 5.73a.537.537 0 0 1-.78 0l-2.757-2.865a.59.59 0 0 1 0-.81.537.537 0 0 1 .78 0l2.367 2.459 5.125-5.324a.537.537 0 0 1 .78 0'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcCheckboxActionSizeSmall);
const Memo = memo(ForwardRef);
export default Memo;
