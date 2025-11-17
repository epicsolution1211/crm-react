import apiClient from "src/utils/request";

class IBsApi {
  async getIbRewards(params) {
    const response = await apiClient.get(`/company/ib_rewards`, { params });
    return response;
  }
  
  async getIbRewardsById(id) {
    const response = await apiClient.get(`/company/ib_rewards/${id}`);
    return response;
  }

  async createIbReward(data) {
    const response = await apiClient.post(`/company/ib_rewards`, data);
    return response;
  }
  
  async updateIbReward(id, data) {
    const response = await apiClient.put(`/company/ib_rewards/${id}`, data);
    return response;
  }

  async deleteIbReward(id) {
    const response = await apiClient.delete(`/company/ib_rewards/${id}`);
    return response;
  }

  async getIBTickerNames() {
    const response = await apiClient.get(`/client/finance/ticker_names`);
    return response;
  }

  async getIBRewardAccountTypes(params) {
    const response = await apiClient.get(`/company/ib_reward_trading_accounts`, { params });
    return response;
  }

  async createIBRewardAccountType(data) {
    const response = await apiClient.post(`/company/ib_reward_trading_accounts`, data);
    return response;
  }

  async updateIBRewardAccountType(id, data) {
    const response = await apiClient.put(`/company/ib_reward_trading_accounts/${id}`, data);
    return response;
  }

  async deleteIBRewardAccountType(id) {
    const response = await apiClient.delete(`/company/ib_reward_trading_accounts/${id}`);
    return response;
  }

  async createIBRelationship(data) {
    const response = await apiClient.post(`/agent/ib_relationships`, data);
    return response;
  }
}

export const ibsApi = new IBsApi();
