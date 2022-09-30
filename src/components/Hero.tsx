import Logotype from '@/components/Logotype';
import { BaseMedia } from '@/components/Media/BaseMedia';

interface Props {
  imgSrc: string;
  bannerOnClick?: () => void;
}

export default function Hero({ imgSrc, bannerOnClick }: Props) {
  return (
    <div className='hero'>
      <Logotype ></Logotype>
      <div className='hero__banner'>
        <BaseMedia onClickHandler={bannerOnClick} src={imgSrc}></BaseMedia>
      </div>
    </div>
  );
}
