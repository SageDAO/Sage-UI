import { GetStaticPropsContext, GetStaticPathsResult, GetStaticPropsResult } from 'next';
import prisma from '@/prisma/client';
import { Drop as DropType, Lottery, Prisma, User } from '@prisma/client';
import { Lottery_include_Nft, Auction_include_Nft } from '@/prisma/types';
import LotteryTile from '@/components/Tiles/LotteryTile';
import AuctionTile from '@/components/Tiles/AuctionTile';
import { BaseMedia, PfpImage } from '@/components/Media';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useTicketCount } from '@/hooks/useTicketCount';
import React from 'react';
import Logotype from '@/components/Logotype';

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
  //TODO: restrict access to unapproved drops
  if (!drop) {
    return (
      <div className=''>Oops it appears the drop you are trying to reach is not available</div>
    );
  }
  const hasAuctions: boolean = auctions.length > 0;
  const hasDrawings: boolean = drawings.length > 0;
  const hasLotteries: boolean = lotteries.length > 0;

  return (
    <>
      <header className='drop-page__parallax-base'>
        <img src={drop.bannerImageS3Path} className='drop-page__parallax-img' />
      </header>
      <div className='page drop-page'>
        <section className='drop-page__header'>
          <div className='drop-page__header-logotype'>
            <Logotype />
          </div>
          <div className='drop-page__header-drop-info'></div>
        </section>
        <section className='drop-page__content'>
          <div className='drop-page__grid'>
            <div className='drop-page__grid-item'>
              <div className='drop-page__grid-item-img'>
                <BaseMedia src={drop.bannerImageS3Path}></BaseMedia>
              </div>
              <div className='drop-page__grid-item-info'></div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<Props>> {
  const dropPageQuery = Prisma.validator<Prisma.DropArgs>()({
    include: {
      Artist: true,
      Lotteries: { include: { Nfts: true } },
      Auctions: { include: { Nft: true } },
    },
  });

  if (!params) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    };
  }

  const drop = await prisma.drop.findFirst({
    ...dropPageQuery,
    where: { id: Number(params.id) },
  });

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
  let drops: DropType[] = await prisma.drop.findMany({
    where: {
      approvedAt: {
        not: null,
      },
    },
  });

  const paths = drops.map((drop) => ({
    params: { id: String(drop.id) },
  }));
  return { paths, fallback: 'blocking' };
}
