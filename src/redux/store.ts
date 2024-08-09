import { configureStore, AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import { apiSlice } from '@redux/services/apiSlice';
import currentPageReducer from '@redux/slices/currentPageSlice';
import favoritesReducer from '@redux/slices/favoritesSlice';

const combinedReducer = combineReducers({
  currentPage: currentPageReducer,
  favorites: favoritesReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const makeStore = () =>
  configureStore({
    reducer: combinedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  });

export type RootState = ReturnType<typeof combinedReducer>;
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;

export { makeStore };
