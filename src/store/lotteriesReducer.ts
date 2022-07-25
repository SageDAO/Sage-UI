import { LotteryWithNftsAndArtist } from '@/prisma/types';
import type { GetEarnedPointsResponse } from '@/api/points';
import { extractErrorMessage, getLotteryContract } from '@/utilities/contracts';
import { playErrorSound, playTxSuccessSound } from '@/utilities/sounds';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ContractTransaction, Signer } from 'ethers';
import { toast } from 'react-toastify';
import { pointsApi } from './pointsReducer';

export interface BuyTicketRequest {
  lotteryId: number;
  numberOfTickets: number;
  ticketCostCoins: bigint;
  ticketCostPoints: bigint;
  signer: Signer;
  earnedPoints: GetEarnedPointsResponse;
}

export type LotteryTickets = {
  userTickets: number;
  totalTickets: number;
};

export const lotteriesApi = createApi({
  reducerPath: 'lotteriesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  refetchOnMountOrArgChange: 60,
  tagTypes: ['TicketCount'],
  endpoints: (builder) => ({
    getLottery: builder.query<LotteryWithNftsAndArtist, number>({
      query: (lotteryId: number) => `lotteries?action=GetLottery&lotteryId=${lotteryId}`,
    }),
    getTicketCounts: builder.query<LotteryTickets, { lotteryId: number; walletAddress: string }>({
      queryFn: async ({ lotteryId, walletAddress }, { dispatch }) => {
        console.log(`getTicketCounts(${lotteryId}, ${walletAddress})`);
        const totalTickets = await getTicketCount(lotteryId);
        const userTickets = walletAddress
          ? await getTicketCountPerUser(lotteryId, walletAddress)
          : 0;
        const ticketSoldEventCallback = () =>
          dispatch(lotteriesApi.util.invalidateTags(['TicketCount']));
        setupTicketSoldListener(lotteryId, ticketSoldEventCallback);
        return { data: { userTickets, totalTickets } };
      },
      providesTags: ['TicketCount'],
    }),
    buyTickets: builder.mutation<boolean, BuyTicketRequest>({
      queryFn: async (buyRequest, { dispatch }) => {
        const usePoints = Boolean(buyRequest.ticketCostPoints > 0);
        try {
          if (usePoints) {
            const escrowPoints =
              Number(buyRequest.numberOfTickets) * Number(buyRequest.ticketCostPoints);
            dispatch(pointsApi.endpoints.withholdEscrowPoints.initiate(escrowPoints));
            var tx = await buyTicketsUsingPoints(buyRequest);
          } else {
            var tx = await buyTicketsWithoutPoints(buyRequest);
          }
          toast.promise(tx.wait(), {
            pending: 'Request submitted to the blockchain, awaiting confirmation...',
            success: `Success! You obtained ${buyRequest.numberOfTickets} ticket${
              buyRequest.numberOfTickets > 1 ? 's' : ''
            }!`,
            error: 'Failure! Unable to complete request.',
          });
          await tx.wait();
          playTxSuccessSound();
          if (usePoints) {
            // TODO make subscribed UI components refetch points from db and contract
            dispatch(pointsApi.util.invalidateTags(['UserPoints']));
          }
          return { data: true };
        } catch (e: any) {
          console.error(e);
          if (usePoints) {
            dispatch(pointsApi.endpoints.releaseEscrowPoints.initiate());
          }
          const errMsg = extractErrorMessage(e);
          toast.error(`Failure! ${errMsg}`);
          playErrorSound();
          return { data: false };
        }
      },
    }),
  }),
});

async function buyTicketsWithoutPoints(buyRequest: BuyTicketRequest): Promise<ContractTransaction> {
  const contract = await getLotteryContract(buyRequest.signer);
  return await contract.buyTickets(buyRequest.lotteryId, buyRequest.numberOfTickets);
}

async function buyTicketsUsingPoints({
  signer,
  lotteryId,
  numberOfTickets,
  earnedPoints,
}: BuyTicketRequest): Promise<ContractTransaction> {
  try {
    const contract = await getLotteryContract(signer);
    const points = Number(earnedPoints.totalPointsEarned);
    const tx = await contract.buyTicketsWithSignedMessage(
      points,
      lotteryId,
      numberOfTickets,
      earnedPoints.signedMessage
    );
    return tx;
  } catch (e) {
    console.log(extractErrorMessage(e));
    throw e;
  }
}

export async function getTicketCount(lotteryId: number): Promise<number> {
  console.log(`getTicketCount(${lotteryId})`);
  const contract = await getLotteryContract();
  const result = await contract.getLotteryTicketCount(lotteryId);
  console.log(`getTicketCount() :: ${result}`);
  return result.toNumber();
}

export async function getTicketCountPerUser(lotteryId: number, address: string): Promise<number> {
  console.log(`getTicketCountPerUser(${lotteryId}, ${address})`);
  try {
    const contract = await getLotteryContract();
    const result = await contract.getTicketCountPerUser(lotteryId, address);
    console.log(`getTicketCountPerUser() :: ${result}`);
    return result.toNumber();
  } catch (e) {
    console.log(e);
    return 0;
  }
}

/*
from MemeXLottery.sol:
event TicketSold(
        uint256 indexed lotteryId,
        address indexed participantAddress,
        PriceTier tier
    );
*/
export async function setupTicketSoldListener(lotteryId: number, countUpdateCallback: () => void) {
  console.log(`setupTicketSoldListener(${lotteryId})`);
  const contract = await getLotteryContract();
  if (!contract.listenerCount()) {
    console.log('Adding contract listener for TicketSold event');
    contract.on('TicketSold', (lotteryId, participantAddress, tier) => {
      console.log(`Contract Event: TicketSold(${lotteryId}, ${participantAddress}, ${tier})`);
      countUpdateCallback();
    });
  }
}

export const { useGetLotteryQuery, useGetTicketCountsQuery, useBuyTicketsMutation } = lotteriesApi;
