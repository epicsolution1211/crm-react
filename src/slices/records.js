import { createSlice } from "@reduxjs/toolkit";
import { getRecords } from "../thunks/record";

const initialState = {
  records: [],
  isPending: false,
  recordsFilters: {
    currentPage: 0,
    perPage: 10,
  },
  recordsIds: [],
};

const reducers = {
  setFilters(state, action) {
    const records = action.payload;
    state.recordsFilters = { ...state.recordsFilters, ...records };
  },
};

const extraReducers = (builder) => {
  builder
    .addCase(getRecords.fulfilled, (state, action) => {
      const records = action.payload;
      state.records = records;
      const ids = [
        ...state.recordsIds,
        ...records?.records?.map((record) => record?.id),
      ];
      state.recordsIds = [...new Set(ids)];
      state.isPending = false;
    })
    .addCase(getRecords.pending, (state) => {
      state.isPending = true;
    });
};

export const slice = createSlice({
  name: "records",
  initialState,
  reducers,
  extraReducers,
});

export const { reducer } = slice;
