import { GetStaticPropsContext, GetStaticPathsResult, GetStaticPropsResult } from 'next';
import prisma from '@/prisma/client';
import { Drop as DropType, Lottery, Nft, User } from '@prisma/client';
import { Lottery_include_Nft, Auction_include_Nft } from '@/prisma/types';
import { BaseMedia } from '@/components/Media';
import { useTicketCount } from '@/hooks/useTicketCount';
import React from 'react';
import Logotype from '@/components/Logotype';
import { getIndividualDropsPagePaths, getIndividualDropsPageData } from '@/prisma/functions';
import System, { computeDropSystems } from '@/components/Icons/System';
import AuctionTile from '@/components/Pages/DropIndividual/AuctionTile';
import DrawingTile from '@/components/Pages/DropIndividual/DrawingTile';
import LotteryTile from '@/components/Pages/DropIndividual/LotteryTile';
import SageLogoSVG from '@/public/icons/sage.svg';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { reformatDate } from '@/utilities/strings';

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
    drawings: array.filter((l: Lottery_include_Nft) => unique(l.Nfts, 's3Path').length == 1),
    lotteries: array.filter((l: Lottery_include_Nft) => unique(l.Nfts, 's3Path').length > 1),
  };
}

function unique(array: any[], propertyName: string) {
  return array.filter((e, i) => array.findIndex((a) => a[propertyName] === e[propertyName]) === i);
}

function computeEditionSize(nfts: Nft[]) {
  let editionSize = 0;
  const uniqueImages = unique(nfts, 's3Path');
  uniqueImages.forEach((nft) => {
    editionSize += nft.numberOfEditions;
  });
  return editionSize;
}

function computeDropEditionSize({
  drawings,
  auctions,
  lotteries,
}: Pick<Props, 'drawings' | 'auctions' | 'lotteries'>) {
  let dropEditionSize: number = 0;
  drawings.forEach((d) => {
    dropEditionSize += computeEditionSize(d.Nfts);
  });
  lotteries.forEach((l) => {
    dropEditionSize += computeEditionSize(l.Nfts);
  });
  auctions.forEach((a) => {
    dropEditionSize += computeEditionSize([a.Nft]);
  });
  return dropEditionSize;
}

export default function drop({ drop, auctions, artist, lotteries, drawings }: Props) {
  const systems = computeDropSystems({ lotteries, auctions, drawings });
  const editionSize = computeDropEditionSize({ lotteries, auctions, drawings });
  const { data: sessionData } = useSession();
  const ticketCountMap = useTicketCount(
    new Array().concat(drawings, lotteries),
    sessionData?.address as string
  );

  return (
    <>
      <div className='drop-page__banner-base'>
        <Image src={drop.bannerImageS3Path} layout='fill' objectFit='cover' />
      </div>
      <div className='drop-page'>
        <header className='drop-page__header'>
          <div className='drop-page__header-logotype'>
            <Logotype />
          </div>
          <section className='drop-page__header-drop-info'>
            <div className='drop-page__header-main-column'>
              <h1 className='drop-page__header-drop-name'>
                {drop.name} by {artist.username}
              </h1>
              <p className='drop-page__header-drop-description'>{drop.description}</p>
              <div className='drop-page__header-drop-details'>
                <h1 className='drop-page__header-drop-details-item'>
                  MINTED BY: {artist.username}
                </h1>
                <h1 className='drop-page__header-drop-details-item'>edition size: {editionSize}</h1>
                <h1 className='drop-page__header-drop-details-item'>
                  creation date: {reformatDate(drop.createdAt)}
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
              return (
                <LotteryTile
                  key={l.id}
                  imgSrc={l.Nfts[0].s3Path}
                  dropName={drop.name}
                  artist={artist}
                  editionSize={computeEditionSize(l.Nfts)}
                  lottery={l}
                  tickets={ticketCountMap ? ticketCountMap[l.id] : 0}
                />
              );
            })}
            {drawings.map((d) => {
              return (
                <DrawingTile
                  key={d.id}
                  imgSrc={d.Nfts[0].s3Path}
                  dropName={drop.name}
                  artist={artist}
                  editionSize={d.Nfts[0].numberOfEditions}
                  drawing={d}
                  tickets={ticketCountMap ? ticketCountMap[d.id] : 0}
                />
              );
            })}
            {auctions.map((a) => {
              return (
                <AuctionTile
                  key={a.id}
                  imgSrc={a.Nft.s3Path}
                  dropName={drop.name}
                  artist={artist}
                  editionSize={a.Nft.numberOfEditions}
                  auction={a}
                />
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
  const artist = drop.NftContract.Artist;

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
