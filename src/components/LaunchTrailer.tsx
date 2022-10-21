import useWindowDimensions from '@/hooks/useWindowSize';
import React from 'react';
import Hero from './Hero';

interface Props {
  onClick?: () => void;
}

const mobileViewSrc = 'https://d180qjjsfkqvjc.cloudfront.net/trailers/drop1_desktop.mp4';
const desktopViewSrc = 'https://d180qjjsfkqvjc.cloudfront.net/trailers/drop1_desktop.mp4';

function LaunchTrailer({ onClick }: Props) {
  const { isMobile } = useWindowDimensions();
  return <Hero bannerOnClick={onClick} imgSrc={isMobile ? mobileViewSrc : desktopViewSrc} />;
}

export default LaunchTrailer;
