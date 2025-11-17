import { settingsApi } from "../api/settings";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAgentList = createAsyncThunk('getAgent', async () => {
  const res = await settingsApi.getMembers([], "*", {});
  return res?.accounts;
});

export const thunks = {
  getAgentList
};

