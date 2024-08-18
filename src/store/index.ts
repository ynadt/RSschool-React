import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormData {
  name: string;
  age: number;
  email: string;
  password: string;
  gender: string;
  acceptTerms: boolean;
  picture: string;
  country: string;
}

const initialState = {
  formData: [] as FormData[],
  countries: [
    'United States',
    'Canada',
    'United Kingdom',
    'Germany',
    'France',
    'Russia',
    'Belarus',
    'Georgia',
    'Poland',
    'Ukraine',
    'Lithuania',
    'Latvia',
    'Estonia',
    'Finland',
    'Sweden',
    'Norway',
    'Uzbekistan',
    'Kyrgyzstan',
    'Kazakhstan',
  ],
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addFormData: (state, action: PayloadAction<FormData>) => {
      state.formData.push(action.payload);
    },
  },
});

export const { addFormData } = formSlice.actions;

const store = configureStore({
  reducer: {
    form: formSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
