import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcRangeSaleEditHover = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      fill='currentColor'
      d='m12 2 .287.014a3 3 0 0 1 1.834.865l7 7a3 3 0 0 1 0 4.242l-7 7a3 3 0 0 1-4.242 0l-7-7A3 3 0 0 1 2 12V7a5 5 0 0 1 5-5zM7.01 6a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2zM4 12c0 .258.098.512.293.707l7 7a1 1 0 0 0 1.414 0l7-7a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 12 4H7a3 3 0 0 0-3 3z'
    />
    <path fill='#FF6362' d='M22 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0' />
    <path
      fill='#fff'
      d='M17.964 3.35a1.193 1.193 0 0 1 1.687 1.686l-.473.473-1.687-1.687zM17.027 4.286 13 8.313V10h1.687l4.027-4.027z'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcRangeSaleEditHover);
const Memo = memo(ForwardRef);
export default Memo;
