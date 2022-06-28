import { DropWithArtist, Drop_include_GamesAndArtist } from '@/prisma/types';
import { getNFTContract } from '@/utilities/contracts';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const dropsApi = createApi({
  reducerPath: 'dropsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  refetchOnMountOrArgChange: 60,
  tagTypes: ['PendingDrops'],
  endpoints: (builder) => ({
    getApprovedDrops: builder.query<Drop_include_GamesAndArtist[], void>({
      query: () => `drops?action=GetApprovedDrops`,
      providesTags: ['PendingDrops'],
    }),
    getDropsPendingApproval: builder.query<DropWithArtist[], void>({
      query: () => `drops?action=GetDropsPendingApproval`,
      providesTags: ['PendingDrops'],
    }),
    approveDrop: builder.mutation<Date, number>({
      queryFn: async (dropId, {}, extraOptions, fetchWithBQ) => {
        const { data } = await fetchWithBQ({
          url: `drops?action=ApproveDrop`,
          method: 'POST',
          body: { id: dropId },
        });
        return { data: (data as any).approvedAt as Date };
      },
      invalidatesTags: ['PendingDrops'],
    }),
  }),
});

async function deployDrop(dropId: number) {
  const drop = {} as any;
  deploySplitters();
  deployAuctions(drop.auctions);
}

async function deploySplitters() {

}

async function deployAuctions(auctions: any[]) {
  const now = Math.floor(Date.now() / 1000);
  const contract = await getNFTContract(SIGNER??);
  for (const auction of auctions) {
    if (auction.endTime < now) {
      continue;
    }
  }
}

export const { useGetApprovedDropsQuery, useGetDropsPendingApprovalQuery, useApproveDropMutation } =
  dropsApi;
