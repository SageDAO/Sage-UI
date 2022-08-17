import prisma from '@/prisma/client';
import React from 'react';
import { Drop_include_GamesAndArtist } from '@/prisma/types';
import Hero from '@/components/Hero';
import { getHomePageData, getSageMediumData } from '@/prisma/functions';
import EventSlider from '@/components/Pages/Home/EventSlider';
import SageIconSVG from '@/public/icons/sage.svg';
import UpcomingDrops from '@/components/Pages/Home/UpcomingDrops';
import { useRouter } from 'next/router';

interface Props {
  featuredDrop: Drop_include_GamesAndArtist;
  upcomingDrops: Drop_include_GamesAndArtist[];
  mediumData: any;
}

function home({ featuredDrop, upcomingDrops, mediumData }: Props) {
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
          SAGE is a curation system built to lead Web3. Through our selection, we mark value into
          the future.
        </div>
        <div className='home-page__upcoming-drops-header'>
          <h1 className='home-page__upcoming-drops-header-left'>drops</h1>
          <div className='home-page__upcoming-drops-header-right'>
            <div className='home-page__upcoming-drops-header-right-dot'></div>
            <h1 className='home-page__upcoming-drops-header-right-text'>
              ASH is a store of value through the destruction of NFTS.SAGE accepts the ASH currency
              as our medium of exchange.
            </h1>
          </div>
        </div>
        <UpcomingDrops upcomingDrops={upcomingDrops}></UpcomingDrops>
        <EventSlider mediumData={mediumData} />
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const { featuredDrop, upcomingDrops } = await getHomePageData(prisma);
  const mediumData = await getSageMediumData();
  return {
    props: {
      featuredDrop,
      upcomingDrops,
      mediumData,
    },
    revalidate: 60,
  };
}

export default home;
