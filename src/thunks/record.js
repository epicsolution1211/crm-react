import { createAsyncThunk } from "@reduxjs/toolkit";
import { slice } from "src/slices/records";
import { recordApi } from "../api/payment_audit/record";

const setFilters =
  (data = {}) =>
  async (dispatch) => {
    dispatch(slice.actions.setFilters(data));
  };

export const getRecords = createAsyncThunk("getRecords", async (params) => {
  const records = await recordApi.getRecords(params);
  return records;
});

export const thunks = {
  getRecords,
  setFilters,
};
