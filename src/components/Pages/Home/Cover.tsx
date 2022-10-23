import VideoJS from '@/components/Media/VideoJS';
import ArrowDownSVG from '@/public/interactive/arrow-down.svg';
import React, { useEffect, useState } from 'react';

interface Props {
  removeCover: () => void;
  coverOn: boolean;
}

const videoJsOptions = {
  autoplay: true,
  loop: true,
  controls: false,
  responsive: false,
  muted: true,
  sources: [
    {
      src: 'https://d180qjjsfkqvjc.cloudfront.net/trailers/drop1_desktop.mp4',
      // type: 'application/x-mpegURL',
      type: 'video/mp4',
    },
  ],
};

function getPositionY(e: React.TouchEvent<HTMLDivElement>) {
  return e.touches[0].clientY;
}

function Cover(props: Props) {
  const [isDraggingg, setIsDragging] = useState(false);
  const [] = useState(0);

  return (
    <div
      onTouchStart={(e) => {
        setIsDragging(true);
        const startPos = getPositionY(e);
      }}
      className='home-page__cover'
      data-on={props.coverOn}
      onTouchMove={(e) => {
        if (isDraggingg) {
          const endPos = getPositionY(e);
          const triggerPos = window.innerHeight * 0.9;
          if (endPos > triggerPos) {
            props.removeCover();
          }
        }
      }}
      onTouchEnd={(e) => {
        setIsDragging(false);
      }}
    >
      <VideoJS options={videoJsOptions} onReady={() => {}} />
      <div onClick={props.removeCover} data-on={props.coverOn} className='home-page__cover-arrow'>
        <ArrowDownSVG className='home-page__cover-arrow-svg' data-on={props.coverOn}></ArrowDownSVG>
      </div>
    </div>
  );
}

export default Cover;
