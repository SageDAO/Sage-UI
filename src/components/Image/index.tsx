import Image from 'next/image';

interface BaseImageProps {
  src: string;
  onClickHandler?: React.MouseEventHandler<HTMLImageElement>;
}

function BaseImage({ src, onClickHandler }: BaseImageProps) {
  return <Image src={src} layout='fill' objectFit='cover' onClick={onClickHandler} />;
}

function PfpImage({ src }: Partial<BaseImageProps>) {
  return <BaseImage src={src || '/sample/pfp.svg'} />;
}

export { BaseImage, PfpImage };
