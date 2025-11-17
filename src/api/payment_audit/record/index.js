import apiClient from "src/utils/request";

class RecordApi {
  async createRecord(data) {
    const response = await apiClient.post(`/audit/record/records`, data);
    return response;
  }

  async getRecords(request) {
    const response = await apiClient.get(`/audit/record/records`, {
      params: request,
    });
    return response;
  }

  async getRecord(id) {
    const response = await apiClient.get(`/audit/record/records/${id}`);
    return response;
  }

  async updateRecord(id, data) {
    const response = await apiClient.put(`/audit/record/records/${id}`, data);
    return response;
  }

  async deleteRecord(id) {
    const response = await apiClient.delete(`/audit/record/records/${id}`);
    return response;
  }

  async getLogs(request) {
    const response = await apiClient.get(`/audit/record/logs`, {
      params: request,
    });
    return response;
  }

  async getIssues(request) {
    const response = await apiClient.get(`/audit/record/issues`, {
      params: request,
    });
    return response;
  }

  async getIssue(id) {
    const response = await apiClient.get(`/audit/record/issues/${id}`);
    return response;
  }

  async updateIssue(id, data) {
    const response = await apiClient.put(`/audit/record/issues/${id}`, data);
    return response;
  }

  async assignAuditLabelToRecord(request = {}) {
    return await apiClient.put("/audit/record/labels", request);
  }
}

export const recordApi = new RecordApi();
