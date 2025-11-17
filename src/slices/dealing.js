import { createSlice } from '@reduxjs/toolkit';
import { getDealing } from '../thunks/dealing';

const initialState = {
  dealInfo: [],
  isPending: false,
  dealingFilters: {
    currentPage: 0,
    perPage: 10,
  },
  dealingIds: []
};

const reducers = {
  setFilters(state, action) {
    const dealing = action.payload;
    state.dealingFilters = { ...state.dealingFilters, ...dealing };
  },
  resetFilter(state) {
    state.dealingFilters = { currentPage: state.dealingFilters?.currentPage, perPage: state.dealingFilters?.perPage };
  },
};

const extraReducers = (builder) => {
  builder
    .addCase(getDealing.fulfilled, (state, action) => {
      const dealing = action.payload;
      state.dealInfo = dealing;
      const ids = [...state.dealingIds, ...dealing.positions?.map((pos) => pos?.id)];
      state.dealingIds = [...new Set(ids)];
      state.isPending = false;
    })
    .addCase(getDealing.pending, (state) => {
      state.isPending = true;
    })
}

export const slice = createSlice({
  name: 'dealing',
  initialState,
  reducers,
  extraReducers,
});

export const { reducer } = slice;
