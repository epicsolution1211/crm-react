import { createSlice } from "@reduxjs/toolkit";
import { getCustomerDealing, getCustomers, getIBRequests, getIBs } from "../thunks/customers";

const initialState = {
  customers: [],
  iBs: [],
  iBRequests: [],
  positions: {},
  isPending: true,
  isIBsPending: true,
  isiBRequestsPending: true,
  isPositionPending: true,
  isExporting: false,
  exportProgress: 10,
  customerFilters: {
    currentPage: 0,
  },
  iBsFilters: {
    currentPage: 0,
  },
  iBRequestsFilters: {
    currentPage: 0,
    is_ib_approved: ['false']
  },
  positionFilters: {
    currentPage: 0,
    perPage: 10,
  },
  autodialStarted: false,
  autodialClientId: null,
  customerIds: [],
  ibsIds: [],
  iBRequestsIds: [],
  currentPage: 1,
  currentIBsPage: 1,
  currentIBRequestsPage: 1,
  // customFilter: []
  customFilter: [],
  customIBsFilter: [],
  customIBRequestsFilter: [],
  sorting: [],
  iBsSorting: [],
  iBRequestsSorting: [],
  emailPhoneSearch: {
    email: undefined,
    phone: undefined,
  },
  emails: [],
  phones: [],
};

const reducers = {
  setEmailPhoneQuery(state, action) {
    const searchQuery = action.payload;
    state.emailPhoneSearch = {
      email: searchQuery?.email ?? state.emailPhoneSearch.email,
      phone: searchQuery?.phone ?? state.emailPhoneSearch.phone,
    }
  },
  updateEmails(state, action) {
    state.emails = [...state.emails, ...action.payload]?.filter((email, index, arr) =>
      arr.findIndex(e => e.value === email.value) === index
    ) ?? [];
  },
  updatePhones(state, action) {
    state.phones = [...state.phones, ...action.payload]?.filter((phone, index, arr) =>
      arr.findIndex(e => e.value === phone.value) === index
    ) ?? [];
  },
  setFilters(state, action) {
    const customers = action.payload;
    state.customerFilters = { ...state.customerFilters, currentPage: 0, ...customers };
  },
  setPositionFilters(state, action) {
    const dealing = action.payload;
    state.positionFilters = { ...state.positionFilters, ...dealing };
  },
  resetPositionFilter(state) {
    state.positionFilters = {
      currentPage: state.positionFilters?.currentPage,
      perPage: state.positionFilters?.perPage,
    };
  },
  setCurrentPage(state, action) {
    const page = action.payload;
    state.currentPage = page;
  },
  resetFilter(state) {
    state.customerFilters = {};
  },
  setIsExporting(state, action) {
    const isExporting = action.payload;
    state.isExporting = isExporting;
  },
  setExportProgress(state, action) {
    const exportProgress = action.payload;
    state.exportProgress = exportProgress;
  },
  setCustomFilter(state, action) {
    const customFilter = action.payload;
    state.customFilter = customFilter;
  },
  setCustomerSorting(state, action) {
    const customerSorting = action.payload;
    state.sorting = customerSorting;
  },
  setIBsSorting(state, action) {
    const sorting = action.payload;
    state.iBsSorting = sorting;
  },
  setIBRequestSorting(state, action) {
    const sorting = action.payload;
    state.iBRequestsSorting = sorting;
  },
  setAutodialStarted(state, action) {
    const autodial = action.payload;
    state.autodialStarted = autodial;
  },
  setAutodialClientId(state, action) {
    const id = action.payload;
    state.autodialClientId = id;
  },
  resetAll(state) {
    state.customers = [];
    state.customFilter = [];
    state.customerFilters = {};
    state.clientIds = [];
  },
  setCustomerIds(state, action) {
    state.customerIds = [...action.payload];
  },
  setIBsFilters(state, action) {
    const iBsFilters = action.payload;
    state.iBsFilters = { ...state.iBsFilters, currentPage: 0, ...iBsFilters };
  },
  resetIBsFilter(state) {
    state.iBsFilters = {};
  },
  resetIBsAll(state) {
    state.iBs = [];
    state.customIBsFilter = [];
    state.iBsFilters = {};
    state.ibsIds = [];
  },
  setIBsCustomFilter(state, action) {
    const customIBsFilter = action.payload;
    state.customIBsFilter = customIBsFilter;
  },
  setIBsCurrentPage(state, action) {
    const page = action.payload;
    state.currentIBsPage = page;
  },
  setIBRequestsFilters(state, action) {
    const iBRequestsFilters = action.payload;
    state.iBRequestsFilters = { ...state.iBRequestsFilters, currentPage: 0, ...iBRequestsFilters };
  },
  resetIBRequestsFilter(state) {
    state.iBRequestsFilters = {};
  },
  resetIBRequestsAll(state) {
    state.iBRequests = [];
    state.customIBRequestsFilter = [];
    state.iBRequestsFilters = {};
    state.iBRequestsIds = [];
  },
  setIBsRequestsCustomFilter(state, action) {
    const customIBRequestsFilter = action.payload;
    state.customIBRequestsFilter = customIBRequestsFilter;
  },
  setIBRequestsCurrentPage(state, action) {
    const page = action.payload;
    state.currentIBRequestsPage = page;
  },
};

const extraReducers = (builder) => {
  builder
    .addCase(getCustomers.fulfilled, (state, action) => {
      const currentPage = state?.currentPage;
      const customers = action.payload;
      state.customers = customers;
      const ids =
        currentPage === 1
          ? [...customers.clients?.map((client) => client?.id)]
          : [
            ...state.customerIds,
            ...customers.clients?.map((client) => client?.id),
          ];
      state.customerIds = [...new Set(ids)];
      state.isPending = false;
    })
    .addCase(getCustomers.pending, (state) => {
      state.isPending = true;
    })
    .addCase(getIBs.fulfilled, (state, action) => {
      const currentPage = state?.currentPage;
      const iBs = action.payload;
      state.iBs = iBs;
      const ids =
        currentPage === 1
          ? [...iBs.clients?.map((client) => client?.id)]
          : [
            ...state.customerIds,
            ...iBs.clients?.map((client) => client?.id),
          ];
      state.ibsIds = [...new Set(ids)];
      state.isIBsPending = false;
    })
    .addCase(getIBs.pending, (state) => {
      state.isIBsPending = true;
    })
    .addCase(getIBRequests.fulfilled, (state, action) => {
      const currentPage = state?.currentPage;
      const iBRequests = action.payload;
      state.iBRequests = iBRequests;
      const ids =
        currentPage === 1
          ? [...iBRequests.clients?.map((client) => client?.id)]
          : [
            ...state.customerIds,
            ...iBRequests.clients?.map((client) => client?.id),
          ];
      state.iBRequestsIds = [...new Set(ids)];
      state.isiBRequestsPending = false;
    })
    .addCase(getIBRequests.pending, (state) => {
      state.isiBRequestsPending = true;
    })
    .addCase(getCustomerDealing.fulfilled, (state, action) => {
      const dealing = action.payload;
      state.positions = dealing;
      state.isPositionPending = false;
    })
    .addCase(getCustomerDealing.pending, (state) => {
      state.isPositionPending = true;
    })
};

export const slice = createSlice({
  name: "customers",
  initialState,
  reducers,
  extraReducers,
});

export const { reducer } = slice;
