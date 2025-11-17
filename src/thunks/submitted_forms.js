import { createAsyncThunk } from '@reduxjs/toolkit';
import { submittedFormsApi } from 'src/api/submitted-forms';
import { slice } from 'src/slices/submitted_forms';

const setFilters = (data = {}) => async (dispatch) => {
  dispatch(slice.actions.setFilters(data));
};

const resetFilter = () => async (dispatch) => {
  dispatch(slice.actions.resetFilter());
};

export const getSubmittedForms = createAsyncThunk('getSubmittedForms', async (params) => {
  const submittedForms = await submittedFormsApi.getSubmittedFormsInfo(params);
  return submittedForms;
})

export const thunks = {
  getSubmittedForms,
  setFilters,
  resetFilter,
};
