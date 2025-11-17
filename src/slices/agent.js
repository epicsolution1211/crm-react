import { createSlice } from '@reduxjs/toolkit';
import { getAgentList } from '../thunks/agent';

const initialState = {
  agent: [],
  agentLabelList: []
};

const reducers = {
};

const extraReducers = (builder) => {
  builder
    .addCase(getAgentList.fulfilled, (state, action) => {
      state.agent = action.payload;
      state.agentLabelList = action.payload.map((item) => ({ label: `${item?.first_name} ${item?.last_name}`, value: item?.id }));
    })
};

export const slice = createSlice({
  name: 'agent',
  initialState,
  reducers,
  extraReducers
});

export const { reducer } = slice;
