import { useRouter } from 'next/router';
import { BaseMedia } from './Media';

interface Props {
  imgSrc: string;
  path?: string;
}

export default function Hero({ imgSrc, path }: Props) {
  const router = useRouter();
  return (
    <div className='hero'>
      <div className='hero__logotype'>
        <BaseMedia src='/branding/sage-logotype.svg' isVideo={false} />
      </div>
      <div className='hero__banner'>
        <BaseMedia
          onClickHandler={async () => {
            if (!path) return;
            await router.push(path);
          }}
          src={imgSrc}
          isVideo={false}
        ></BaseMedia>
      </div>
    </div>
  );
}
