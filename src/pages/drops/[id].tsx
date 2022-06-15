import { GetStaticPropsContext, GetStaticPathsResult, GetStaticPropsResult } from 'next';
import prisma from '@/prisma/client';
import { Drop as DropType, Lottery, Prisma, User } from '@prisma/client';
import { Lottery_include_Nft, Auction_include_Nft } from '@/prisma/types';
import DrawingTile from '@/components/Tiles/DrawingTile';
import LotteryTile from '@/components/Tiles/LotteryTile';
import AuctionTile from '@/components/Tiles/AuctionTile';
import { BaseImage, PfpImage } from '@/components/Image';
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
        <BaseImage src={drop.bannerImageS3Path} />
      </div>
      {/* --------------------DROP INFO------------------------ */}
      <section className='drop-page__dropinfo'>
        <div className='drop-page__details'>
          <div className='artist'>
            <div className='artist__pfp'>
              <PfpImage src={artist.profilePicture as string} />
            </div>
            <div className='artist__info'>
              {/* TODO: display using new artist name field */}
              <div className='artist__name'>{artist.displayName}</div>
              <div className='artist__handle'>@{artist.username}</div>
            </div>
          </div>
          <div className='description'>
            <h1 className='description__title'>{drop.name}</h1>
            <p className='description__content'>{drop.description}</p>
          </div>
        </div>
        <div className='drop-page__mechanics'>
          <h1 className='header'>
            <div>
              {hasAuctions && <span>Auctions</span>}
              {hasAuctions && hasDrawings && <span className='header__divider'>×</span>}
              {hasDrawings && <span>Drawings</span>}
            </div>
          </h1>
          <p className='details'>
            This drop includes {hasAuctions && `${auctions.length} NFTs for auction`}{' '}
            {hasAuctions && hasDrawings && 'and'}{' '}
            {hasDrawings &&
              `${drawings.length} individual drawing${drawings.length > 1 ? 's' : ''}`}
            . <span>The highest bidder on each auction wins each auction piece.</span>
            <span>
              Drawings are a fair drop mechanic: buy a ticket for each NFT you want to win. After
              the ticket window closes the drop winners will be selected. Come back and see if you
              were drawn.
            </span>
          </p>
          <div className='extra'>
            {hasAuctions && (
              <a className='extra__link' href='#auctions'>
                Auctions Below
              </a>
            )}
            {hasDrawings && (
              <a className='extra__link' href='#drawings'>
                Tickets Below
              </a>
            )}
            {hasLotteries && (
              <a className='extra__link' href='#lotteries'>
                Tickets Below
              </a>
            )}
            {/* TODO:add sub 24 hour till drop closes timer */}
          </div>
        </div>
      </section>
      {/* --------------------LOTTERIES------------------------ */}
      {hasLotteries && (
        <section className='games' id='lotteries'>
          <h1 className='games__title'>Lotteries</h1>
          <div className='games__grid'>
            {lotteries.map((l: Lottery_include_Nft) => {
              return (
                <LotteryTile
                  lottery={l}
                  artist={artist}
                  key={l.id}
                  userTicketCount={ticketCount[l.id]}
                />
              );
            })}
          </div>
        </section>
      )}
      {/* --------------------Drawings------------------------ */}
      {hasDrawings && (
        <section className='games' id='drawings'>
          <h1 className='games__title'>Drawings</h1>
          <div className='games__grid'>
            {drawings.map((d: Lottery_include_Nft) => {
              return (
                <DrawingTile
                  drawing={d}
                  artist={artist}
                  key={d.id}
                  userTicketCount={ticketCount[d.id]}
                />
              );
            })}
          </div>
        </section>
      )}
      {/* --------------------AUCTIONS------------------------ */}
      {hasAuctions && (
        <section className='games' id='auctions'>
          <h1 className='games__title'>Auctions</h1>
          <div className='games__grid'>
            {auctions.map((a: Auction_include_Nft) => {
              return <AuctionTile auction={a} artist={artist} key={a.id} />;
            })}
          </div>
        </section>
      )}
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

  const drop = await prisma.drop.findFirst({
    ...dropPageQuery,
    where: { id: Number(params!.id) },
  });

  //redirect to home page of data for this drop is not availablee
  if (!drop) {
    return {
      redirect: {
        destination: '/',
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
  const useHeroku = process.env.getDropsFromHeroku;

  let drops: DropType[] = [];
  // Fleek environment variables come in as strings, so gotta check the value this way.
  if (useHeroku === 'true') {
    drops = await prisma.drop.findMany({
      where: {
        approvedAt: {
          not: null,
        },
      },
    });
  }

  // Get the paths we want to pre-render based on drops
  const paths = drops.map((drop) => ({
    params: { id: String(drop.id) },
  }));
  // We'll pre-render only these paths at build time.
  // { fallback: blocking } allows for ISR, if a new page is needed for a new drop then the server will serve the page for the first request and cache static html for all future reqeusts
  return { paths, fallback: 'blocking' };
}
