import { createSlice } from '@reduxjs/toolkit';
import { getSubmittedForms } from '../thunks/submitted_forms';

const initialState = {
  submittedFormsInfo: [],
  submittedFormsFilters: {
    currentPage: 0,
    perPage: 10,
  },
  submittedFormsIds: []
};

const reducers = {
  setFilters(state, action) {
    const submittedForms = action.payload;
    state.submittedFormsFilters = { ...state.submittedFormsFilters, ...submittedForms };
  },
  resetFilter(state) {
    state.submittedFormsFilters = { currentPage: state.submittedFormsFilters?.currentPage, perPage: state.submittedFormsFilters?.perPage };
  },
};

const extraReducers = (builder) => {
  builder
    .addCase(getSubmittedForms.fulfilled, (state, action) => {
      const submittedForms = action.payload;
      state.submittedFormsInfo = submittedForms;
      const ids = [...state.submittedFormsIds, ...submittedForms.forms?.map((pos) => pos?.id)];
      state.submittedFormsIds = [...new Set(ids)];
      state.isPending = false;
    })
    .addCase(getSubmittedForms.pending, (state) => {
      state.isPending = true;
    })
}

export const slice = createSlice({
  name: 'submittedForms',
  initialState,
  reducers,
  extraReducers,
});

export const { reducer } = slice;
