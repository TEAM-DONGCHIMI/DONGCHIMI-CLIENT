import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcChevronUpSizeXsmall = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    overflow='visible'
    preserveAspectRatio='none'
    style={{
      display: 'block',
    }}
    viewBox='0 0 12 12'
    width='1em'
    height='1em'
    ref={ref}
    {...props}
  >
    <path
      fill='var(--fill-0, #191F28)'
      d='M10.852 7.866a.54.54 0 0 1-.715 0L6 4.109 1.863 7.866a.54.54 0 0 1-.715 0 .43.43 0 0 1 0-.65l4.494-4.082a.54.54 0 0 1 .716 0l4.494 4.082a.43.43 0 0 1 0 .65'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcChevronUpSizeXsmall);
const Memo = memo(ForwardRef);
export default Memo;
