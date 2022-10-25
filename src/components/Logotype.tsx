import LogotypeSVG from '@/public/branding/sage-logotype.svg';
import SageFullLogoSVG from '@/public/branding/sage-full-logo.svg';
import ErrortypeSVG from '@/public/branding/error-logotype.svg';
import Motto from '@/components/Layout/Motto';
import useSageRoutes from '@/hooks/useSageRoutes';

interface Props {
  isErrorPage?: boolean;
  disableHomeRouting?: boolean;
}

export default function Logotype({ isErrorPage, disableHomeRouting }: Props) {
  const { isSingleDropsPage, pushToHome } = useSageRoutes();
  const dataColor = isSingleDropsPage && 'white';
  return (
    <div
      className='sage-logotype'
      onClick={() => {
        !disableHomeRouting && pushToHome();
      }}
    >
      {isErrorPage ? (
        <ErrortypeSVG data-color={dataColor} className='sage-logotype__svg' />
      ) : (
        <SageFullLogoSVG data-color={dataColor} className='sage-logotype__svg' />
      )}
    </div>
  );
}
