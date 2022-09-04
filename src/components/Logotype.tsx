import LogotypeSVG from '@/public/branding/sage-logotype.svg';
import ErrortypeSVG from '@/public/branding/error-logotype.svg';
import Motto from '@/components/Layout/Motto';
import { useRouter } from 'next/router';

interface Props {
  dataColor?: string;
  isErrorPage?: boolean;
  disableHomeRouting?: boolean;
}

export default function Logotype({ dataColor, isErrorPage, disableHomeRouting }: Props) {
  const router = useRouter();
  const urlIsSingleDropPage: boolean = router.pathname.includes('drops/');
  return (
    <div className='sage-logotype__wrapper'>
      <div
        className='sage-logotype'
        onClick={() => {
          !disableHomeRouting && router.push('/');
        }}
      >
        <Motto dataColor={urlIsSingleDropPage && 'white'} />
        {isErrorPage ? (
          <ErrortypeSVG data-color={dataColor} className='sage-logotype__svg' />
        ) : (
          <LogotypeSVG data-color={dataColor} className='sage-logotype__svg' />
        )}
      </div>
    </div>
  );
}
