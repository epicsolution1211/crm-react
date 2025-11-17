import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filters: {
    q: null,
    priority: null,
    status: null,
    pinned: null,
    starred: null,
    archived: null,
    overdue: null,
    participants: [],
    watchers: [],
    labels: [],
    teams: [],
    desks: [],
  },
  pagination: {
    per_page: 10,
    page: 1,
  },
  selectedDeleteTicketId : null,
  selectedTicketId : null,
  isOpenFilterDrawer : false,
  isOpenSettingDrawer : false,
};

const reducers = {
  setFilterParams(state, action) {
    const filterParams = action.payload;
    if (filterParams.q === "") {
      filterParams.q = null;
    }
    state.filters = filterParams;
  },
  setPaginationParams(state, action) {
    const paginationParams = action.payload;
    state.pagination = paginationParams;
  },
  toggleFilterDrawer(state, action) {
    state.isOpenFilterDrawer = action.payload;
  },
  toggleSettingDrawer(state, action) {
    state.isOpenSettingDrawer = action.payload;
  },
  onSelectTicketId(state, action) {
    state.selectedTicketId = action.payload;
  },
  onSelectDeleteTicketId(state, action) {
    state.selectedDeleteTicketId = action.payload;
  },
  resetFilters(state) {
    state.filters = initialState.filters;
    state.pagination = initialState.pagination;
  },
};

export const slice = createSlice({
  name: 'tickets',
  initialState,
  reducers,
});

export const { reducer, actions: ticketsActions } = slice;


