import { GetStaticPropsContext, GetStaticPathsResult, GetStaticPropsResult } from 'next';
import { User } from '@prisma/client';
import prisma from '@/prisma/client';
import Hero from '@/components/Hero';
import { getIndividualArtistsPageData, getIndividualArtistsPagePaths } from '@/prisma/functions';
import { useBuySingleNftMutation, useGetArtistNftsQuery } from '@/store/nftsReducer';
import { useSigner } from 'wagmi';
import { toast } from 'react-toastify';
import { Nft_include_NftContract } from '@/prisma/types';
import { PfpImage } from '@/components/Media';
import ListingTile from '@/components/Pages/DropIndividual/ListingTile';
import TwitterSVG from '@/public/socials/twitter.svg';
import MediumSVG from '@/public/socials/medium.svg';
import InstagramSVG from '@/public/socials/insta.svg';
import WebSVG from '@/public/socials/web.svg';
import variants from '@/animations/index';
import { motion } from 'framer-motion';

interface Props {
  artist: User;
}

export default function artist({ artist }: Props) {
  const { data: nfts } = useGetArtistNftsQuery(artist.walletAddress);
  const [buySingleNft] = useBuySingleNftMutation();
  const { data: signer } = useSigner();
  const handleBuyClick = async (artistContractAddress: string, nftId: number, price: number) => {
    if (!signer) {
      toast.info('Please Sign In before placing orders.');
      return;
    }
    await buySingleNft({ artistContractAddress, nftId, price, signer });
  };

  return (
    <motion.div
      className='artist-page'
      initial={'pageInitial'}
      animate={'pageAnimate'}
      variants={variants}
      data-cy='artist-page'
    >
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
              <div className='socials-item'>
                <TwitterSVG className='artist-page__socials-svg' />
              </div>
              <div className='socials-item'>
                <MediumSVG className='artist-page__socials-svg' />
              </div>
              <div className='socials-item'>
                <InstagramSVG className='artist-page__socials-svg' />
              </div>
              <div className='socials-item'>
                <WebSVG className='artist-page__socials-svg' />
              </div>
            </ul>
          </div>
        </div>
        <button className='artist-page__connect'>connect</button>
      </div>
      <p className='artist-page__bio'>{artist.bio}</p>

      <section className='drop-page__content'>
        <div className='drop-page__grid'>
          {nfts &&
            nfts.map((nft: Nft_include_NftContract, i: number) => (
              <ListingTile key={i} nft={nft} artist={artist} />
            ))}
        </div>
      </section>
    </motion.div>
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
