import { DEFAULT_PROFILE_PICTURE } from '@/constants/config';
import Image from 'next/image';
import { Fragment } from 'react';
import Zoom from 'react-medium-image-zoom';

const ConditionalWrapper = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children;

interface BaseMediaProps {
  src: string;
  isVideo: boolean;
  onClickHandler?: React.MouseEventHandler<HTMLImageElement>;
  isZoomable?: boolean;
}

function BaseMedia({ src, isVideo, onClickHandler, isZoomable }: BaseMediaProps) {
  return (
    <Fragment>
      <ConditionalWrapper
        condition={true === isZoomable}
        wrapper={(children: JSX.Element) => (
          <Zoom wrapStyle={{ height: '100%', width: '100%' }}>{children}</Zoom>
        )}
      >
        {isVideo ? (
          <video preload='auto' autoPlay muted loop playsInline style={{ overflow: 'hidden' }}>
            <source src={src} type='video/mp4' />
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
}

function PfpImage({ src }: PfpImageProps) {
  return <BaseMedia src={src || DEFAULT_PROFILE_PICTURE} isVideo={false} />;
}

export { BaseMedia, PfpImage };
