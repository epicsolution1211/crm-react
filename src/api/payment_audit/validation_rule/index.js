import apiClient from 'src/utils/request';

class ValidationRuleApi {
  async createValidationRule(data) {
    const response = await apiClient.post(`/audit/rules`, data);
    return response;
  }

  async getValidationRules(request) {
    const response = await apiClient.get(`/audit/rules`, { params: request });
    return response;
  }

  async getValidationRule(id) {
    const response = await apiClient.get(`/audit/rules/${id}`);
    return response;
  }

  async updateValidationRule(id, data) {
    const response = await apiClient.put(`/audit/rules/${id}`, data);
    return response;
  }

  async deleteValidationRule(id) {
    const response = await apiClient.delete(`/audit/rules/${id}`);
    return response;
  }

  async createValidationTask(data) {
    const response = await apiClient.post(`/audit/tasks`, data);
    return response;
  }

  async getValidationTasks(request) {
    const response = await apiClient.get(`/audit/tasks`, { params: request });
    return response;
  }

  async getValidationTask(id) {
    const response = await apiClient.get(`/audit/tasks/${id}`);
    return response;
  }

  async updateValidationTasks(id, data) {
    const response = await apiClient.put(`/audit/tasks/${id}`, data);
    return response;
  }

  async deleteValidationTasks(id) {
    const response = await apiClient.delete(`/audit/tasks/${id}`);
    return response;
  }
}

export const validationRuleApi = new ValidationRuleApi();
