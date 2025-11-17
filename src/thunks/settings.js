import { settingsApi } from 'src/api/settings';
import { slice } from 'src/slices/settings';

const getMembers = (query, q = "*", params = {}) => async (dispatch) => {
  const accounts = await settingsApi.getMembers(query, q, params);

  dispatch(slice.actions.getMembers(accounts));
};

const getSkillTeams = (q = "*") => async (dispatch) => {
  const teams = await settingsApi.getSkillTeams(q);

  dispatch(slice.actions.getSkillTeams(teams));
}

export const thunks = {
  getMembers,
  getSkillTeams,
};
