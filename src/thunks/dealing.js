import { createAsyncThunk } from '@reduxjs/toolkit';
import { riskApi } from 'src/api/risk';
import { slice } from 'src/slices/dealing';

const setFilters = (data = {}) => async (dispatch) => {
  dispatch(slice.actions.setFilters(data));
};

const resetFilter = () => async (dispatch) => {
  dispatch(slice.actions.resetFilter());
};

export const getDealing = createAsyncThunk('getDealing', async (params) => {
  const dealing = await riskApi.getDealingInfo(params);
  return dealing;
})

export const thunks = {
  getDealing,
  setFilters,
  resetFilter,
};
