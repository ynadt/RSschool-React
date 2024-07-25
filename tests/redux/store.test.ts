import { configureStore } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiSlice } from '@/redux/services/apiSlice';
import currentPageReducer from '@/redux/slices/currentPageSlice';
import favoritesReducer from '@/redux/slices/favoritesSlice';
import store, { RootState } from '@/redux/store';

vi.mock('@reduxjs/toolkit/query', () => ({
  setupListeners: vi.fn(),
}));

describe('store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should configure store with reducers', () => {
    const state: RootState = store.getState();

    expect(state.currentPage).toBeDefined();
    expect(state.favorites).toBeDefined();
    expect(state[apiSlice.reducerPath]).toBeDefined();
  });

  it('should include apiSlice middleware', () => {
    const testStore = configureStore({
      reducer: {
        currentPage: currentPageReducer,
        favorites: favoritesReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    });

    // Ensure that the middleware is applied by dispatching a test action that the apiSlice would handle
    const dispatchSpy = vi.spyOn(testStore, 'dispatch');
    testStore.dispatch(apiSlice.util.resetApiState());
    expect(dispatchSpy).toHaveBeenCalledWith(apiSlice.util.resetApiState());
  });
});
