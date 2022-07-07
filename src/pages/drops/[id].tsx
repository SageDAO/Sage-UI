import { GetStaticPropsContext, GetStaticPathsResult, GetStaticPropsResult } from 'next';
import prisma from '@/prisma/client';
import { Drop as DropType, Lottery, User } from '@prisma/client';
import { Lottery_include_Nft, Auction_include_Nft } from '@/prisma/types';
import { BaseMedia } from '@/components/Media';
import { useSession } from 'next-auth/react';
import { useTicketCount } from '@/hooks/useTicketCount';
import React from 'react';
import Logotype from '@/components/Logotype';
import { useRouter } from 'next/router';
import { getIndividualDropsPagePaths, getIndividualDropsPageData } from '@/prisma/functions';

//determines the type interface received from getStaticProps()
interface Props {
  drop: DropType;
  artist: User;
  lotteries: Lottery_include_Nft[];
  drawings: Lottery_include_Nft[];
  auctions: Auction_include_Nft[];
}

function filterDrawingsFromLottery(array: Lottery_include_Nft[]) {
  return {
    drawings: array.filter((l: Lottery_include_Nft) => l.Nfts.length == 1),
    lotteries: array.filter((l: Lottery_include_Nft) => l.Nfts.length > 1),
  };
}

export default function drop({ drop, auctions, artist, lotteries, drawings }: Props) {
  const { data: sessionData } = useSession();
  const walletAddress = sessionData?.address;
  const ticketCount = useTicketCount(
    new Array().concat(drawings, lotteries) as Lottery[],
    walletAddress as string
  );
  // const hasAuctions: boolean = auctions.length > 0;
  // const hasDrawings: boolean = drawings.length > 0;
  // const hasLotteries: boolean = lotteries.length > 0;
  const router = useRouter();

  return (
    <>
      <div className='drop-page__parallax-base'>
        <img src={drop.bannerImageS3Path} className='drop-page__parallax-img' />
      </div>
      <div className='page drop-page'>
        <header className='drop-page__header'>
          <div className='drop-page__header-logotype'>
            <Logotype />
          </div>
          <section className='drop-page__header-drop-info'>
            <div className='drop-page__header-logo-column'>
              <div className='drop-page__header-logo-container'>
                <BaseMedia src='/icons/sage.svg'></BaseMedia>
              </div>
            </div>
            <div className='drop-page__header-main-column'>
              <h1 className='drop-page__header-drop-name'>
                {drop.name} by {artist.displayName}
              </h1>
              <p className='drop-page__header-drop-description'>{drop.description}</p>
              <div className='drop-page__header-drop-details'>
                <h1 className='drop-page__header-drop-details-item'>drop detail</h1>
                <h1 className='drop-page__header-drop-details-item'>drop detail</h1>
                <h1 className='drop-page__header-drop-details-item'>drop detail</h1>
                <h1 className='drop-page__header-drop-details-item'>drop detail</h1>
                <h1 className='drop-page__header-drop-details-item'>drop detail</h1>
                <h1 className='drop-page__header-drop-details-item'>drop detail</h1>
              </div>
            </div>
          </section>
        </header>
        <section className='drop-page__content'>
          <div className='drop-page__grid'>
            {lotteries.map((l) => {
              return (
                <div
                  className='drop-page__grid-item'
                  onClick={() => router.push(`/games/lotteries/${l.id}`)}
                >
                  <div className='drop-page__grid-item-img'>
                    <BaseMedia src={l.Nfts[0].s3Path}></BaseMedia>
                  </div>
                  <div className='drop-page__grid-item-info'>
                    <h1 className='drop-page__grid-item-info-drop-name'>
                      {drop.name} by {artist.displayName}
                    </h1>
                    <h1 className='drop-page__grid-item-info-game-name'>Lottery</h1>
                  </div>
                </div>
              );
            })}
            {drawings.map((d) => {
              return (
                <div
                  className='drop-page__grid-item'
                  onClick={() => router.push(`/games/lotteries/${d.id}`)}
                >
                  <div className='drop-page__grid-item-img'>
                    <BaseMedia src={d.Nfts[0].s3Path}></BaseMedia>
                  </div>
                  <div className='drop-page__grid-item-info'>
                    <h1 className='drop-page__grid-item-info-drop-name'>
                      {drop.name} by {artist.displayName}
                    </h1>
                    <h1 className='drop-page__grid-item-info-game-name'>{d.Nfts[0].name}</h1>
                  </div>
                </div>
              );
            })}
            {auctions.map((a) => {
              return (
                <div
                  className='drop-page__grid-item'
                  onClick={() => router.push(`/games/auctions/${a.id}`)}
                >
                  <div className='drop-page__grid-item-img'>
                    <BaseMedia src={a.Nft.s3Path}></BaseMedia>
                  </div>
                  <div className='drop-page__grid-item-info'>
                    <h1 className='drop-page__grid-item-info-drop-name'>
                      {drop.name} by {artist.displayName}
                    </h1>
                    <h1 className='drop-page__grid-item-info-game-name'>Lottery</h1>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
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

  const drop = await getIndividualDropsPageData(prisma, Number(params.id));

  if (!drop) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    };
  }

  const { drawings, lotteries } = filterDrawingsFromLottery(drop.Lotteries);

  return {
    props: {
      drop,
      artist: drop.Artist,
      auctions: drop.Auctions,
      lotteries,
      drawings,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const paths = await getIndividualDropsPagePaths(prisma);
  return { paths, fallback: 'blocking' };
}
