import { DEFAULT_PROFILE_PICTURE } from '@/constants/config';
import Image from 'next/image';

interface BaseImageProps {
  src: string;
  onClickHandler?: React.MouseEventHandler<HTMLImageElement>;
}

function BaseImage({ src, onClickHandler }: BaseImageProps) {
  return <Image src={src} layout='fill' objectFit='cover' onClick={onClickHandler} />;
}

function PfpImage({ src }: Partial<BaseImageProps>) {
  return <BaseImage src={src || DEFAULT_PROFILE_PICTURE} />;
}

export { BaseImage, PfpImage };
