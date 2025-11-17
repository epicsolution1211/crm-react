import { createAsyncThunk } from "@reduxjs/toolkit";
import { internalChatApi } from "../api/internal-chat";

export const getInternalChat = createAsyncThunk('getInternalChat', async (data) => {
  const accountId = localStorage.getItem("account_id");
  const response = await internalChatApi.getInternalChats({
    ...data,
    per_page: data?.per_page || 30,
  });
  return {
    conversations: response?.conversations?.filter(c => c?.public || c?.account_ids?.includes(Number(accountId))),
    pagination: {
      next_page: response?.next_page,
      total_pages: response?.total_pages,
      total_results: response?.total_results
    }
  }
})

export const thunks = {
  getInternalChat,
};

