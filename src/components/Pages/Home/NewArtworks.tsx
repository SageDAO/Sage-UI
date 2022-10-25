import { BaseMedia, PfpImage } from '@/components/Media/BaseMedia';
import useSageRoutes from '@/hooks/useSageRoutes';
import { getHomePageData } from '@/prisma/functions';
import { NewArtwork } from '@/prisma/types';
import { Nft, User } from '@prisma/client';
import { Fragment } from 'react';

interface Props {
  newArtworks: NewArtwork[];
}
export default function NewArtworks({ newArtworks }: Props) {
  const { pushToCreators, pushToDrops } = useSageRoutes();
  if (!newArtworks) return null;
  return (
    <>
      <div className='home-page__new-artworks-header-section'>
        <p className='home-page__new-artworks-header'>NEW ARTWORK</p>
        {/* <p className='home-page__new-artworks-subheader'>Fresh mints by SAGE creators</p> */}
      </div>
      <section className='home-page__new-artworks-section'>
        <div className='home-page__new-artworks-flex-container'>
          {newArtworks.map((nftArtwork) => {
            return <NewArtworksTile {...nftArtwork} key={nftArtwork.s3Path} />;
          })}
        </div>
      </section>
      <section className='home-page__new-artworks-section--mobile'>
        <div className='home-page__new-artworks-flex-container--mobile'>
          {newArtworks.map((nft) => {
            return <NewArtworksTile {...nft} key={nft.s3Path} />;
          })}
        </div>
      </section>
    </>
  );
}

interface NewArtworksTileProps extends NewArtwork {}

function NewArtworksTile({ s3Path, artistUsername, name, profilePicture }: NewArtworksTileProps) {
  console.log(s3Path);
  return (
    <div key={s3Path} onClick={() => {}} className='home-page__new-artworks-item'>
      <div className='home-page__new-artworks-media'>
        <BaseMedia src={s3Path}></BaseMedia>
      </div>
      <div className='home-page__new-artworks-item-content'>
        <div className='home-page__new-artworks-item-pfp'>
          <PfpImage src={profilePicture}></PfpImage>
        </div>
        <div className='home-page__new-artworks-item-right'>
          <p className='home-page__new-artworks-item-name'>{name}</p>
          <p className='home-page__new-artworks-item-artist-name'>
            {artistUsername && `By ${artistUsername}`}
          </p>
        </div>
      </div>
    </div>
  );
}
