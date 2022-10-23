import { BaseMedia } from '@/components/Media/BaseMedia';
interface Props {
  src: string;
  focusText: string;
}

const desktopViewSrc = 'https://d180qjjsfkqvjc.cloudfront.net/trailers/drop1_desktop.mp4';

export default function Media({ src, focusText }: Props) {
  return (
    <div className='drop-page__grid-item-media-container'>
      <BaseMedia className='drop-page__grid-item-media-src' src={desktopViewSrc} />
      <div className='drop-page__grid-item-media-overlay' />
      <div className='drop-page__grid-item-focus'> {focusText}</div>
    </div>
  );
}
