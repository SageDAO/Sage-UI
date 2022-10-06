import Hero from '@/components/Hero';
import { PfpImage } from '@/components/Media/BaseMedia';
import useDrop, { UseDropArgs } from '@/hooks/useDrop';
import useSageRoutes from '@/hooks/useSageRoutes';
import React from 'react';

interface Props extends UseDropArgs {}

function FeaturedDrop({ drop, artist, Lotteries, Auctions }: Props) {
  const { goToDropOnClick, goToArtistOnClick, bannerImgSrc, dropName, artistName } = useDrop({
    drop,
    artist,
    Lotteries,
    Auctions,
  });
  const { pushToCreators } = useSageRoutes();
  if (!drop) return null;
  return (
    <>
      <Hero bannerOnClick={goToDropOnClick} imgSrc={bannerImgSrc} />
      <div className='home-page__featured-drop-tag-section'>
        <div className='home-page__featured-drop-tag-info'>
          <div
            className='home-page__featured-drop-pfp'
            onClick={() => pushToCreators(artist.username)}
          >
            <PfpImage src={artist.profilePicture}></PfpImage>
          </div>
          <span className='home-page__featured-drop-tag-label' onClick={goToArtistOnClick}>
            {dropName} by {artistName}
          </span>
        </div>
      </div>
    </>
  );
}

export default FeaturedDrop;
