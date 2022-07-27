import prisma from '@/prisma/client';
import { motion } from 'framer-motion';
import React from 'react';
import { Drop_include_GamesAndArtist } from '@/prisma/types';
import { BaseMedia } from '@/components/Media';
import { useRouter } from 'next/router';
import Hero from '@/components/Hero';
import Countdown from '@/components/Countdown';
import { computeDropStatus } from '@/utilities/status';
import { getHomePageData } from '@/prisma/functions';
import EventSlider from '@/components/Pages/Home/EventSlider';
import variants from '@/animations/index';

interface Props {
  featuredDrop: Drop_include_GamesAndArtist;
  upcomingDrops: Drop_include_GamesAndArtist[];
}

function home({ featuredDrop, upcomingDrops }: Props) {
  const router = useRouter();

  return (
    <motion.div
      className='home-page'
      initial={'pageInitial'}
      animate={'pageAnimate'}
      variants={variants}
      data-cy='home-page'
    >
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
              <div className='home-page__featured-drop-tag-sage-logo'>
                <BaseMedia src='/icons/sage.svg' isVideo={false} />
              </div>
              <div className='home-page__featured-drop-tag-label'>
                This month active drop <br />
                artist | {featuredDrop.NftContract.Artist.displayName}
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
        <div className='home-page__upcoming-drops-grid'>
          {upcomingDrops.map((d, i: number) => {
            const src = d.bannerImageS3Path;

            //handle drop tile span behavior
            let shouldTileSpanTwoColumns: boolean = false;
            const isIndexEven = Boolean(i % 2 === 0);
            const nextIndexNull = Boolean(!upcomingDrops[i + 1]);
            if (isIndexEven && nextIndexNull) {
              shouldTileSpanTwoColumns = true;
            }

            async function onClick() {
              await router.push(`/drops/${d.id}`);
            }
            const text = `${d.name} by ${d.NftContract.Artist.displayName}`;
            const { startTime, status } = computeDropStatus(d);
            const display = status === 'Upcoming' ? <Countdown endTime={startTime} /> : status;
            return (
              <div
                data-span2={String(shouldTileSpanTwoColumns)}
                className='home-page__upcoming-drops-tile'
                key={d.id}
                onClick={onClick}
              >
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
      <EventSlider />
    </motion.div>
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
