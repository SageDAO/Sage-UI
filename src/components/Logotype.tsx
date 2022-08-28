import LogotypeSVG from '@/public/branding/sage-logotype.svg';
import Motto from '@/components/Layout/Motto';
import { useRouter } from 'next/router';

interface Props {
  dataColor?: string;
}

export default function Logotype({ dataColor }: Props) {
  const router = useRouter();
  const urlIsSingleDropPage: boolean = router.pathname.includes('drops/');
  return (
    <div className='sage-logotype__wrapper'>
      <div className='sage-logotype'>
        <Motto dataColor={urlIsSingleDropPage && 'white'} />
        <LogotypeSVG data-color={dataColor} className='sage-logotype__svg' />
      </div>
    </div>
  );
}
