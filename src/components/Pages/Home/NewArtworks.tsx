import { BaseMedia, PfpImage } from '@/components/Media/BaseMedia';
import useSageRoutes from '@/hooks/useSageRoutes';
import { getHomePageData } from '@/prisma/functions';
import { Nft } from '@prisma/client';

interface Props {
  newArtworks: Awaited<ReturnType<typeof getHomePageData>>['newArtworks'];
}
export default function NewArtworks({ newArtworks }: Props) {
  const { pushToCreators, pushToDrops } = useSageRoutes();
  if (!newArtworks) return null;
  return (
    <section className='home-page__new-artworks-section'>
      <p className='home-page__new-artworks-header'>NEW ARTWORK</p>
      <div className='home-page__new-artworks-flex-container'>
        {newArtworks.map((nft) => {
          console.log(nft);
          const artist = nft.NftContract?.Artist;
          return (
            <div key={nft.id} onClick={() => {}} className='home-page__new-artworks-item'>
              <div className='home-page__new-artworks-media'>
                <BaseMedia src={nft.s3Path}></BaseMedia>
              </div>
              <div className='home-page__new-artworks-item-content'>
                <div className='home-page__new-artworks-item-pfp'>
                  <PfpImage src={artist?.profilePicture}></PfpImage>
                </div>
                <div className='home-page__new-artworks-item-right'>
                  <p className='home-page__new-artworks-item-name'>{nft.name}</p>
                  <p className='home-page__new-artworks-item-artist-name'>
                    {artist?.username && `By ${artist?.username}`}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
