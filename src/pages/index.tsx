import prisma from '@/prisma/client';
import React from 'react';
import { Drop_include_GamesAndArtist } from '@/prisma/types';
import Hero from '@/components/Hero';
import { getHomePageData } from '@/prisma/functions';
import EventSlider from '@/components/Pages/Home/EventSlider';
import SageIconSVG from '@/public/icons/sage.svg';
import UpcomingDrops from '@/components/Pages/Home/UpcomingDrops';
import { useRouter } from 'next/router';

interface Props {
  featuredDrop: Drop_include_GamesAndArtist;
  upcomingDrops: Drop_include_GamesAndArtist[];
}

function home({ featuredDrop, upcomingDrops }: Props) {
  const router = useRouter();
  return (
    <div className='home-page' data-cy='home-page'>
      <div className='home-page__main'>
        {featuredDrop && (
          <>
            <div onClick={() => router.push(`/drops/${featuredDrop.id}`)}>
              <Hero imgSrc={featuredDrop.bannerImageS3Path} />
            </div>
            <div
              className='home-page__featured-drop-tag'
              onClick={() => router.push(`/drops/${featuredDrop.id}`)}
            >
              <SageIconSVG className='home-page__featured-drop-tag-sage-logo' />
              <div className='home-page__featured-drop-tag-label'>
                This month active drop <br />
                artist | {featuredDrop.NftContract.Artist.username}
              </div>
            </div>
          </>
        )}

        <div className='home-page__statement'>
          SAGE IS A NEW WAY TO HANDLE NFTS & INVESTMENTS. CURATED, HAND SELECTED FROM THE BEST OF
          THE GLOBE.
        </div>
        <div className='home-page__upcoming-drops-header'>
          <h1 className='home-page__upcoming-drops-header-left'>DROPS</h1>
          <div className='home-page__upcoming-drops-header-right'>
            <div className='home-page__upcoming-drops-header-right-dot'></div>
            <h1 className='home-page__upcoming-drops-header-right-text'>
              SAGE UPCOMING DROPS ARE CAREFULLY CURATED TO MEET THE HIGHEST VISUAL STANDARDS AND NEW
              STRUCTURES IN NFT ASSETS. A VISION IN THE CRYPTO SPACE.
            </h1>
          </div>
        </div>
        <UpcomingDrops upcomingDrops={upcomingDrops}></UpcomingDrops>
        <EventSlider />
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const { featuredDrop, upcomingDrops } = await getHomePageData(prisma);
  return {
    props: {
      featuredDrop,
      upcomingDrops,
    },
    revalidate: 60,
  };
}

export default home;
