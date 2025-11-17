import { createSlice } from '@reduxjs/toolkit';
import { getProviderInfo } from '../thunks/provider';

const initialState = {
  provider: {},
  pending: false
};

const extraReducers = (builder) => {
  builder
    .addCase(getProviderInfo.fulfilled, (state, action) => {
      state.provider = action.payload;
      state.pending = false;
    })
    .addCase(getProviderInfo.pending, (state) => {
      state.pending = true;
    })
    .addCase(getProviderInfo.rejected, (state) => {
      state.pending = false;
      state.provider = {};
    })
};

export const slice = createSlice({
  name: 'providers',
  initialState,
  extraReducers
});

export const { reducer } = slice;


