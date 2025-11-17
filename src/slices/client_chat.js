import { createSlice } from '@reduxjs/toolkit';
import { getClientChat } from '../thunks/client_chat';

const initialState = {
  tickets: [],
  isPending: false,
};

const reducers = {
  setClientChat(state, action) {
    state.tickets = action.payload;
  },
  resetClientChat(state) {
    state.tickets = [];
  },
};

const extraReducers = (builder) => {
  builder
    .addCase(getClientChat.fulfilled, (state, action) => {
      state.tickets = action.payload;
      state.isPending = false;
    })
    .addCase(getClientChat.pending, (state,) => {
      state.isPending = true;
    })
    .addCase(getClientChat.rejected, (state,) => {
      state.isPending = false;
      state.tickets = [];
    })
}

export const slice = createSlice({
  name: 'client-chat',
  initialState,
  reducers,
  extraReducers,
});

export const { reducer } = slice;
