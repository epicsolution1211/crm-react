import apiClient from "src/utils/request";

class AuditLabelsApi {
  async getAuditLabels(params = {}) {
    const response = await apiClient.get("/audit/labels", { params });
    return response;
  }

  async createAuditLabel(request = {}) {
    const response = await apiClient.post("/audit/labels", request);
    return response;
  }

  async updateAuditLabel(request = {}) {
    return await apiClient.put(`/audit/labels/${request?.id}`, request);
  }

  async deleteAuditLabel(id) {
    await apiClient.delete(`/audit/labels/${id}`);
  }
}

export const auditLabelsApi = new AuditLabelsApi();
