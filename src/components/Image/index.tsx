import { DEFAULT_PROFILE_PICTURE } from '@/constants/config';
import Image from 'next/image';

interface BaseImageProps {
  src: string;
  onClickHandler?: React.MouseEventHandler<HTMLImageElement>;
}

function BaseImage({ src, onClickHandler }: BaseImageProps) {
  return <Image src={src} layout='fill' objectFit='cover' onClick={onClickHandler} />;
}

interface PfpImageProps {
  src: string | null | undefined;
}

function PfpImage({ src }: PfpImageProps) {
  return <BaseImage src={src || DEFAULT_PROFILE_PICTURE} />;
}

export { BaseImage, PfpImage };
