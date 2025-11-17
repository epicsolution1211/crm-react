import { createAsyncThunk } from '@reduxjs/toolkit';
import { customersApi } from 'src/api/customers';
import { riskApi } from 'src/api/risk';
import { slice } from 'src/slices/customers';

const setEmailPhoneQuery = (data = {}) => async (dispatch) => {
  dispatch(slice.actions.setEmailPhoneQuery(data));
};

const updateEmails = (data = {}) => async (dispatch) => {
  dispatch(slice.actions.updateEmails(data));
};

const updatePhones = (data = {}) => async (dispatch) => {
  dispatch(slice.actions.updatePhones(data));
};

const setFilters = (data = {}) => async (dispatch) => {
  dispatch(slice.actions.setFilters(data));
};

const resetFilter = () => async (dispatch) => {
  dispatch(slice.actions.resetFilter());
};

const setIsExporting = (data) => async (dispatch) => {
  dispatch(slice.actions.setIsExporting(data));
}

const setExportProgress = (data) => async (dispatch) => {
  dispatch(slice.actions.setExportProgress(data));
}

const setPositionFilters = (data = {}) => async (dispatch) => {
  dispatch(slice.actions.setPositionFilters(data));
};

const resetPositionFilter = () => async (dispatch) => {
  dispatch(slice.actions.resetPositionFilter());
};

const setAutodialStarted = (data) => async (dispatch) => {
  dispatch(slice.actions.setAutodialStarted(data));
}

const setAutodialClientId = (data) => async (dispatch) => {
  dispatch(slice.actions.setAutodialClientId(data));
}

const resetAll = () => async (dispatch) => {
  dispatch(slice.actions.resetAll());
}

const setIBsFilters = (data = {}) => async (dispatch) => {
  dispatch(slice.actions.setIBsFilters(data));
};

const resetIBsFilter = () => async (dispatch) => {
  dispatch(slice.actions.resetIBsFilter());
};

const resetIBsAll = () => async (dispatch) => {
  dispatch(slice.actions.resetIBsAll());
}

const setIBRequestsFilters = (data = {}) => async (dispatch) => {
  dispatch(slice.actions.setIBRequestsFilters(data));
};

const resetIBRequestsFilter = () => async (dispatch) => {
  dispatch(slice.actions.resetIBRequestsFilter());
};

const resetIBRequestsAll = () => async (dispatch) => {
  dispatch(slice.actions.resetIBRequestsAll());
}

export const getCustomers = createAsyncThunk('getCustomer', async (params, { rejectWithValue }) => {
  try {
    const customers = await customersApi.getCustomers(params);
    return customers;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const getIBs = createAsyncThunk('getIBs', async (params, { rejectWithValue }) => {
  try {
    const iBs = await customersApi.getCustomers(params);
    return iBs;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const getIBRequests = createAsyncThunk('getIBRequests', async (params) => {
  try {
    const ibRequests = await customersApi.getCustomers(params);
    return ibRequests;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const getCustomerDealing = createAsyncThunk('getCustomerDealing', async (params) => {
  const dealing = await riskApi.getDealingInfo(params);
  return dealing;
})

export const thunks = {
  getIBs,
  getIBRequests,
  getCustomers,
  getCustomerDealing,
  resetAll,
  setPositionFilters,
  resetPositionFilter,
  setFilters,
  updateEmails,
  updatePhones,
  setEmailPhoneQuery,
  resetFilter,
  setIsExporting,
  setAutodialClientId,
  setAutodialStarted,
  setExportProgress,
  setIBsFilters,
  resetIBsFilter,
  resetIBsAll,
  setIBRequestsFilters,
  resetIBRequestsFilter,
  resetIBRequestsAll,
};
