import { BaseMedia } from '@/components/Media/BaseMedia';
interface Props {
  src: string;
}
export default function Media({ src }: Props) {
  return (
    <div className='drop-page__grid-item-media-container'>
      <BaseMedia className='drop-page__grid-item-media-src' src={src} />
      <div className='drop-page__grid-item-media-overlay'></div>
      <div className='drop-page__grid-item-focus'></div>
    </div>
  );
}
