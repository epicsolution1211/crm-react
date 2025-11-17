import { slice } from "src/slices/company";
import { settingsApi } from "../api/settings";

const setCurrentCompanyName = (name) => async (dispatch) => {
  dispatch(slice.actions.setCurrentCompanyName(name));
};

const setCurrentCompanyAvatar = (avatar) => async (dispatch) => {
  dispatch(slice.actions.setCurrentCompanyAvatar(avatar));
};

const getCompany = (id) => async (dispatch) => {
  const response = await settingsApi.getCompany(id);
  dispatch(slice.actions.getCompany(response));
};

export const thunks = {
  setCurrentCompanyName,
  setCurrentCompanyAvatar,
  getCompany
};
