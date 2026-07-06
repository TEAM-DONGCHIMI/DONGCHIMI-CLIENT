import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcLineHorizontal = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      fill='var(--fill-0, #171719)'
      fillRule='evenodd'
      d='M5 12c0-.552.409-1 .913-1h12.174c.504 0 .913.448.913 1s-.409 1-.913 1H5.913C5.409 13 5 12.552 5 12'
      clipRule='evenodd'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcLineHorizontal);
const Memo = memo(ForwardRef);
export default Memo;
