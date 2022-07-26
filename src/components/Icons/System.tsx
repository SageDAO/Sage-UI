import { Lottery, Auction } from '@prisma/client';
import LotterySVG from '@/public/icons/systems/lotteries.svg';
import AuctionsSVG from '@/public/icons/systems/auctions.svg';
import DrawingsSVG from '@/public/icons/systems/drawings.svg';

export type SystemTypes = 'drawings' | 'auctions' | 'lotteries';

type Games = {
  lotteries?: Lottery[];
  drawings?: Lottery[];
  auctions?: Auction[];
};

export function computeDropSystems(games: Games): SystemTypes[] {
  const systems: SystemTypes[] = [];
  const keys = Object.keys(games);
  keys.forEach((key: string) => {
    const value = games[key];
    if (value.length) {
      systems.push(key as SystemTypes);
    }
  });
  return systems;
}

interface Props {
  type: SystemTypes;
}

export default function System({ type }: Props) {
  if (type === 'lotteries') {
    return <LotterySVG className='systems__svg' />;
  }
  if (type === 'auctions') {
    return <AuctionsSVG className='systems__svg' />;
  }
  if (type === 'drawings') {
    return <DrawingsSVG className='systems__svg' />;
  }

  return null;
}
