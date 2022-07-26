import useTheme from '@/hooks/useTheme';
import LogotypeSVG from '@/public/branding/sage-logotype.svg';
import Motto from '@/components/Layout/Motto';

export default function Logotype() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div onClick={toggleTheme} className='sage-logotype'>
      <Motto  />
      <LogotypeSVG className='sage-logotype__svg' currentColor='red' />
    </div>
  );
}
