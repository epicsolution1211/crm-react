import apiClient from "../../utils/request";

class RiskApi {
  async getDealingInfo(data) {
    const response = await apiClient.get(`/client/finance/positions`, { params: data });
    return response;
  }

  async createPosition(request = {}) {
    return await apiClient.post("/client/finance/positions", request);
  }

  async getSingleDealing(id) {
    const response = await apiClient.get(`/client/finance/positions/${id}`);
    return response;
  }

  async updateSingleDealing(id, data = {}) {
    const response = await apiClient.put(`/client/finance/positions/${id}`, data);
    return response;
  }

  async deletePosition(id) {
    const response = await apiClient.delete(`/client/finance/positions/${id}`);
    return response;
  }

  async getPositionLabels(request = {}) {
    const response = await apiClient.get("/client/finance/labels/labels", {
      params: request,
    });
    return response;
  }

  async createPositionLabel(request = {}) {
    const response = await apiClient.post("/client/finance/labels/labels", request);
    return response;
  }

  async updatePositionLabel(request = {}) {
    const response = await apiClient.put(`/client/finance/labels/labels/${request?.id}`, request);
    return response;
  }

  async deletePositionLabel(id) {
    const response = await apiClient.delete(`/client/finance/labels/labels/${id}`);
    return response;
  }

  async assignPositionLabels(request = {}) {
    const response = await apiClient.put("/client/finance/labels/position_label/", request);
    return response;
  }

  async getWalletTransactions(data) {
    const response = await apiClient.get(`/client/finance/wallet_transactions`, { params: data });
    return response;
  }

  async getSwapInfo(data) {
    const response = await apiClient.get(`/client/finance/swaps`, { params: data });
    return response;
  }
}

export const riskApi = new RiskApi();
