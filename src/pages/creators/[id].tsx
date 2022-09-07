import { GetStaticPropsContext, GetStaticPathsResult, GetStaticPropsResult } from 'next';
import prisma from '@/prisma/client';
import Hero from '@/components/Hero';
import { getIndividualArtistsPageData, getIndividualArtistsPagePaths } from '@/prisma/functions';
import { useGetListingNftsByArtistQuery } from '@/store/nftsReducer';
import { Nft_include_NftContractAndOffers, User_include_NftContract } from '@/prisma/types';
import { PfpImage } from '@/components/Media/BaseMedia';
import ListingTile from '@/components/Pages/DropIndividual/ListingTile';
import TwitterSVG from '@/public/socials/twitter.svg';
import MediumSVG from '@/public/socials/medium.svg';
import InstagramSVG from '@/public/socials/insta.svg';
import WebSVG from '@/public/socials/web.svg';
import FollowButton from '@/components/Pages/Artists/FollowButton';
import ArtistBalancePanel from '@/components/Pages/Artists/ArtistBalancePanel';
import { useSession } from 'next-auth/react';

type ListingNft = Nft_include_NftContractAndOffers;

/**
 * Display unsold items first; then newest on top.
 */
function sort(a: ListingNft, b: ListingNft) {
  if (!a.ownerAddress) {
    return b.ownerAddress ? -1 : b.id - a.id;
  }
  return b.ownerAddress ? b.id - a.id : 1;
}

interface Props {
  artist: User_include_NftContract;
}

export default function artist({ artist }: Props) {
  const { data: sessionData } = useSession();
  const { data: nfts } = useGetListingNftsByArtistQuery(artist.walletAddress);
  const isOwner = () => sessionData?.address == artist.walletAddress;

  return (
    <div className='artist-page' data-cy='artist-page'>
      <Hero imgSrc={artist.bannerImageS3Path || artist.profilePicture || '/'} />
      <h1 className='artist-page__banner-label'>part of this month active drop</h1>
      <div className='artist-page__artist-section'>
        <div className='artist-page__artist-section-flex-x'>
          <div className='artist-page__pfp-container'>
            <PfpImage className='artist-page__pfp' src={artist.profilePicture}></PfpImage>
          </div>
          <div>
            <h1 className='artist-page__name'>{artist.username}</h1>
            <ul className='artist-page__socials'>
              {!!artist.twitterUsername && (
                <div className='artist-page__socials-item'>
                  <a target='_blank' href={`https://twitter.com/${artist.twitterUsername}`}>
                    <TwitterSVG className='artist-page__socials-svg' />
                  </a>
                </div>
              )}
              {!!artist.mediumUsername && (
                <div className='artist-page__socials-item'>
                  <a target='_blank' href={`https://medium.com/@${artist.mediumUsername}`}>
                    <MediumSVG className='artist-page__socials-svg' />
                  </a>
                </div>
              )}
              {!!artist.instagramUsername && (
                <div className='artist-page__socials-item'>
                  <a target='_blank' href={`https://instagram.com/${artist.instagramUsername}`}>
                    <InstagramSVG className='artist-page__socials-svg' />
                  </a>
                </div>
              )}
              {!!artist.webpage && (
                <div className='artist-page__socials-item'>
                  <a
                    target='_blank'
                    href={
                      artist.webpage.startsWith('http')
                        ? artist.webpage
                        : `https://${artist.webpage}`
                    }
                  >
                    <WebSVG className='artist-page__socials-svg' />
                  </a>
                </div>
              )}
            </ul>
          </div>
          {false && isOwner() && (
            <div style={{ width: '100%' }}>
              <ArtistBalancePanel artistContractAddress={artist.NftContract?.contractAddress} />
            </div>
          )}
        </div>
        <FollowButton artistAddress={artist.walletAddress} />
      </div>
      <div className='artist-page__bio-container'>
        <p className='artist-page__bio'>{artist.bio}</p>
      </div>
      <div className='artist-page__grid'>
        {nfts &&
          [...nfts]
            .sort(sort)
            .map((nft: ListingNft, i: number) => <ListingTile key={i} nft={nft} artist={artist} />)}
      </div>
    </div>
  );
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<Props>> {
  if (!params) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    };
  }

  const artist = await getIndividualArtistsPageData(prisma, String(params.id));

  if (!artist) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    };
  }

  return { props: { artist } };
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const paths = await getIndividualArtistsPagePaths(prisma);
  return { paths, fallback: 'blocking' };
}
