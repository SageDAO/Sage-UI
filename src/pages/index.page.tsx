import prisma from '@/prisma/client';
import React, { useState } from 'react';
import { Drop_include_GamesAndArtist, Nft, User } from '@/prisma/types';
import { getHomePageData, getSageMediumData } from '@/prisma/functions';
import EventSlider from '@/components/Pages/Home/EventSlider';
import UpcomingDrops from '@/components/Pages/Home/UpcomingDrops';
import FeaturedDrop from '@/components/Pages/Home/FeaturedDrop';
import LatestArtists from '@/components/Pages/Home/LatestArtists';
import NewArtworks from '@/components/Pages/Home/NewArtworks';
import Logotype from '@/components/Logotype';
import LaunchTrailer from '@/components/LaunchTrailer';
import { BaseMedia, PfpImage } from '@/components/Media/BaseMedia';
import ArrowDownSVG from '@/public/interactive/arrow-down.svg';
import useSageRoutes from '@/hooks/useSageRoutes';
import useWindowDimensions from '@/hooks/useWindowSize';
import VideoJS from '@/components/Media/VideoJS';

interface Props extends Awaited<ReturnType<typeof getHomePageData>> {
  // featuredDrop: Drop_include_GamesAndArtist;
  // upcomingDrops: Drop_include_GamesAndArtist[];
  mediumData: any;
  // welcomeMessage: string;
  // latestArtists: User[];
  // newArtworks: ;
}

function home({
  featuredDrop,
  upcomingDrops,
  mediumData,
  welcomeMessage,
  latestArtists,
  newArtworks,
}: Props) {
  const { isMobile } = useWindowDimensions();
  const [coverOn, setCoverOn] = useState(true);
  const welcomeMessageArray = welcomeMessage.split(',');
  function removeCover() {
    setCoverOn(false);
  }
  const { pushToCreators, pushToDrops } = useSageRoutes();

  const videoJsOptions = {
    autoplay: true,
    loop: true,
    controls: false,
    responsive: false,
    muted: true,
    sources: [
      {
        src: 'https://d180qjjsfkqvjc.cloudfront.net/trailers/drop1_desktop.mp4',
        // type: 'application/x-mpegURL',
        type: 'video/mp4',
      },
    ],
  };

  return (
    <div className='home-page' data-cy='home-page' data-on={coverOn}>
      <div className='home-page__cover' data-on={coverOn}>
        <VideoJS options={videoJsOptions} onReady={() => {}} />
        <div onClick={removeCover} data-on={coverOn} className='home-page__cover-arrow'>
          <ArrowDownSVG className='home-page__cover-arrow-svg' data-on={coverOn}></ArrowDownSVG>
        </div>
      </div>
      <div data-on={isMobile ? coverOn : false} className='home-page__main'>
        <Logotype></Logotype>
        <LaunchTrailer
          onClick={() => {
            pushToDrops(featuredDrop?.id);
          }}
        ></LaunchTrailer>

        {featuredDrop && (
          <div className='home-page__featured-drop-tag-section'>
            <div className='home-page__featured-drop-tag-info'>
              <div
                className='home-page__featured-drop-pfp'
                onClick={() => pushToCreators(featuredDrop.NftContract.Artist.username)}
              >
                <PfpImage src={featuredDrop.NftContract.Artist.profilePicture}></PfpImage>
              </div>
              <span className='home-page__featured-drop-tag-label'>
                {featuredDrop.name} by {featuredDrop.NftContract.Artist.username}
              </span>
            </div>
          </div>
        )}

        <h1 className='home-page__statement'>
          {welcomeMessageArray[0] + ','} <pre /> {welcomeMessageArray[1]}
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
        <NewArtworks newArtworks={newArtworks}></NewArtworks>
        <EventSlider mediumData={mediumData} />
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const { featuredDrop, upcomingDrops, welcomeMessage, newArtworks, latestArtists } =
    await getHomePageData(prisma);
  const mediumData = await getSageMediumData();
  return {
    props: {
      newArtworks,
      featuredDrop,
      upcomingDrops,
      mediumData,
      welcomeMessage,
      latestArtists,
    },
    revalidate: 60,
  };
}

export default home;
