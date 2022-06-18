import { DropWithArtist, Drop_include_GamesAndArtist } from '@/prisma/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const dropsApi = createApi({
  reducerPath: 'dropsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  refetchOnMountOrArgChange: 60,
  tagTypes: ['PendingDrops'],
  endpoints: (builder) => ({
    getApprovedDrops: builder.query<Drop_include_GamesAndArtist[], void>({
      query: () => `drops?action=GetApprovedDrops`,
      providesTags: ['PendingDrops']
    }),
    getDropsPendingApproval: builder.query<DropWithArtist[], void>({
      query: () => `drops?action=GetDropsPendingApproval`,
      providesTags: ['PendingDrops']
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
      invalidatesTags: ['PendingDrops']
    }),
  }),
});

export const { useGetApprovedDropsQuery, useGetDropsPendingApprovalQuery, useApproveDropMutation } = dropsApi;
