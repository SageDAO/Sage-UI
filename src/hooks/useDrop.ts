import { Auction, Drop, Lottery, User } from '@prisma/client';
import { reformatDate, transformTitle } from '@/utilities/strings';
import useSageRoutes from './useSageRoutes';
import { computeDropStatus } from '@/utilities/status';
import { Lottery_include_Nft, Auction_include_Nft } from '@/prisma/types';
import { computeDropSystems } from '@/components/Icons/System';

interface Args {
  drop: Drop;
  artist: User;
  Lotteries: Lottery_include_Nft[];
  Auctions: Auction_include_Nft[];
}

export type UseDropArgs = Parameters<typeof useDrop>['0'];

function useDrop({ drop, artist, Lotteries, Auctions }: Args) {
  const { pushToCreators, pushToDrops } = useSageRoutes();
  const { startTime, endTime, status } = computeDropStatus({ Lotteries, Auctions });
  const dropName: string = transformTitle(drop.name);
  const artistName: string = transformTitle(artist.username);
  const bannerImgSrc: string = drop.bannerImageS3Path;
  const dropDescription: string = drop.description;
  const createdAt = reformatDate(drop.createdAt);
  const systemTypes = computeDropSystems({ lottery: Lotteries, auction: Auctions });
  const statusDisplay = status.toLocaleUpperCase();
  function goToDropOnClick() {
    pushToDrops(drop.id);
  }

  function goToArtistOnClick() {
    pushToCreators(artist.username);
  }

  return {
    dropName,
    artistName,
    bannerImgSrc,
    dropDescription,
    startTime,
    endTime,
    status,
    systemTypes,
    createdAt,
    statusDisplay,
    goToArtistOnClick,
    goToDropOnClick,
  };
}

export default useDrop;
