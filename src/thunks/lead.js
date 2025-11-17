import { slice } from 'src/slices/lead';

const setAffiliateFilters = (data = {}) => async (dispatch) => {
  dispatch(slice.actions.setAffiliateFilters(data));
};

const resetAffiliateFilters = () => async (dispatch) => {
  dispatch(slice.actions.resetAffiliateFilters());
};

export const thunks = {
  setAffiliateFilters,
  resetAffiliateFilters,
};
