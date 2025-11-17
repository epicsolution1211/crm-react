import apiClient from "../../utils/request";

class CallProvidersApi {
  async getCallProviders(params = {}) {
    const response = await apiClient.get('/company/providers/call', {
      params,
    });
    return response;
  }

  async getManagedCallProviders(params = {}) {
    const response = await apiClient.get('/company/managed_providers/call', {
      params,
    });
    return response;
  }

  async getManagedCallProvider(id) {
    const response = await apiClient.get(`/company/managed_providers/call/${id}`);
    return response;
  }

  async createManagedCallProvider(data) {
    const response = await apiClient.post(`/company/managed_providers/call`, data);
    return response;
  }

  async updateManagedCallProvider(id, data) {
    const response = await apiClient.put(`/company/managed_providers/call/${id}`, data);
    return response;
  }

  async uploadCallProviderLogo(id, data) {
    const response = await apiClient.post(`/company/managed_providers/call/${id}/upload_logo`, data);
    return response;
  }

  async deleteManagedCallProvider(id) {
    const response = await apiClient.delete(`/company/managed_providers/call/${id}`);
    return response;
  }

  async getCallProviderWebhooks(params = {}) {
    const response = await apiClient.get(`/company/call_webhook_logs`, {
      params,
    });
    return response;
  }
}

export const callProvidersApi = new CallProvidersApi();
