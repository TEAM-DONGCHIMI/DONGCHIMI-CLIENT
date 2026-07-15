import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcLogin = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      fill='currentColor'
      d='M12.995 4a1 1 0 1 0-2 0h2m-2 1a1 1 0 1 0 2 0h-2m6.996 10a1 1 0 1 0 0 2v-2m1.999 2a1 1 0 1 0 0-2v2m-7.995-1v-1a1 1 0 0 0-1 1zm1.999 1a1 1 0 0 0 0-2v2m-2.999 3a1 1 0 1 0 2 0h-2m2-11a1 1 0 1 0-2 0h2m-1 3h-1a1 1 0 0 0 1 1zm3.998 7a1 1 0 1 0 0 2v-2m3.997 2a1 1 0 1 0 0-2v2M4 11a1 1 0 1 0 0 2v-2m3.997 2a1 1 0 1 0 0-2v2m4.008 0a1 1 0 1 0 0-2v2m3.998 0a1 1 0 1 0 0-2v2m3.987-2a1 1 0 1 0 0 2v-2m.01 2a1 1 0 1 0 0-2v2M5 4v1h1.998V3H5zm2.997 1h-1v2h2V5zm-.999 3V7H5v2h2zM4 7h1V5H3v2zm1 1V7H3a2 2 0 0 0 2 2zm2.997-1h-1 .001v2a2 2 0 0 0 2-2zm-.999-3v1h2a2 2 0 0 0-2-2zM5 4V3A2 2 0 0 0 3 5h2zm11.993 0v1h1.999V3h-2zm2.998 1h-1v2h2V5zm-1 3V7h-1.998v2h1.999zm-2.997-1h1V5h-2v2zm.999 1V7h-2a2 2 0 0 0 2 2zm2.998-1h-1v2a2 2 0 0 0 2-2zm-1-3v1h2a2 2 0 0 0-2-2zm-1.998 0V3a2 2 0 0 0-2 2h2zM4.999 16v1h2v-2h-2zm2.999 1h-1v2h2v-2zm-1 3v-1H5v2h2zM4 19h1v-2H3v2zm1 1v-1H3a2 2 0 0 0 2 2zm2.997-1h-1 .001v2a2 2 0 0 0 2-2zm-.999-3v1h2a2 2 0 0 0-2-2zM5 16v-1A2 2 0 0 0 3 17h2zm6.996-12h-1v1h2V4zm5.996 12v1h1.999v-2h-1.999zm-5.996 0v1h1.999v-2h-1.999zm0 0h-1v4h2v-4zm0-7h-1v3h2V9zm3.998 11v1h3.997v-2h-3.997zM4 12v1h3.997v-2H4zm7.995 0v1h.01v-2h-.01zm7.995 0v1H20v-2h-.01zm-7.995 0v1h4.008v-2h-4.008z'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcLogin);
const Memo = memo(ForwardRef);
export default Memo;
