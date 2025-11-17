import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customers: [],
  isPending: true,
  affiliateFilters: {
    currentPage: 0,
    perPage: 10,
  },
  customerIds: [],
  currentPage: 1,
};

const reducers = {
  setAffiliateFilters(state, action) {
    const updateFilters = action.payload;
    state.affiliateFilters = { ...state.affiliateFilters, ...updateFilters };
  },
  resetAffiliateFilter(state) {
    state.affiliateFilters = {};
  },
};

export const slice = createSlice({
  name: "leads",
  initialState,
  reducers,
});

export const { reducer } = slice;
