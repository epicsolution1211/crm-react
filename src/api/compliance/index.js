import apiClient from 'src/utils/request';

class ComplianceApi {
  async getCompliances(params = {}) {
    const response = await apiClient.get('/compliance/compliances', { params });
    return response;
  }

  async getCompliance(id) {
    const response = await apiClient.get(`/compliance/compliances/${id}`);
    return response;
  }

  async getComplianceLabels(params = {}) {
    const response = await apiClient.get('/compliance/labels', { params });
    return response;
  }

  async createComplianceLabel(data) {
    const response = await apiClient.post('/compliance/labels', data);
    return response;
  }

  async updateComplianceLabel(id, data) { 
    const response = await apiClient.put(`/compliance/labels/${id}`, data);
    return response;
  }

  async deleteComplianceLabel(id) {
    const response = await apiClient.delete(`/compliance/labels/${id}`);
    return response;
  }

  async getComplianceAiLabels(params = {}) {
    const response = await apiClient.get('/compliance/ai_labels', { params });
    return response;
  }

  async createComplianceAiLabel(data) {
    const response = await apiClient.post('/compliance/ai_labels', data);
    return response;
  }

  async updateComplianceAiLabel(id, data) {
    const response = await apiClient.put(`/compliance/ai_labels/${id}`, data);
    return response;
  }

  async deleteComplianceAiLabel(id) {
    const response = await apiClient.delete(`/compliance/ai_labels/${id}`);
    return response;
  }

  async assignComplianceLabel(data) {
    const response = await apiClient.put(`/compliance/compliance_labels/x`, data);
    return response;
  }
}

export const complianceApi = new ComplianceApi();
