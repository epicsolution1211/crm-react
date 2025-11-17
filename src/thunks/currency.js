import { currencyApi } from "../api/payment_audit/currency";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getCurrencies = createAsyncThunk('getCurrencies', async (params) => {
  const res = await currencyApi.getCurrencies(params);
  return res;
});

export const createCurrency = createAsyncThunk('createCurrency', async (data) => {
  const res = await currencyApi.createCurrency(data);
  return res;
});

export const thunks = {
  getCurrencies,
  createCurrency
};

