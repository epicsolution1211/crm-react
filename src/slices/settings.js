import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  members: [],
  skillTeams: [],
};

const reducers = {
  getMembers(state, action) {
    const accounts = action.payload;

    state.members = accounts;
  },

  getSkillTeams(state, action) {
    const teams = action.payload;

    state.skillTeams = teams;
  }
};

export const slice = createSlice({
  name: 'settings',
  initialState,
  reducers,
});

export const { reducer } = slice;
