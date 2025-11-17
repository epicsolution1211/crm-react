import apiClient from "../../utils/request";

class GameProvidersApi {
  async getGameProviders(params = {}) {
    const response = await apiClient.get('/company/providers/gaming', {
      params,
    });
    return response;
  }

  async getManagedGameProviders(params = {}) {
    const response = await apiClient.get('/company/managed_providers/gaming', {
      params,
    });
    return response;
  }

  async getManagedGameProvider(id) {
    const response = await apiClient.get(`/company/managed_providers/gaming/${id}`);
    return response;
  }

  async createManagedGameProvider(data) {
    const response = await apiClient.post(`/company/managed_providers/gaming`, data);
    return response;
  }

  async updateManagedGameProvider(id, data) {
    const response = await apiClient.put(`/company/managed_providers/gaming/${id}`, data);
    return response;
  }

  async uploadGameProviderLogo(id, data) {
    const response = await apiClient.post(`/company/managed_providers/gaming/${id}/upload_logo`, data);
    return response;
  }

  async deleteManagedGameProvider(id) {
    const response = await apiClient.delete(`/company/managed_providers/gaming/${id}`);
    return response;
  }

  async getGameProviderWebhooks(params = {}) {
    const response = await apiClient.get(`/company/gaming_callback_logs`, {
      params,
    });
    return response;
  }
}

export const gameProvidersApi = new GameProvidersApi();
