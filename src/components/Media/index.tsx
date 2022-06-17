import { DEFAULT_PROFILE_PICTURE } from '@/constants/config';
import Image from 'next/image';

interface BaseMediaProps {
  src: string;
  isVideo: boolean;
  onClickHandler?: React.MouseEventHandler<HTMLImageElement>;
}

function BaseMedia({ src, isVideo, onClickHandler }: BaseMediaProps) {
  if (isVideo) {
    return (
      <video preload="auto" autoPlay muted loop playsInline>
        <source src={src} type='video/mp4' />
      </video>
    );
  }
  return <Image src={src} layout='fill' objectFit='cover' onClick={onClickHandler} />;
}

interface PfpImageProps {
  src: string | null | undefined;
}

function PfpImage({ src }: PfpImageProps) {
  return <BaseMedia src={src || DEFAULT_PROFILE_PICTURE} isVideo={false} />;
}

export { BaseMedia, PfpImage };
