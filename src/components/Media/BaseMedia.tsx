import { DEFAULT_PROFILE_PICTURE } from '@/constants/config';
import DEFAULT_PFP from '@/public/branding/sage-icon.svg';
import Image from 'next/image';
import Zoom from 'react-medium-image-zoom';

const ConditionalWrapper = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children;

interface BaseMediaProps {
  src: string;
  onClickHandler?: React.MouseEventHandler<HTMLImageElement>;
  isZoomable?: boolean;
  type?: string;
  className?: string;
}

function BaseMedia({ src, onClickHandler, isZoomable, type, className }: BaseMediaProps) {
  const isVideo = (): boolean => {
    return src.toLowerCase().endsWith('mp4');
  };

  return (
    <div>
      <ConditionalWrapper
        condition={true === isZoomable}
        wrapper={(children: JSX.Element) => (
          <Zoom wrapStyle={{ width: '100%', height: '100%', aspectRatio: '487/527' }}>
            {children}
          </Zoom>
        )}
      >
        {isVideo() ? (
          <video
            autoPlay={true}
            muted={true}
            loop={true}
            playsInline={true}
            style={{
              inset: '0px',
              overflow: 'hidden',
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            className={className}
          >
            <source src={src} type={type} />
          </video>
        ) : isZoomable ? (
          <Image
            src={src}
            layout='fill'
            objectFit='cover'
            draggable={false}
            className={className}
          />
        ) : (
          <Image
            src={src}
            layout='fill'
            objectFit='cover'
            draggable={false}
            onClick={onClickHandler}
            className={className}
            style={onClickHandler ? { cursor: 'pointer' } : {}}
          />
        )}
      </ConditionalWrapper>
    </div>
  );
}
interface PfpImageProps {
  src: string | null | undefined;
  className?: string;
}

function PfpImage({ src, className }: PfpImageProps) {
  if (!src) {
    return <DEFAULT_PFP className={'default-pfp-src'} />;
  }
  return <Image src={src} layout='fill' className={className} objectFit='cover' />;
}

export { BaseMedia, PfpImage };
