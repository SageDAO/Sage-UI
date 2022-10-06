import Logotype from '@/components/Logotype';
import { BaseMedia } from '@/components/Media/BaseMedia';
import Motto from './Layout/Motto';


interface Props {
  imgSrc: string;
  bannerOnClick?: () => void;
}

export default function Hero({ imgSrc, bannerOnClick }: Props) {
  return (
    <div className='hero'>
        <BaseMedia onClickHandler={bannerOnClick} src={imgSrc}></BaseMedia>
			<Motto></Motto>
    </div>
  );
}
