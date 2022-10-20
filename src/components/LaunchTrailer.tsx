import React from 'react';
import Hero from './Hero';

interface Props {
  onClick?: () => void;
}

function LaunchTrailer({ onClick }: Props) {
  return (
    <Hero
      bannerOnClick={onClick}
      imgSrc={'https://s3.us-east-2.amazonaws.com/sage.art/trailers/SAGE+-+Genesis+-+by+LEHEL.mp4'}
    />
  );
}

export default LaunchTrailer;
