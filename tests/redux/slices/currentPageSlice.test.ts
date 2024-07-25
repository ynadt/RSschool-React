import { configureStore, EnhancedStore } from '@reduxjs/toolkit';

import currentPageReducer, { CurrentPageState, setCurrentPage } from '@/redux/slices/currentPageSlice';

describe('currentPageSlice', () => {
  let store: EnhancedStore<{ currentPage: CurrentPageState }>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        currentPage: currentPageReducer,
      },
    });
  });

  it('should return the initial state', () => {
    const initialState: CurrentPageState = store.getState().currentPage;
    expect(initialState).toEqual({ currentPage: 1 });
  });

  it('should handle setCurrentPage action', () => {
    store.dispatch(setCurrentPage(5));
    const updatedState: CurrentPageState = store.getState().currentPage;
    expect(updatedState).toEqual({ currentPage: 5 });
  });
});
