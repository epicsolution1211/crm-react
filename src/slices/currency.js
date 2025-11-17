import { createSlice } from '@reduxjs/toolkit';
import { createCurrency, getCurrencies } from '../thunks/currency';

const initialState = {
  currencies: [],
  currencyList: [],
  totalCount: 0,
  isPending: false,
};

const reducers = {
};

const extraReducers = (builder) => {
  builder
    .addCase(getCurrencies.fulfilled, (state, action) => {
      state.currencies = action.payload.currencies;
      state.currencyList = action.payload.currencies?.map((item) => ({ value: item?.id, label: item?.name }));
      state.totalCount = action.payload.total_count;
      state.isPending = false;
    })
    .addCase(getCurrencies.pending, (state) => {
      state.isPending = true;
    })
    .addCase(createCurrency.fulfilled, (state) => {
      state.isPending = false;
    })
};

export const slice = createSlice({
  name: 'currency',
  initialState,
  reducers,
  extraReducers
});

export const { reducer } = slice;
