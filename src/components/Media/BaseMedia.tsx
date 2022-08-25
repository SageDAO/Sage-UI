import { DEFAULT_PROFILE_PICTURE } from '@/constants/config';
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
  }
  
  return (
    <div>
      <ConditionalWrapper
        condition={true === isZoomable}
        wrapper={(children: JSX.Element) => (
          <Zoom wrapStyle={{ height: '100%', width: '100%' }}>{children}</Zoom>
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
            draggable={false}
            className={className}
            src={src}
            layout='fill'
            objectFit='cover'
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
  return <Image src={src || DEFAULT_PROFILE_PICTURE} layout='fill' objectFit='cover' />;
}

export { BaseMedia, PfpImage };
