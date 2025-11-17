import { slice } from "src/slices/client_chat";
import { customersApi } from "../api/customers";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getClientChat = createAsyncThunk('tickets', async (data) => {
  const response = await customersApi.getCustomerPrevTickets({
    ...data,
    per_page: data?.per_page || 30,
  });
  return {
    tickets: response?.tickets,
    pagination: {
      next_page: response?.next_page,
      total_pages: response?.total_pages,
      total_results: response?.total_results
    }
  };
});

const resetChat = () => (dispatch) => {
  dispatch(slice.actions.resetClientChat());
};

export const thunks = {
  getClientChat,
  resetChat,
};
