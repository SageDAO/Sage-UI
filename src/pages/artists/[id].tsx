import { GetStaticPropsContext, GetStaticPathsResult, GetStaticPropsResult } from 'next';
import { User } from '@prisma/client';
import prisma from '@/prisma/client';
import Hero from '@/components/Hero';
import { getIndividualArtistsPageData, getIndividualArtistsPagePaths } from '@/prisma/functions';
import { useBuySingleNftMutation, useGetArtistNftsQuery } from '@/store/nftsReducer';
import shortenAddress from '@/utilities/shortenAddress';
import { useSigner } from 'wagmi';
import { toast } from 'react-toastify';
import { Nft_include_NftContract } from '@/prisma/types';
import { PfpImage } from '@/components/Media';
import Image from 'next/image';
import Tile from '@/components/Pages/DropIndividual/Tile';
import ListingTile from '@/components/Pages/DropIndividual/ListingTile';

interface Props {
  artist: User;
}

export default function artist({ artist }: Props) {
  const { data: nfts } = useGetArtistNftsQuery(artist.walletAddress);
  const artistSocials = [artist.mediumUsername, artist.twitterUsername, artist.instagramUsername];

  return (
    <div className='artist-page' data-cy='artist-page'>
      <Hero imgSrc={artist.profilePicture || '/'} />
      <h1 className='artist-page__banner-label'>part of this month active drop</h1>
      <div className='artist-page__artist-section'>
        <div className='artist-page__artist-section-flex-x'>
          <div className='artist-page__pfp-container'>
            <PfpImage src={artist.profilePicture}></PfpImage>
          </div>
          <div>
            <h1 className='artist-page__name'>{artist.displayName}</h1>
            <ul className='artist-page__socials'>
              <li className='artist-page__socials-item'>
                <Image layout='fill' src='/socials/twitter.svg'></Image>
              </li>
              <li className='artist-page__socials-item'>
                <Image layout='fill' src='/socials/medium.svg'></Image>
              </li>
              <li className='artist-page__socials-item'>
                <Image layout='fill' src='/socials/insta.svg'></Image>
              </li>
              <li className='artist-page__socials-item'>
                <Image layout='fill' src='/socials/web.svg'></Image>
              </li>
            </ul>
          </div>
        </div>
        <button className='artist-page__connect'>connect</button>
      </div>
      <p className='artist-page__bio'>{artist.bio}</p>

      <section className='drop-page__content'>
        <div className='drop-page__grid'>
          {nfts &&
            nfts.map((nft: Nft_include_NftContract, i: number) => <ListingTile key={i} nft={nft} artist={artist} />)}
        </div>
      </section>
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
