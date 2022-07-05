import { GetStaticPropsContext, GetStaticPathsResult, GetStaticPropsResult } from 'next';
import prisma from '@/prisma/client';
import { Drop as DropType, Lottery, Prisma, User } from '@prisma/client';
import { Lottery_include_Nft, Auction_include_Nft } from '@/prisma/types';
import LotteryTile from '@/components/Tiles/LotteryTile';
import AuctionTile from '@/components/Tiles/AuctionTile';
import { BaseMedia, PfpImage } from '@/components/Media';
import { useSession } from 'next-auth/react';
import { useTicketCount } from '@/hooks/useTicketCount';

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

  //TODO: add admin only functionalities
  //if (!drop.approvedBy && user?.role !== "ADMIN") return null;
  return (
    <div className='drop-page'>
      <div className='drop-page__hero'>
      </div>
    </div>
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

  //redirect to home page of data for this drop is not availablee
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

// This function gets called at build time
export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  let drops: DropType[] = await prisma.drop.findMany({
    where: {
      approvedAt: {
        not: null,
      },
    },
  });

  // Get the paths we want to pre-render based on drops
  const paths = drops.map((drop) => ({
    params: { id: String(drop.id) },
  }));
  // We'll pre-render only these paths at build time.
  // { fallback: blocking } allows for ISR, if a new page is needed for a new drop then the server will serve the page for the first request and cache static html for all future reqeusts
  return { paths, fallback: 'blocking' };
}
