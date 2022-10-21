import useWindowDimensions from '@/hooks/useWindowSize';
import React from 'react';
import Hero from './Hero';

interface Props {
  onClick?: () => void;
}

const mobileViewSrc = 'https://s3.us-east-2.amazonaws.com/sage.art/trailers/drop1_mobile.mp4';

const desktopViewSrc = 'https://s3.us-east-2.amazonaws.com/sage.art/trailers/drop1_desktop.mp4';
function LaunchTrailer({ onClick }: Props) {
  const { isMobile } = useWindowDimensions();

  return <Hero bannerOnClick={onClick} imgSrc={isMobile ? mobileViewSrc : desktopViewSrc} />;
}

export default LaunchTrailer;
