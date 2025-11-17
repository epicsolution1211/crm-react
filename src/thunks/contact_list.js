import { slice } from "src/slices/contact_list";

const setAgentList = (id) => async (dispatch) => {
  dispatch(slice.actions.setAgentList(id));
}

const resetList = () => async (dispatch) => {
  dispatch(slice.actions.resetList());
}

export const thunks = {
  setAgentList,
  resetList,
};
