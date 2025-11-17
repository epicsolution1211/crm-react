import apiClient from "src/utils/request";

class MetabaseApi {
  async getMetabaseGroups() {
    const response = await apiClient.get("/report/metabase/group/groups");
    return response;
  }

  async getMetabaseGroup(id) {
    const response = await apiClient.get(`/report/metabase/group/groups/${id}`);
    return response;
  }

  async createMetabaseGroup(request) {
    const response = await apiClient.post("/report/metabase/group/groups", request);
    return response;
  }

  async updateMetabaseGroup(id, request) {
    const response = await apiClient.put(`/report/metabase/group/groups/${id}`, request);
    return response;
  }

  async deleteMetabaseGroup(id) {
    const response = await apiClient.delete(`/report/metabase/group/groups/${id}`);
    return response;
  }

  async getMetabaseTemplates() {
    const response = await apiClient.get(`/report/metabase/dashboard/templates`);
    return response;
  }

  async createMetabaseTemplateFromDashboard(dashboardId, request) {
    const response = await apiClient.post(`/report/metabase/dashboard/dashboards/${dashboardId}/create_template`, request);
    return response;
  }
}

export const metabaseApi = new MetabaseApi();