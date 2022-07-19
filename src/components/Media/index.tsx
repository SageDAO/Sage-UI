import { DEFAULT_PROFILE_PICTURE } from '@/constants/config';
import Image from 'next/image';
import { Fragment } from 'react';
import Zoom from 'react-medium-image-zoom';

const ConditionalWrapper = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children;

interface BaseMediaProps {
  src: string;
  isVideo?: boolean;
  onClickHandler?: React.MouseEventHandler<HTMLImageElement>;
  isZoomable?: boolean;
  type?: string;
}

function BaseMedia({ src, isVideo, onClickHandler, isZoomable, type }: BaseMediaProps) {
  if (!isVideo) {
    isVideo = false;
  }

  return (
    <Fragment>
      <ConditionalWrapper
        condition={true === isZoomable}
        wrapper={(children: JSX.Element) => (
          <Zoom wrapStyle={{ height: '100%', width: '100%' }}>{children}</Zoom>
        )}
      >
        {isVideo ? (
          <video
            preload='auto'
            autoPlay
            muted
            loop
            playsInline
            style={{
              overflow: 'hidden',
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          >
            <source src={src} type={type} />
          </video>
        ) : isZoomable ? (
          <Image draggable={false} src={src} layout='fill' objectFit='cover' />
        ) : (
          <Image
            src={src}
            layout='fill'
            objectFit='cover'
            draggable={false}
            onClick={onClickHandler}
            style={onClickHandler ? { cursor: 'pointer' } : {}}
          />
        )}
      </ConditionalWrapper>
    </Fragment>
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
