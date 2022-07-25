import useTheme from '@/hooks/useTheme';
import Image from 'next/image';

export default function Logotype() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div onClick={toggleTheme} className='sage-logotype'>
      <img
        className='sage-logotype__destroying-fakes'
        draggable={false}
        src='/branding/destroying-fakes.svg'
      ></img>
      <Image src='/branding/sage-logotype.svg' layout='fill' className='sage-logotype__src' />
    </div>
  );
}
