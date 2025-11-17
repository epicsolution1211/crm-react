import apiClient from "../../utils/request";

class SubmittedFormsApi {
  async getSubmittedFormsInfo(data) {
    const response = await apiClient.get(`/company/client_brand_forms`, { params: data });
    return response;
  }

  async getSubmittedFormsLabels(request ={}) {
    const response = await apiClient.get("/company/form_labels", {
      params: request,
    });
    return response;
  }

  async createSubmittedFormsLabel(request = {}) {
    const response = await apiClient.post("/company/form_labels", request);
    return response;
  }

  async updateSubmittedFormsLabel(request = {}) {
    const response = await apiClient.put(`/company/form_labels/${request?.id}`, request);
    return response;
  }

  async deleteSubmittedFormsLabel(id) {
    const response = await apiClient.delete(`/company/form_labels/${id}`);
    return response;
  }
  
  async assignSubmittedFormsLabels(request = {}) {
    const response = await apiClient.post("/company/form_labels/assign_to_forms", request);
    return response;
  }
  
  async removeSubmittedFormsLabels(request = {}) {
    const response = await apiClient.delete("/company/form_labels/remove_from_forms",  { params: request });
    return response;
  }
}

export const submittedFormsApi = new SubmittedFormsApi();
