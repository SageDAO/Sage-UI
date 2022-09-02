import { Signer } from 'ethers';
import { GamePrize } from '@/prisma/types';
import { Lottery, Nft, User, PrizeProof } from '@prisma/client';
import { toast } from 'react-toastify';
import { extractErrorMessage, getLotteryContract } from '../utilities/contracts';
import { playErrorSound, playPrizeClaimedSound } from '../utilities/sounds';
import { baseApi } from './baseReducer';
import { promiseToast } from '@/utilities/toast';

export interface ClaimPrizeRequest {
  lotteryId: Lottery['id'];
  uri: Nft['metadataPath'];
  nftId: Nft['id'];
  proof: PrizeProof['proof'];
  walletAddress: User['walletAddress'];
  signer: Signer;
}

const prizesApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    isLotteryDrawn: builder.query<boolean, Lottery['id']>({
      query: (lotteryId) => `prizes?action=IsLotteryDrawn&lotteryId=${lotteryId}`,
    }),
    getClaimedPrizes: builder.query<GamePrize[], void>({
      query: () => `prizes?action=GetClaimedPrizes`,
      providesTags: ['Prizes'],
    }),
    getUnclaimedPrizes: builder.query<GamePrize[], void>({
      query: () => `prizes?action=GetUnclaimedPrizes`,
      providesTags: ['Prizes'],
    }),
    getPrizesByUser: builder.query<GamePrize[], void>({
      query: () => `prizes?action=GetPrizesByUser`,
      providesTags: ['Prizes'],
    }),
    getPrizesByUserAndLottery: builder.query<
      GamePrize[],
      { walletAddress: User['walletAddress']; lotteryId: Lottery['id'] }
    >({
      query: ({ walletAddress, lotteryId }) =>
        `prizes?action=GetPrizesByUserAndLottery&lotteryId=${lotteryId}&walletAddress=${walletAddress}`,
      providesTags: ['Prizes'],
    }),
    claimLotteryPrize: builder.mutation<Date, ClaimPrizeRequest>({
      queryFn: async (args, {}, _extraOptions, _fetchWithBQ) => {
        try {
          const contract = await getLotteryContract(args.signer);
          var tx = await contract.claimPrize(
            args.lotteryId,
            args.walletAddress,
            args.nftId,
            args.uri,
            toByteArray(args.proof)
          );
          promiseToast(tx, `NFT claimed and moved to your collection!`);
          await tx.wait();
          var claimedAt = await updateDbPrizeClaimedDate(
            _fetchWithBQ,
            args.lotteryId,
            args.walletAddress,
            args.nftId
          );
        } catch (e) {
          console.log(e);
          const errMsg = extractErrorMessage(e);
          if (errMsg == 'Participant already claimed prize') {
            var claimedAt = await updateDbPrizeClaimedDate(
              _fetchWithBQ,
              args.lotteryId,
              args.walletAddress,
              args.nftId
            );
          } else {
            toast.error(`Failure! ${errMsg}`);
            playErrorSound();
            return { error: { status: 500, data: null } };
          }
        }
        playPrizeClaimedSound();
        return { data: claimedAt };
      },
      invalidatesTags: ['Prizes'],
    }),
  }),
});

async function updateDbPrizeClaimedDate(
  fetchWithBQ: any,
  lotteryId: Lottery['id'],
  winnerAddress: User['walletAddress'],
  nftId: Nft['id']
): Promise<Date> {
  const { data } = await fetchWithBQ({
    url: `prizes?action=UpdatePrizeClaimedDate&lotteryId=${lotteryId}`,
    method: 'POST',
    body: { winnerAddress, nftId },
  });
  return (data as any).claimedAt as Date;
}

function toByteArray(proof: string) {
  if (proof == null || proof == '') {
    return [];
  }
  return proof.indexOf(',') > 0 ? proof.split(',') : [proof];
}

export const {
  useGetClaimedPrizesQuery,
  useGetUnclaimedPrizesQuery,
  useGetPrizesByUserAndLotteryQuery,
  useClaimLotteryPrizeMutation,
  useIsLotteryDrawnQuery,
  useGetPrizesByUserQuery,
} = prizesApi;
