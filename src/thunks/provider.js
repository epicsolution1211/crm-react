import { createAsyncThunk } from "@reduxjs/toolkit";
import { integrationApi } from "src/api/integration";

export const getProviderInfo = createAsyncThunk('getProvider', async () => {
  const res = await integrationApi.getProviders();
  return res?.providers;
});

export const thunks = {
  getProviderInfo
};

