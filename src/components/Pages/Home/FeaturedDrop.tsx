import Hero from '@/components/Hero';
import useDrop, { UseDropArgs } from '@/hooks/useDrop';
import React from 'react';

interface Props extends UseDropArgs {}

function FeaturedDrop({ drop, artist, Lotteries, Auctions }: Props) {
  const { goToDropOnClick, goToArtistOnClick, bannerImgSrc, dropName, artistName } = useDrop({
    drop,
    artist,
    Lotteries,
    Auctions,
  });
  return (
    <>
      <Hero bannerOnClick={goToDropOnClick} imgSrc={bannerImgSrc} />
      <div className='home-page__featured-drop-tag-section'>
        <div className='home-page__featured-drop-tag-info'>
          <span className='home-page__featured-drop-tag-label' onClick={goToArtistOnClick}>
            {dropName}, by {artistName}
          </span>
        </div>
      </div>
    </>
  );
}

export default FeaturedDrop;
