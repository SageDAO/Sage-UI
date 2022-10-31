import React from 'react';
import { Drop } from '@prisma/client';
import VideoJS from './Media/VideoJS';
import { VideoJsPlayerOptions } from 'video.js';

interface Props {
  onClick?: () => void;
  src: string;
}

const videoMustStartMuted = () => {
  if (typeof window !== 'undefined') {
    const ua = window.navigator.userAgent.toLowerCase();
    const isFirefox = ua.indexOf('firefox') > -1;
    const isBrave = ua.indexOf('brave') > -1;
    const isSafari = ua.indexOf('safari') > -1;
    return isFirefox || isBrave || isSafari;
  }
  return false;
};

export default function LaunchTrailer({ onClick, src }: Props) {
  const videoJsOptions: VideoJsPlayerOptions = {
    autoplay: 'muted',
    controls: true,
    // controlslist: 'nodownload',
    loop: true,
    playsinline: true,
    preload: 'metadata',
    muted: videoMustStartMuted(),
    // poster: 'https://d180qjjsfkqvjc.cloudfront.net/trailers/lehel_poster.png',
    sources: [
      {
        src,
        type: 'video/mp4',
      },
    ],
  };
  return (
    <div className='hero' onClick={onClick}>
      <VideoJS options={videoJsOptions} onReady={() => {}} />
    </div>
  );
}
