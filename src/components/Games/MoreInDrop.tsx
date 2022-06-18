import AuctionTile from '@/components/Tiles/AuctionTile';
import LotteryTile from '@/components/Tiles/LotteryTile';
import type { Auction_include_Nft, Lottery_include_Nft } from '@/prisma/types';
import type { Lottery, User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useTicketCount } from '@/hooks/useTicketCount';

type Props = {
  auctions?: Auction_include_Nft[];
  lotteries?: Lottery_include_Nft[];
  drawings?: Lottery_include_Nft[];
  artist: User;
};

export default function MoreInDrop({ auctions, lotteries, drawings, artist }: Props) {
  const { data: sessionData } = useSession();
  const walletAddress = sessionData?.address;
  const ticketCount = useTicketCount(
    new Array().concat(drawings, lotteries) as Lottery[],
    walletAddress as string
  );
  if (!auctions?.length && !lotteries?.length && !drawings?.length) return null;
  return (
    <div className='more-in-drop'>
      <h1 className='more-in-drop__header'>More in this drop</h1>
      <div className='more-in-drop__grid'>
        {auctions?.map((auction) => (
          <AuctionTile auction={auction} key={auction.id} artist={artist} />
        ))}
        {lotteries?.map((lottery) => (
          <LotteryTile
            lottery={lottery}
            key={lottery.id}
            artist={artist}
            userTicketCount={ticketCount[lottery.id]}
          />
        ))}
        {drawings?.map((drawing) => (
          <LotteryTile
            lottery={drawing}
            key={drawing.id}
            artist={artist}
            userTicketCount={ticketCount[drawing.id]}
          />
        ))}
      </div>
    </div>
  );
}
