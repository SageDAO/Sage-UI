import useWindowDimensions from '@/hooks/useWindowSize';
import React from 'react';
import Hero from './Hero';
import VideoJS from './Media/VideoJS';

interface Props {
  onClick?: () => void;
}

const mobileViewSrc = 'https://d180qjjsfkqvjc.cloudfront.net/trailers/drop1_mobile.mp4';
const desktopViewSrc = 'https://d180qjjsfkqvjc.cloudfront.net/trailers/drop1_desktop.mp4';

const videoJsOptions = {
  autoplay: true,
  loop: true,
  controls: false,
  responsive: false,
  muted: true,
  poster: 'https://d180qjjsfkqvjc.cloudfront.net/trailers/lehel_poster.png',
  sources: [
    {
      src: 'https://d180qjjsfkqvjc.cloudfront.net/trailers/out/hls/drop1_mobile.m3u8',
      type: 'application/x-mpegURL',
    },
    {
      src: 'https://d180qjjsfkqvjc.cloudfront.net/trailers/drop1_desktop.mp4',
      type: 'video/mp4'
    },
  ],
};

function LaunchTrailer({ onClick }: Props) {
  const { isMobile } = useWindowDimensions();
  const mediaSrc = isMobile ? mobileViewSrc : desktopViewSrc;
  //return <Hero bannerOnClick={onClick} imgSrc={mediaSrc} />;
  return (
    <div className='hero'>
      <VideoJS options={videoJsOptions} onReady={() => {}} />
    </div>
  );
}

export default LaunchTrailer;
