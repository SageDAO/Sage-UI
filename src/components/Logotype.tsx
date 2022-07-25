import useTheme from '@/hooks/useTheme';
import Image from 'next/image';
import LogotypeSVG from '../../public/branding/sage-logotype.svg';

export default function Logotype() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div onClick={toggleTheme} className='sage-logotype'>
      <img
        className='sage-logotype__destroying-fakes'
        draggable={false}
        src='/branding/destroying-fakes.svg'
      ></img>
      <LogotypeSVG className='sage-logotype__svg' currentColor='red' />
    </div>
  );
}
