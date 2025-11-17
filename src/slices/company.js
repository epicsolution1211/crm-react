import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: "",
  avatar: "",
};

const reducers = {
  setCurrentCompanyName(state, action) {
    const name = action.payload;
    state.name = name;
  },
  setCurrentCompanyAvatar(state, action) {
    const avatar = action.payload;
    state.avatar = avatar;
  },
  getCompany(state, action) {
    state.name = action.payload.name;
    state.avatar = action.payload.avatar;
    state.company = action.payload;
  },
};

export const slice = createSlice({
  name: 'company',
  initialState,
  reducers,
});

export const { reducer } = slice;
