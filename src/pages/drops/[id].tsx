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
import System, { computeDropSystems } from '@/components/Icons/System';
import Tile from '@/components/Pages/DropIndividual/Tile';

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

function computeEditionSize({
  drawings,
  auctions,
  lotteries,
}: Pick<Props, 'drawings' | 'auctions' | 'lotteries'>) {
  let editionSize: number = 0;

  drawings.forEach((d) => {
    d.Nfts.forEach((nft) => {
      editionSize = editionSize + nft.numberOfEditions;
    });
  });

  lotteries.forEach((l) => {
    l.Nfts.forEach((nft) => {
      editionSize = editionSize + nft.numberOfEditions;
    });
  });

  auctions.forEach((a) => {
    editionSize = editionSize + a.Nft.numberOfEditions;
  });

  return editionSize;
}

export default function drop({ drop, auctions, artist, lotteries, drawings }: Props) {
  const systems = computeDropSystems({ lotteries, auctions, drawings });
  const editionSize = computeEditionSize({ lotteries, auctions, drawings });

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
                <h1 className='drop-page__header-drop-details-item'>
                  MINTED BY: {artist.displayName}
                </h1>
                <h1 className='drop-page__header-drop-details-item'>edition size: {editionSize}</h1>
                <h1 className='drop-page__header-drop-details-item'>
                  creation date: {drop.createdAt.toLocaleDateString().replaceAll('/', '.')}
                </h1>
              </div>
              <div className='drop-page__header-drop-details-systems'>
                Systems in this drop:
                {systems.map((type) => {
                  return (
                    <div key={type} className='drop-page__systems-icon'>
                      <System type={type}></System>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </header>
        <section className='drop-page__content'>
          <div className='drop-page__grid'>
            {lotteries.map((l) => {
              let editionSize: number = 0;
              l.Nfts.forEach((nft) => {
                editionSize = editionSize + nft.numberOfEditions;
              });
              return (
                <Tile
                  key={l.id}
                  imgSrc={l.Nfts[0].s3Path}
                  dropName={drop.name}
                  artist={artist}
                  editionSize={editionSize}
                  systemType='lotteries'
                  id={l.id}
                  lottery={l}
                ></Tile>
              );
            })}
            {drawings.map((d) => {
              return (
                <Tile
                  key={d.id}
                  imgSrc={d.Nfts[0].s3Path}
                  dropName={drop.name}
                  artist={artist}
                  editionSize={d.Nfts[0].numberOfEditions}
                  systemType='drawings'
                  id={d.id}
                  lottery={d}
                ></Tile>
              );
            })}
            {auctions.map((a) => {
              return (
                <Tile
                  key={a.id}
                  imgSrc={a.Nft.s3Path}
                  dropName={drop.name}
                  artist={artist}
                  editionSize={a.Nft.numberOfEditions}
                  systemType='auctions'
                  id={a.id}
                  auction={a}
                ></Tile>
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
  const auctions = drop.Auctions;
  const artist = drop.Artist;

  return {
    props: {
      drop,
      artist,
      auctions,
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
