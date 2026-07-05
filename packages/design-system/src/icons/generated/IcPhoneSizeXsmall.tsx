import { forwardRef, memo, type Ref, type SVGProps } from 'react';
const SvgIcPhoneSizeXsmall = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      fill='var(--fill-0, #6B7684)'
      fillRule='evenodd'
      d='M8.066 10.955c-1.111-.225-2.807-.847-4.49-2.53-1.684-1.684-2.306-3.38-2.531-4.49-.187-.923.231-1.772.823-2.364l.139-.139a1.475 1.475 0 0 1 2.243.186l.725 1.014a1.22 1.22 0 0 1-.13 1.573l-.422.422c.128.308.456.929 1.239 1.711.782.783 1.403 1.11 1.71 1.239l.423-.422a1.22 1.22 0 0 1 1.573-.13l1.014.725c.742.53.83 1.599.186 2.243l-.138.139c-.593.592-1.442 1.01-2.364.823M4.223 7.777c1.537 1.538 3.062 2.086 4.024 2.28.527.107 1.082-.12 1.535-.573l.138-.138a.56.56 0 0 0-.07-.851L8.835 7.77a.305.305 0 0 0-.393.033l-.43.43a.88.88 0 0 1-.943.209c-.413-.164-1.155-.556-2.055-1.456S3.722 5.344 3.558 4.93a.88.88 0 0 1 .21-.944l.43-.43a.305.305 0 0 0 .032-.392L3.505 2.15a.56.56 0 0 0-.85-.07l-.14.138c-.453.453-.68 1.008-.573 1.535.195.962.743 2.487 2.28 4.024'
      clipRule='evenodd'
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIcPhoneSizeXsmall);
const Memo = memo(ForwardRef);
export default Memo;
