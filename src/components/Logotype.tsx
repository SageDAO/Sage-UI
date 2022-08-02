import LogotypeSVG from '@/public/branding/sage-logotype.svg';
import Motto from '@/components/Layout/Motto';

export default function Logotype() {
  return (
    <div className='sage-logotype'>
      <Motto />
      <LogotypeSVG className='sage-logotype__svg' />
    </div>
  );
}
