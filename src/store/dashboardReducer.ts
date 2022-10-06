import { getStorageContract } from '@/utilities/contracts';
import { User_include_EarnedPointsAndNftContracts } from '@/prisma/types';
import { ethers, Signer } from 'ethers';
import { baseApi } from './baseReducer';

export interface LotteryParticipant {
  walletAddress: string;
  numTicketsPoints: number;
  numTicketsCoins: number;
}

export interface LotteryStats {
  lotteryId: number;
  dropId: number;
  closeTime: number;
  status: number;
  ticketCostPoints: string;
  ticketCostCoins: string;
  numTicketsPoints: number;
  numTicketsCoins: number;
  participants: LotteryParticipant[];
  prizesDrawn?: number;
  prizesClaimed?: number;
}

const dashboardApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllUsersAndEarnedPoints: builder.query<User_include_EarnedPointsAndNftContracts[], void>({
      query: () => 'user?action=GetAllUsersAndEarnedPoints',
      providesTags: ['AllUsers'],
    }),
    getConfig: builder.query<{ featuredDropId: number; welcomeMessage: string }, void>({
      query: () => `config`,
      providesTags: ['Config'],
    }),
    promoteUserToAdmin: builder.mutation<boolean, { walletAddress: string; signer: Signer }>({
      queryFn: async ({ walletAddress, signer }, {}, _, fetchWithBQ) => {
        const contract = await getStorageContract(signer);
        const tx = await contract.grantAdmin(walletAddress);
        await tx.wait();
        await fetchWithBQ(`user?action=PromoteToAdmin&address=${walletAddress}`);
        return { data: true };
      },
      invalidatesTags: ['AllUsers'],
    }),
    promoteUserToArtist: builder.mutation<boolean, { walletAddress: string; signer: Signer }>({
      queryFn: async ({ walletAddress, signer }, {}, _, fetchWithBQ) => {
        const contract = await getStorageContract(signer);
        const tx = await contract.grantRole(
          ethers.utils.solidityKeccak256(['string'], ['role.artist']),
          walletAddress
        );
        await tx.wait();
        await fetchWithBQ(`user?action=PromoteToArtist&address=${walletAddress}`);
        return { data: true };
      },
      invalidatesTags: ['AllUsers'],
    }),
    updateConfig: builder.mutation<null, { featuredDropId: Number; welcomeMessage: string }>({
      queryFn: async ({ featuredDropId, welcomeMessage }, {}, _, fetchWithBQ) => {
        await fetchWithBQ({
          url: 'config',
          method: 'PATCH',
          body: { featuredDropId, welcomeMessage },
        });
        return { data: null };
      },
      invalidatesTags: ['Config'],
    }),
  }),
});

export const {
  useGetAllUsersAndEarnedPointsQuery,
  useGetConfigQuery,
  usePromoteUserToAdminMutation,
  usePromoteUserToArtistMutation,
  useUpdateConfigMutation,
} = dashboardApi;
