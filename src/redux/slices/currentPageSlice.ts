import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CurrentPageState {
  page: number;
}

const initialState: CurrentPageState = {
  page: 1,
};

const currentPageSlice = createSlice({
  name: 'currentPage',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
});

export const { setPage } = currentPageSlice.actions;
export default currentPageSlice.reducer;
