import apiClient from "../../utils/request";

class PaymentProvidersApi {
  async getPaymentProviders(params = {}) {
    const response = await apiClient.get('/company/providers/psp', {
      params,
    });
    return response;
  }

  async getManagedPaymentProviders(params = {}) {
    const response = await apiClient.get('/company/managed_providers/psp', {
      params,
    });
    return response;
  }

  async getManagedPaymentProvider(id) {
    const response = await apiClient.get(`/company/managed_providers/psp/${id}`);
    return response;
  }

  async createManagedPaymentProvider(data) {
    const response = await apiClient.post(`/company/managed_providers/psp`, data);
    return response;
  }

  async updateManagedPaymentProvider(id, data) {
    const response = await apiClient.put(`/company/managed_providers/psp/${id}`, data);
    return response;
  }

  async uploadPaymentProviderLogo(id, data) {
    const response = await apiClient.post(`/company/managed_providers/psp/${id}/upload_logo`, data);
    return response;
  }

  async deleteManagedPaymentProvider(id) {
    const response = await apiClient.delete(`/company/managed_providers/psp/${id}`);
    return response;
  }

  async getCallProviderWebhooks(params = {}) {
    const response = await apiClient.get(`/company/psp_webhook_logs`, {
      params,
    });
    return response;
  }
}

export const paymentProvidersApi = new PaymentProvidersApi();
