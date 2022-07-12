import Image from 'next/image';
import { Lottery, Auction } from '@prisma/client';

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
  const src = `/icons/systems/${type}.svg`;
  return <Image src={src} layout='fill' />;
}
