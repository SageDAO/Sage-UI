import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// initialize an empty api service that we'll inject endpoints into later as needed
export const baseApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: [
    'AllUsers',
    'Auction',
    'AuctionState',
    'EscrowPoints',
    'Following',
    'Nfts',
    'PendingDrops',
    'Prizes',
    'TicketCount',
    'User',
    'UserPoints',
    'Wallet',
  ],
  endpoints: () => ({}),
});
