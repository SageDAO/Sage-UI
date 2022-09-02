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
          <div onClick={() => router.push(`/drops/${featuredDrop.id}`)}>
            <Hero imgSrc={featuredDrop.bannerImageS3Path} />
          </div>
        )}

        <h1 className='home-page__statement'>
          SAGE is a curation system built to lead Web3. Through our selection, we mark value into
          the future.
        </h1>
        <div className='home-page__upcoming-drops-header'>
          <h1 className='home-page__upcoming-drops-header-left'>drops</h1>
          <div className='home-page__upcoming-drops-header-right'>
            <div className='home-page__upcoming-drops-header-right-dot'></div>
            <h1 className='home-page__upcoming-drops-header-right-text'>
              We only accept ASH as a medium of exchange. ASH is a store of value generated through
              the process of burning NFTs.
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
