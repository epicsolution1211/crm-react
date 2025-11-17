import apiClient from 'src/utils/request';

class DataEntryApi {
  async createDataEntry(data) {
    const response = await apiClient.post(`/audit/files`, data);
    return response;
  }

  async getDataEntries(request) {
    const response = await apiClient.get(`/audit/files`, { params: request });
    return response;
  }

  async getDataEntry(id) {
    const response = await apiClient.get(`/audit/files/${id}`);
    return response;
  }

  async updateDataEntry(id, data) {
    const response = await apiClient.put(`/audit/files/${id}`, data);
    return response;
  }

  async deleteDataEntry(id) {
    const response = await apiClient.delete(`/audit/files/${id}`);
    return response;
  }
}

export const dataEntryApi = new DataEntryApi();
