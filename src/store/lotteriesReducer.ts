import { LotteryWithNftsAndArtist } from '@/prisma/types';
import type { GetEarnedPointsResponse } from '@/api/points';
import {
  approveERC20Transfer,
  extractErrorMessage,
  getLotteryContract,
} from '@/utilities/contracts';
import { playErrorSound, playTxSuccessSound } from '@/utilities/sounds';
import { BigNumber, ContractTransaction, ethers, Signer } from 'ethers';
import { toast } from 'react-toastify';
import { pointsApi } from './pointsReducer';
import { baseApi } from './baseReducer';
import { promiseToast } from '@/utilities/toast';
import { registerLotterySale } from '@/utilities/sales';

export interface BuyTicketRequest {
  lotteryId: number;
  numTickets: number;
  ticketCostTokens: string;
  ticketCostPoints: string;
  signer: Signer;
  earnedPoints: GetEarnedPointsResponse;
}

export interface TicketCountMap {
  [gameId: number]: number;
}

const lotteriesApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getLottery: builder.query<LotteryWithNftsAndArtist, number>({
      query: (lotteryId: number) => `lotteries?action=GetLottery&lotteryId=${lotteryId}`,
    }),
    getLotteryWinners: builder.query<string[], number>({
      query: (lotteryId: number) => `lotteries?action=GetLotteryWinners&lotteryId=${lotteryId}`,
    }),
    getTicketCounts: builder.query<TicketCountMap, { lotteryIds: number[]; walletAddress: string }>(
      {
        queryFn: async ({ lotteryIds, walletAddress }, { dispatch }) => {
          console.log(`getTicketCounts(${walletAddress})`);
          if (!walletAddress) {
            return { data: {} };
          }
          const ticketCounts = <TicketCountMap>{};
          for (const id of lotteryIds) {
            ticketCounts[id] = await getTicketCountPerUser(id, walletAddress);
            // Reset cache when a ticket is sold
            setupTicketSoldListener(id, () =>
              dispatch(lotteriesApi.util.invalidateTags(['TicketCount']))
            );
          }
          return { data: ticketCounts };
        },
        providesTags: ['TicketCount'],
      }
    ),
    buyTickets: builder.mutation<boolean, BuyTicketRequest>({
      queryFn: async (
        { lotteryId, numTickets, ticketCostPoints, ticketCostTokens, signer, earnedPoints },
        { dispatch }
      ) => {
        const purchaseCostTokens = BigNumber.from(numTickets).mul(ticketCostTokens);
        const purchaseCostPoints = Boolean(Number(ticketCostPoints) > 0)
          ? Number(numTickets) * Number(ticketCostPoints)
          : null;
        try {
          console.log(`buyTickets() :: ${purchaseCostTokens} ASH + ${purchaseCostPoints} PIXEL`);
          const lotteryContract = await getLotteryContract(signer);
          const tokenAddress = await lotteryContract.token();
          await approveERC20Transfer(
            tokenAddress,
            lotteryContract.address,
            purchaseCostTokens,
            signer
          );
        } catch (e) {
          console.error(e);
          toast.error(`Error approving transfer`);
          playErrorSound();
          return { data: false };
        }
        try {
          if (purchaseCostPoints) {
            dispatch(pointsApi.endpoints.withholdEscrowPoints.initiate(purchaseCostPoints));
            var tx = await buyTicketsUsingPoints(signer, lotteryId, numTickets, earnedPoints);
          } else {
            var tx = await buyTicketsWithoutPoints(signer, lotteryId, numTickets);
          }
          promiseToast(tx, `You obtained ${numTickets} ${numTickets > 1 ? 'entries' : 'entry'}!`);
          await tx.wait();
          await registerLotterySale(lotteryId, purchaseCostTokens, purchaseCostPoints, tx, signer);
          playTxSuccessSound();
          if (purchaseCostPoints) {
            dispatch(pointsApi.util.invalidateTags(['UserPoints']));
          }
          return { data: true };
        } catch (e: any) {
          console.log(e);
          if (purchaseCostPoints) {
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

async function buyTicketsWithoutPoints(
  signer: Signer,
  lotteryId: number,
  numberOfTickets: number
): Promise<ContractTransaction> {
  const contract = await getLotteryContract(signer);
  return await contract.buyTickets(lotteryId, numberOfTickets);
}

async function buyTicketsUsingPoints(
  signer: Signer,
  lotteryId: number,
  numberOfTickets: number,
  earnedPoints: GetEarnedPointsResponse
): Promise<ContractTransaction> {
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
        uint256 ticketNumber,
        address indexed participantAddress,
        PriceTier tier
    );
*/
export async function setupTicketSoldListener(lotteryId: number, countUpdateCallback: () => void) {
  console.log(`setupTicketSoldListener(${lotteryId})`);
  const contract = await getLotteryContract();
  if (!contract.listenerCount()) {
    console.log('setupTicketSoldListener() :: Adding contract listener for TicketSold event');
    contract.on('TicketSold', (lotteryId, ticketNumber, participantAddress, tier) => {
      console.log(
        `Contract Event: TicketSold(${lotteryId}, ${ticketNumber}, ${participantAddress}, ${tier})`
      );
      countUpdateCallback();
    });
  }
}

export const {
  useGetLotteryQuery,
  useGetLotteryWinnersQuery,
  useGetTicketCountsQuery,
  useBuyTicketsMutation,
} = lotteriesApi;
