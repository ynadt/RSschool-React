import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import { apiSlice } from '@redux/services/apiSlice';
import currentPageReducer from '@redux/slices/currentPageSlice';
import favoritesReducer from '@redux/slices/favoritesSlice';

const makeStore = () =>
  configureStore({
    reducer: {
      currentPage: currentPageReducer,
      favorites: favoritesReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  });

export const wrapper = createWrapper(makeStore, { debug: true });

export type RootState = ReturnType<ReturnType<typeof makeStore>['getState']>;
export type AppDispatch = ReturnType<typeof makeStore>['dispatch'];
export type AppStore = ReturnType<typeof makeStore>;

export default makeStore;
