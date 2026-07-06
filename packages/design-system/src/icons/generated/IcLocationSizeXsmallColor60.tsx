import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcLocationSizeXsmallColor60 = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>,
) => (
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
    <g fill='#6B7684' fillRule='evenodd' clipRule='evenodd'>
      <path d='M8.097 9.245a13 13 0 0 1-1.857 1.68.42.42 0 0 1-.481-.001 13.068 13.068 0 0 1-1.856-1.678C2.996 8.242 2 6.792 2 5.19 2 2.876 3.79 1 6 1s4 1.876 4 4.19c0 1.603-.996 3.053-1.903 4.055M6 1.898c-1.736 0-3.143 1.474-3.143 3.292 0 1.238.79 2.468 1.668 3.437A12 12 0 0 0 6 10c.316-.248.898-.735 1.475-1.372.878-.97 1.668-2.2 1.668-3.437 0-1.818-1.407-3.292-3.143-3.292' />
      <path d='M6 3.37c-.96 0-1.738.815-1.738 1.82S5.04 7.01 6 7.01s1.738-.814 1.738-1.82c0-1.005-.778-1.82-1.738-1.82m-.88 1.82c0-.51.394-.923.88-.923.487 0 .881.413.881.923s-.394.923-.88.923c-.487 0-.882-.413-.882-.923' />
    </g>
  </svg>
);
const ForwardRef = forwardRef(SvgIcLocationSizeXsmallColor60);
const Memo = memo(ForwardRef);
export default Memo;
