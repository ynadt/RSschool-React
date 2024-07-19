import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import currentPageReducer from './slices/currentPageSlice';
import favoritesReducer from './slices/favoritesSlice';
import { apiSlice, GetAnimeListResponse } from './services/apiSlice';

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
