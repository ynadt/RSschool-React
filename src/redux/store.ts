import { AnyAction, configureStore } from '@reduxjs/toolkit';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';

import { apiSlice } from '@redux/services/apiSlice';
import currentPageReducer from '@redux/slices/currentPageSlice';
import favoritesReducer from '@redux/slices/favoritesSlice';

const combinedReducer = combineReducers({
  currentPage: currentPageReducer,
  favorites: favoritesReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const reducer = (state: ReturnType<typeof combinedReducer> | undefined, action: AnyAction) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      ...action.payload,
    };
    if (state?.favorites?.favorites.length) nextState.favorites.favorites = state.favorites.favorites;
    return nextState;
  }
  return combinedReducer(state, action);
};

const makeStore = () =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  });

export const wrapper = createWrapper(makeStore, { debug: false });

export type RootState = ReturnType<ReturnType<typeof makeStore>['getState']>;
export type AppStore = ReturnType<typeof makeStore>;

export default makeStore;
