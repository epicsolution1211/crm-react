import apiClient from "../../utils/request";

class FormsApi {
  async getForms(params = {}) {
    return await apiClient.get("/company/brand_forms", { params });
  }

  async deleteForm(id) {
    await apiClient.delete(`/company/brand_forms/${id}`);
  }

  async updateForm(id, request = {}) {
    return await apiClient.put(`/company/brand_forms/${id}`, request);
  }

  async createForm(request = {}) {
    return await apiClient.post("/company/brand_forms", request);
  }

  // brand required form
  async getBrandForm() {
    return await apiClient.get("/company/brand_required_form");
  }

  async deleteBrandForm(params = {}) {
    return await apiClient.delete(`/company/brand_required_form`, {params});
  }

  async createBrandForm(request = {}) {
    return await apiClient.post("/company/brand_required_form", request);
  }

  async getClientForms(client_id) {
    const params = { client_id };
    return await apiClient.get("/client/forms", { params });
  }

  async getCompanyForms(params = {}) {
    return await apiClient.get("/company/wd_forms", { params });
  }

  async createCompanyForm(request = {}) {
    return await apiClient.post("/company/wd_forms", request);
  }

  async updateCompanyForm(id, request = {}) {
    return await apiClient.put(`/company/wd_forms/${id}`, request);
  }

  async deleteCompanyForm(id) {
    await apiClient.delete(`/company/wd_forms/${id}`);
  }
}

export const formsApi = new FormsApi();
