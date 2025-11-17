import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ids: []
};

const reducers = {
  setAgentList(state, action) {
    const id = action.payload;
    const selected = state.ids;
    if (selected?.includes(id)) {
      state.ids = selected?.filter((item) => (item !== id));
    } else {
      state.ids = selected?.concat(id);
    }
  },
  resetList(state) {
    state.ids = [];
  }
};

export const slice = createSlice({
  name: 'contact_list',
  initialState,
  reducers,
});

export const { reducer } = slice;
