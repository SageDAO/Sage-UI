import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: [
    'AllUsers',
    'ArtistBalance',
    'ArtistNftContract',
    'Auction',
    'AuctionState',
    'Config',
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
