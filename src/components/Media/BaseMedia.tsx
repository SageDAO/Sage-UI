import { DEFAULT_PROFILE_PICTURE } from '@/constants/config';
import DEFAULT_PFP from '@/public/branding/sage-icon.svg';
import Image from 'next/image';
import Zoom from 'react-medium-image-zoom';
import VideoJS from './VideoJS';

const ConditionalWrapper = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children;

interface BaseMediaProps {
  src: string;
  onClickHandler?: React.MouseEventHandler<HTMLImageElement>;
  isZoomable?: boolean;
  type?: string;
  className?: string;
  muted?: boolean;
  autoPlay?: boolean;
}

function BaseMedia({
  src,
  autoPlay,
  onClickHandler,
  isZoomable,
  type,
  className,
  muted,
}: BaseMediaProps) {
  const isVideo = (): boolean => {
    return src?.toLowerCase().endsWith('mp4');
  };

  const videoMustStartMuted = () => {
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent.toLowerCase();
      const isFirefox = ua.indexOf('firefox') > -1;
      const isBrave = ua.indexOf('brave') > -1;
      const isSafari = ua.indexOf('safari') > -1;
      return isFirefox || isBrave || isSafari;
    }
    return false;
  };

  const videoJsOptions = isVideo()
    ? {
        autoplay: true,
        controls: true,
        controlslist: 'nodownload',
        loop: true,
        playsinline: true,
        preload: 'metadata',
        muted: videoMustStartMuted(),
        // poster: 'https://d180qjjsfkqvjc.cloudfront.net/trailers/lehel_poster.png',
        sources: [
          {
            src,
            type: 'video/mp4',
          },
        ],
      }
    : {};

  return (
    <div>
      <ConditionalWrapper
        condition={true === isZoomable && !isVideo()}
        wrapper={(children: JSX.Element) => <Zoom classDialog='custom-zoom'>{children}</Zoom>}
      >
        {isVideo() ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              overflow: 'hidden',
            }}
          >
            <VideoJS options={videoJsOptions} onReady={() => {}} />
          </div>
        ) : isZoomable ? (
          <img
            src={src}
            // layout='fill'
            style={{
              overflow: 'hidden',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            draggable={false}
            className={className}
          />
        ) : (
          <Image
            src={src}
            layout='fill'
            objectFit='cover'
            draggable={false}
            className={className}
            onClick={onClickHandler}
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
    // return <Image src={DEFAULT_PROFILE_PICTURE} className={className || 'default-pfp-src'} layout='fill' objectFit='cover' />;
    return (
      <DEFAULT_PFP className={className || 'default-pfp-src'} layout='fill' objectfit='cover' />
    );
  }
  return <Image src={src} layout='fill' className={className} objectFit='cover' />;
}

export { BaseMedia, PfpImage };
