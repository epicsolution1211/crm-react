import apiClient from 'src/utils/request';

class InjectionApi {
  async createInjection(data) {
    const response = await apiClient.post(`/lead_management/injections`, data);
    return response;
  }

  async getInjections(request) {
    const response = await apiClient.get(`/lead_management/injections`, { params: request });
    return response;
  }

  async getInjection(id) {
    const response = await apiClient.get(`/lead_management/injections/${id}`);
    return response;
  }

  async updateInjection(id, data) {
    const response = await apiClient.put(`/lead_management/injections/${id}`, data);
    return response;
  }

  async deleteInjection(id) {
    const response = await apiClient.delete(`/lead_management/injections/${id}`);
    return response;
  }
}

export const injectionApi = new InjectionApi();
