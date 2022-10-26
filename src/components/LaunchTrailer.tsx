import React from 'react';
import VideoJS from './Media/VideoJS';

interface Props {
  onClick?: () => void;
}

const isFirefox = () => {
  if (typeof window !== 'undefined') {
    return window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  }
  return false;
};

const videoJsOptions = {
  autoplay: true,
  controls: false,
  controlslist: 'nodownload',
  loop: true,
  playsinline: true,
  preload: 'metadata',
  muted: !isFirefox(),
  // poster: 'https://d180qjjsfkqvjc.cloudfront.net/trailers/lehel_poster.png',
  sources: [
    {
      src: 'http://d2k3k1d7773avn.cloudfront.net/videos/drop002/banner.mp4',
      type: 'video/mp4',
    },
  ],
};

export default function LaunchTrailer({ onClick }: Props) {
  return (
    <div className='hero' onClick={onClick}>
      <VideoJS options={videoJsOptions} onReady={() => {}} />
    </div>
  );
}
