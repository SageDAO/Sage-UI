import { useRouter } from 'next/router';
import Logotype from '@/components/Logotype';
import { BaseMedia } from '@/components/Media';

interface Props {
  imgSrc: string;
  path?: string;
}

export default function Hero({ imgSrc, path }: Props) {
  const router = useRouter();
  return (
    <div className='hero'>
      <Logotype></Logotype>
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
