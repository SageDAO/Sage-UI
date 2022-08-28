import LogotypeSVG from '@/public/branding/sage-logotype.svg';
import Motto from '@/components/Layout/Motto';

interface Props {
  dataColor?: string;
}

export default function Logotype({ dataColor }: Props) {
  return (
    <div className='sage-logotype__wrapper'>
      <div className='sage-logotype'>
        <Motto />
        <LogotypeSVG data-color={dataColor} className='sage-logotype__svg' />
      </div>
    </div>
  );
}
