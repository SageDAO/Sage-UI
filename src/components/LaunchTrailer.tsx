import React from 'react';
import { Drop } from '@prisma/client';
import VideoJS from './Media/VideoJS';

interface Props {
  onClick?: () => void;
  src: string;
}

const isFirefoxOrBrave = () => {
  if (typeof window !== 'undefined') {
    const ua = window.navigator.userAgent.toLowerCase();
    const isFirefox = ua.indexOf('firefox') > -1;
    const isBrave = ua.indexOf('brave') > -1;
    return isFirefox || isBrave;
  }
  return false;
};

export default function LaunchTrailer({ onClick, src }: Props) {
  const videoJsOptions = {
    autoplay: true,
    controls: false,
    controlslist: 'nodownload',
    loop: true,
    playsinline: true,
    preload: 'metadata',
    muted: isFirefoxOrBrave(),
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
