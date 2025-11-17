import apiClient from "src/utils/request";

class BetsApi {
  async getBets(params) {
    const response = await apiClient.get(`/client/finance/bets`, { params });
    return response;
  }

  async createBet(data) {
    const response = await apiClient.post(`/client/finance/bets`, data);
    return response;
  }

  async deleteBet(id) {
    const response = await apiClient.delete(`/client/finance/bets/${id}`);
    return response;
  }

  async updateBet(id, data) {
    const response = await apiClient.put(`/client/finance/bets/${id}`, data);
    return response;
  }
}

export const betsApi = new BetsApi();
