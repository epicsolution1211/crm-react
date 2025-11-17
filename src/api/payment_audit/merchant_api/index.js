import apiClient from 'src/utils/request';

class MerchantApi {
  async createMerchant(data) {
    const response = await apiClient.post(`/audit/merchant/merchants`, data);
    return response;
  }

  async getMerchants(request) {
    const response = await apiClient.get(`/audit/merchant/merchants`, { params: request });
    return response;
  }

  async getMerchant(id) {
    const response = await apiClient.get(`/audit/merchant/merchants/${id}`);
    return response;
  }

  async updateMerchant(id, data) {
    const response = await apiClient.put(`/audit/merchant/merchants/${id}`, data);
    return response;
  }

  async deleteMerchant(id) {
    const response = await apiClient.delete(`/audit/merchant/merchants/${id}`);
    return response;
  }

  async createRate(data) {
    const response = await apiClient.post(`/audit/merchant/rates`, data);
    return response;
  }

  async getRates(request) {
    const response = await apiClient.get(`/audit/merchant/rates`, { params: request });
    return response;
  }

  async getRate(id) {
    const response = await apiClient.get(`/audit/merchant/rates/${id}`);
    return response;
  }

  async updateRate(id, data) {
    const response = await apiClient.put(`/audit/merchant/rates//${id}`, data);
    return response;
  }

  async deleteRate(id) {
    const response = await apiClient.delete(`/audit/merchant/rates/${id}`);
    return response;
  }
}

export const merchantApi = new MerchantApi();
