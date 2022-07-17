import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { usersApi } from './usersReducer';
import { prizesApi } from './prizesReducer';
import { lotteriesApi } from './lotteriesReducer';
import { auctionsApi } from './auctionsReducer';
import { pointsApi } from './pointsReducer';
import { dashboardApi } from './dashboardReducer';
import { dropsApi } from './dropsReducer';
import { nftsApi } from './nftsReducer';

const rootReducer = combineReducers({
  [usersApi.reducerPath]: usersApi.reducer,
  [prizesApi.reducerPath]: prizesApi.reducer,
  [auctionsApi.reducerPath]: auctionsApi.reducer,
  [lotteriesApi.reducerPath]: lotteriesApi.reducer,
  [pointsApi.reducerPath]: pointsApi.reducer,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
  [dropsApi.reducerPath]: dropsApi.reducer,
  [nftsApi.reducerPath]: nftsApi.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(usersApi.middleware)
      .concat(prizesApi.middleware)
      .concat(auctionsApi.middleware)
      .concat(lotteriesApi.middleware)
      .concat(pointsApi.middleware)
      .concat(dashboardApi.middleware)
      .concat(dropsApi.middleware)
      .concat(nftsApi.middleware)
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
