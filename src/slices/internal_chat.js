import { createSlice } from '@reduxjs/toolkit';
import { getInternalChat } from '../thunks/internal_chat';

const initialState = {
  chats: [],
  isPending: false,
};

const extraReducers = (builder) => {
  builder
    .addCase(getInternalChat.fulfilled, (state, action) => {
      state.chats = action.payload;
      state.isPending = false;
    })
    .addCase(getInternalChat.pending, (state) => {
      state.isPending = true;
    })
    .addCase(getInternalChat.rejected, (state) => {
      state.isPending = false;
    })
}

export const slice = createSlice({
  name: 'internal-chat',
  initialState,
  extraReducers,
});

export const { reducer } = slice;
