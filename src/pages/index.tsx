import prisma from '@/prisma/client';
import React from 'react';
import { Drop_include_GamesAndArtist } from '@/prisma/types';
import { BaseMedia } from '@/components/Media';
import { useRouter } from 'next/router';

interface Props {
  featuredDrop: Drop_include_GamesAndArtist;
  upcomingDrops: Drop_include_GamesAndArtist[];
}

function home({ featuredDrop, upcomingDrops }: Props) {
  const router = useRouter();

  return (
    <div className='home-page' data-cy='home-page'>
      <div className='home-page__hero'>
        <div className='home-page__logotype'>
          <BaseMedia src='/branding/landing-logo.svg' isVideo={false} />
        </div>
        <div className='home-page__hero-banner'>
          <BaseMedia src={featuredDrop.bannerImageS3Path} isVideo={false}></BaseMedia>
        </div>
      </div>
      <div className='home-page__featured-drop-tag'>
        <div className='home-page__featured-drop-tag-sage-logo'>
          <BaseMedia src='/icons/sage.svg' isVideo={false} />
        </div>
        <div className='home-page__featured-drop-tag-label'>
          This month active drop <br />
          artist | {featuredDrop.Artist.displayName}
        </div>
      </div>
      <div className='home-page__statement'>
        SAGE IS A NEW WAY TO HANDLE NFTS & INVESTMENTS. CURATED, HAND SELECTED FROM THE BEST OF THE
        GLOBE.
      </div>
      <div className='home-page__upcoming-drops-header'>
        <h1 className='home-page__upcoming-drops-header-left'>Upcoming Drops</h1>
        <p className='home-page__upcoming-drops-header-right'>
          <div className='home-page__upcoming-drops-header-right-dot'></div>
          <h1 className='home-page__upcoming-drops-header-right-text'>
            SAGE UPCOMING DROPS ARE CAREFULLY CURATED TO MEET THE HIGHEST VISUAL STANDARDS AND NEW
            STRUCTURES IN NFT ASSETS. A VISION IN THE CRYPTO SPACE.
          </h1>
        </p>
      </div>
      <div className='home-page__upcoming-drops-grid'>
        {upcomingDrops.map((d, i: number) => {
          if (i > 3) return;
          const src = d.bannerImageS3Path;
          const onClick = () => {
            router.push(`/drops/${d.id}`);
          };
          const text = `${d.name} by ${d.Artist.displayName}`;
          return (
            <div className='home-page__upcoming-drops-tile' key={d.id} onClick={onClick}>
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
  );
}

export async function getStaticProps() {
  let drops: Drop_include_GamesAndArtist[] = await prisma.drop.findMany({
    where: { approvedAt: { not: null } },
    include: {
      Artist: true,
      Lotteries: { include: { Nfts: true } },
      Auctions: { include: { Nft: true } },
    },
  });

  const upcomingDrops = drops.sort((a, b) => +b.createdAt - +a.createdAt);
  const featuredDrop = upcomingDrops[0];

  return {
    props: {
      featuredDrop,
      upcomingDrops,
    },
    revalidate: 60,
  };
}

export default home;
