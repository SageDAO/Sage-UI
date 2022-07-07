import prisma from '@/prisma/client';
import React from 'react';
import { Drop_include_GamesAndArtist } from '@/prisma/types';
import { BaseMedia } from '@/components/Media';
import { useRouter } from 'next/router';
import Hero from '@/components/Hero';
import Countdown from '@/components/Countdown';
import { computeDropStatus } from '@/utilities/status';
import { getHomePageData } from '@/prisma/functions';

interface Props {
  featuredDrop: Drop_include_GamesAndArtist;
  upcomingDrops: Drop_include_GamesAndArtist[];
}

function home({ featuredDrop, upcomingDrops }: Props) {
  const router = useRouter();

  return (
    <>
      <div className='home-page page' data-cy='home-page'>
        <div className='home-page__main'>
          <Hero imgSrc={featuredDrop.bannerImageS3Path} />
          <div
            className='home-page__featured-drop-tag'
            onClick={() => router.push(`/drops/${featuredDrop.id}`)}
          >
            <div className='home-page__featured-drop-tag-sage-logo'>
              <BaseMedia src='/icons/sage.svg' isVideo={false} />
            </div>
            <div className='home-page__featured-drop-tag-label'>
              This month active drop <br />
              artist | {featuredDrop.Artist.displayName}
            </div>
          </div>
          <div className='home-page__statement'>
            SAGE IS A NEW WAY TO HANDLE NFTS & INVESTMENTS. CURATED, HAND SELECTED FROM THE BEST OF
            THE GLOBE.
          </div>
          <div className='home-page__upcoming-drops-header'>
            <h1 className='home-page__upcoming-drops-header-left'>Upcoming Drops</h1>
            <div className='home-page__upcoming-drops-header-right'>
              <div className='home-page__upcoming-drops-header-right-dot'></div>
              <h1 className='home-page__upcoming-drops-header-right-text'>
                SAGE UPCOMING DROPS ARE CAREFULLY CURATED TO MEET THE HIGHEST VISUAL STANDARDS AND
                NEW STRUCTURES IN NFT ASSETS. A VISION IN THE CRYPTO SPACE.
              </h1>
            </div>
          </div>
          <div className='home-page__upcoming-drops-grid'>
            {upcomingDrops.map((d) => {
              const src = d.bannerImageS3Path;
              async function onClick() {
                await router.push(`/drops/${d.id}`);
              }
              const text = `${d.name} by ${d.Artist.displayName}`;
              const { startTime, status } = computeDropStatus(d);
              const display = status === 'Upcoming' ? <Countdown endTime={startTime} /> : status;
              return (
                <div className='home-page__upcoming-drops-tile' key={d.id} onClick={onClick}>
                  <div className='home-page__upcoming-drops-countdown' data-status={status}>
                    {display}
                  </div>

                  <BaseMedia src={src} isVideo={false} />
                  <h1 className='home-page__upcoming-drops-tile-tag'>
                    {text}
                    <br />
                    sage curated
                  </h1>
                </div>
              );
            })}
          </div>
        </div>
        <div className='home-page__events'>
          <div className='home-page__event-slide'>
            <h1 className='home-page__event-slide-header'>
              news / events / <br /> interviews / blog
            </h1>
            <BaseMedia src={'/sample/events/perseus.png'} isVideo={false} />
            <div className='home-page__event-slide-focus' />
            <div className='home-page__event-slide-content'>
              <div className='home-page__event-slide-content-left'></div>
              <div className='home-page__event-slide-content-right'></div>
            </div>
          </div>
        </div>
      </div>
    </>
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
