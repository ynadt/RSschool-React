import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { apiSlice, GetAnimeListResponse } from '@redux/services/apiSlice';
import currentPageReducer from '@redux/slices/currentPageSlice';
import favoritesReducer from '@redux/slices/favoritesSlice';

const store = configureStore({
  reducer: {
    currentPage: currentPageReducer,
    favorites: favoritesReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export default store;
export type { GetAnimeListResponse };
