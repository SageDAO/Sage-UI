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
  [auctionsApi.reducerPath]: auctionsApi.reducer,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
  [dropsApi.reducerPath]: dropsApi.reducer,
  [lotteriesApi.reducerPath]: lotteriesApi.reducer,
  [nftsApi.reducerPath]: nftsApi.reducer,
  [pointsApi.reducerPath]: pointsApi.reducer,
  [prizesApi.reducerPath]: prizesApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
