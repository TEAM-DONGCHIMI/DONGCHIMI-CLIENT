import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcLineHorizontalSizeSmall = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      fill='var(--fill-0, #171719)'
      fillRule='evenodd'
      d='M4 10c0-.552.35-1 .783-1h10.434c.433 0 .783.448.783 1s-.35 1-.783 1H4.783C4.35 11 4 10.552 4 10'
      clipRule='evenodd'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcLineHorizontalSizeSmall);
const Memo = memo(ForwardRef);
export default Memo;
