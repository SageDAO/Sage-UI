import prisma from '@/prisma/client';
import React from 'react';
import { Drop_include_GamesAndArtist } from '@/prisma/types';
import Hero from '@/components/Hero';
import { getHomePageData, getSageMediumData } from '@/prisma/functions';
import EventSlider from '@/components/Pages/Home/EventSlider';
import UpcomingDrops from '@/components/Pages/Home/UpcomingDrops';
import useSageRoutes from '@/hooks/useSageRoutes';

interface Props {
  featuredDrop: Drop_include_GamesAndArtist;
  upcomingDrops: Drop_include_GamesAndArtist[];
  mediumData: any;
  welcomeMessage: string;
}

function home({ featuredDrop, upcomingDrops, mediumData, welcomeMessage }: Props) {
  const { pushToCreators, pushToDrops } = useSageRoutes();
  return (
    <div className='home-page' data-cy='home-page'>
      <div className='home-page__main'>
        {featuredDrop && (
          <>
            <Hero
              bannerOnClick={() => pushToDrops(featuredDrop.id)}
              imgSrc={featuredDrop.bannerImageS3Path}
            />
            <div className='home-page__featured-drop-tag-section'>
              <div className='home-page__featured-drop-tag-info'>
                <span
                  className='home-page__featured-drop-tag-label'
                  onClick={() => {
                    pushToCreators(featuredDrop.NftContract.Artist.username);
                  }}
                >
                  Artwork by | {featuredDrop.NftContract.Artist.username}
                </span>
              </div>
            </div>
          </>
        )}
        <h1 className='home-page__statement'>{welcomeMessage}</h1>
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
  const { featuredDrop, upcomingDrops, welcomeMessage } = await getHomePageData(prisma);
  const mediumData = await getSageMediumData();
  return {
    props: {
      featuredDrop,
      upcomingDrops,
      mediumData,
      welcomeMessage,
    },
    revalidate: 60,
  };
}

export default home;
