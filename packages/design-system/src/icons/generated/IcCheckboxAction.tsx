import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcCheckboxAction = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='none'
    viewBox='0 0 24 24'
    ref={ref}
    {...props}
  >
    <rect width={19} height={19} x={2.5} y={2.5} fill='#15C47E' rx={4.5} />
    <rect width={19} height={19} x={2.5} y={2.5} stroke='#15C47E' rx={4.5} />
    <path
      fill='#fff'
      d='M17.056 8.451a.707.707 0 0 1 0 .973l-6.618 6.875a.644.644 0 0 1-.935 0l-3.31-3.438a.706.706 0 0 1 0-.972.644.644 0 0 1 .937 0l2.84 2.951 6.15-6.389a.644.644 0 0 1 .936 0'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcCheckboxAction);
const Memo = memo(ForwardRef);
export default Memo;
