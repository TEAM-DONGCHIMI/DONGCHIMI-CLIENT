import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcLocationSizeSmallColor60 = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    overflow='visible'
    preserveAspectRatio='none'
    style={{
      display: 'block',
    }}
    viewBox='0 0 16 16'
    width='1em'
    height='1em'
    ref={ref}
    {...props}
  >
    <g fill='#6B7684' fillRule='evenodd' clipRule='evenodd'>
      <path d='M11.145 12.544a19 19 0 0 1-1.906 1.706c-.286.224-.576.443-.879.644a.67.67 0 0 1-.721 0 19.097 19.097 0 0 1-2.783-2.35C3.493 11.14 2 9.11 2 6.866 2 3.626 4.686 1 8 1s6 2.626 6 5.866c0 2.244-1.494 4.275-2.855 5.678M8 2.256c-2.604 0-4.714 2.063-4.714 4.609 0 1.733 1.185 3.455 2.502 4.812A18 18 0 0 0 8 13.598a18 18 0 0 0 2.212-1.92c1.317-1.357 2.502-3.08 2.502-4.812 0-2.546-2.11-4.61-4.714-4.61' />
      <path d='M8 4.317c-1.44 0-2.607 1.141-2.607 2.55C5.393 8.273 6.56 9.414 8 9.414s2.607-1.141 2.607-2.549S9.44 4.317 8 4.317M6.68 6.867c0-.714.591-1.293 1.321-1.293s1.322.579 1.322 1.292S8.73 8.158 8 8.158 6.68 7.58 6.68 6.866' />
    </g>
  </svg>
);
const ForwardRef = forwardRef(SvgIcLocationSizeSmallColor60);
const Memo = memo(ForwardRef);
export default Memo;
