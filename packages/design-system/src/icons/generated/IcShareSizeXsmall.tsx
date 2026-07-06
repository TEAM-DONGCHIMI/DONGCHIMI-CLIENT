import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcShareSizeXsmall = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path
      fill='var(--fill-0, #191F28)'
      fillRule='evenodd'
      d='M11.77 1c-1.23 0-2.229 1.025-2.229 2.29q0 .27.058.522l-3.762 2.1A2.2 2.2 0 0 0 4.23 5.21C2.998 5.21 2 6.235 2 7.5c0 1.266.998 2.29 2.23 2.29.63 0 1.2-.269 1.606-.702L9.6 11.188a2.4 2.4 0 0 0-.058.522c0 1.265.998 2.29 2.23 2.29C13 14 14 12.975 14 11.71s-.998-2.29-2.23-2.29c-.631 0-1.201.27-1.607.703L6.4 8.023a2.36 2.36 0 0 0 0-1.045l3.762-2.1c.406.433.976.703 1.608.703C13 5.58 14 4.555 14 3.29 14 2.024 13.002 1 11.77 1m-1.049 2.29c0-.595.47-1.078 1.05-1.078.579 0 1.049.483 1.049 1.078s-.47 1.078-1.05 1.078c-.579 0-1.049-.482-1.049-1.078M3.181 7.5c0-.596.47-1.078 1.049-1.078s1.049.482 1.049 1.078c0 .595-.47 1.077-1.05 1.077-.579 0-1.049-.482-1.049-1.077m7.54 4.21c0-.596.47-1.078 1.05-1.078.579 0 1.049.482 1.049 1.078 0 .595-.47 1.077-1.05 1.077-.579 0-1.049-.482-1.049-1.077'
      clipRule='evenodd'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcShareSizeXsmall);
const Memo = memo(ForwardRef);
export default Memo;
