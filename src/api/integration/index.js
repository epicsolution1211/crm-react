import apiClient from "../../utils/request";

class IntegrationApi {
  async getProviders(params = {}) {
    const response = await apiClient.get('/company/provider/providers', {
      params,
    });
    return response;
  }

  async getReview(id) {
    const response = await apiClient.get(`/company/provider/reviews/${id}`);
    return response;
  }

  async updateReview(id, data) {
    const response = await apiClient.put(`/company/provider/reviews/${id}`, data);
    return response;
  }

  async getPaymentProviderTypes(params = {}) {
    const response = await apiClient.get(`/company/psp_providers/available_types`, {
      params,
    });
    return response;
  }

  async getPaymentProviders(params = {}) {
    const response = await apiClient.get(`/company/psp_providers`, {
      params,
    });
    return response;
  }

  async createPaymentProvider(data) {
    const response = await apiClient.post(`/company/psp_providers`, data);
    return response;
  }

  async updatePaymentProvider(id, data) {
    const response = await apiClient.put(`/company/psp_providers/${id}`, data);
    return response;
  }

  async updatePaymentProviderLogo(id, data) {
    const response = await apiClient.put(`/company/psp_providers/${id}/upload_logo`, data);
    return response;
  }

  async deletePaymentProvider(id) {
    const response = await apiClient.delete(`/company/psp_providers/${id}`);
    return response;
  }

  async getPaymentProvider(id) {
    const response = await apiClient.get(`/company/psp_providers/${id}`);
    return response;
  }


  async getGameStudioProviderTypes(params = {}) {
    const response = await apiClient.get(`/company/gaming_providers/available_types`, {
      params,
    });
    return response;
  }

  async getGameStudioProviders(params = {}) {
    const response = await apiClient.get(`/company/gaming_providers`, {
      params,
    });
    return response;
  }

  async createGameStudioProvider(data) {
    const response = await apiClient.post(`/company/gaming_providers`, data);
    return response;
  }

  async updateGameStudioProvider(id, data) {
    const response = await apiClient.put(`/company/gaming_providers/${id}`, data);
    return response;
  }

  async updateGameStudioProviderLogo(id, data) {
    const response = await apiClient.put(`/company/gaming_providers/${id}/upload_logo`, data);
    return response;
  }

  async deleteGameStudioProvider(id) {
    const response = await apiClient.delete(`/company/gaming_providers/${id}`);
    return response;
  }

  async getGameStudioProvider(id) {
    const response = await apiClient.get(`/company/gaming_providers/${id}`);
    return response;
  }
}

export const integrationApi = new IntegrationApi();
