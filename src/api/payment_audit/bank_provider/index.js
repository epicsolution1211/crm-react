import apiClient from "src/utils/request";

class BankProviderApi {
  async createBank(data) {
    const response = await apiClient.post(`/audit/bank/banks`, data);
    return response;
  }

  async getBanks(request) {
    const response = await apiClient.get(`/audit/bank/banks`, {
      params: request,
    });
    return response;
  }

  async getBank(id) {
    const response = await apiClient.get(`/audit/bank/banks/${id}`);
    return response;
  }

  async updateBank(id, data) {
    const response = await apiClient.put(`/audit/bank/banks/${id}`, data);
    return response;
  }

  async deleteBank(id) {
    const response = await apiClient.delete(`/audit/bank/banks/${id}`);
    return response;
  }

  async createRate(data) {
    const response = await apiClient.post(`/audit/bank/rates`, data);
    return response;
  }

  async getRates(request) {
    const response = await apiClient.get(`/audit/bank/rates`, {
      params: request,
    });
    return response;
  }

  async getRate(id) {
    const response = await apiClient.get(`/audit/bank/rates/${id}`);
    return response;
  }

  async updateRate(id, data) {
    const response = await apiClient.put(`/audit/bank/rates/${id}`, data);
    return response;
  }

  async deleteRate(id) {
    const response = await apiClient.delete(`/audit/bank/rates/${id}`);
    return response;
  }
}

export const bankProviderApi = new BankProviderApi();
