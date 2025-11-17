import apiClient from 'src/utils/request';

class StatusApi {
  async createStatus(data) {
    const response = await apiClient.post(`/lead_management/leads`, data);
    return response;
  }

  async createLeadsWithBulk(data) {
    const response = await apiClient.post(`/lead_management/lead_bulks`, data);
    return response;
  }

  async deleteLeadsWithBulk(request = {}) {
    await apiClient.delete("/lead_management/lead_bulks", { params: request });
  }

  async getStatuses(request) {
    const response = await apiClient.get(`/lead_management/leads`, { params: request });
    return response;
  }

  async getLead(id) {
    return await apiClient.get(`/lead_management/leads/${id}`);
  }

  async updateLead(id, request = {}) {
    return await apiClient.put(`/lead_management/leads/${id}`, request);
  }

  async assignLeadLabels(request = {}) {
    await apiClient.put("/lead_management/labels/lead_label", request);
  }

  async getLeadCustomFields(params = {}) {
    return await apiClient.get("/lead_management/lead_fields", { params });
  }

  async createLeadCustomField(request = {}) {
    return await apiClient.post("/lead_management/lead_fields", request);
  }

  async updateLeadCustomField(id, request = {}) {
    return await apiClient.put(`/lead_management/lead_fields/${id}`, request);
  }

  async deleteLeadCustomField(id) {
    await apiClient.delete(`/lead_management/lead_fields/${id}`);
  }

  async getLeadCustomFieldValue(params = {}) {
    return await apiClient.get("/lead_management/lead_field_value", { params });
  }

  async updateLeadCustomFieldValue(request = {}) {
    return await apiClient.put("/lead_management/lead_field_value", request);
  }
}

export const statusApi = new StatusApi();
