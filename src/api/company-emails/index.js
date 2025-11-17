import apiClient from "../../utils/request";

class CompanyEmailsApi {
  async getCompanyEmails(params = {}) {
    return await apiClient.get("/company/emails", { params });
  }

  async createCompanyEmail(request = {}) {
    return await apiClient.post("/company/emails", request);
  }

  async updateCompanyEmail(id, request = {}) {
    return await apiClient.put(`/company/emails/${id}`, request);
  }

  async deleteCompanyEmail(id) {
    await apiClient.delete(`/company/emails/${id}`);
  }
}

export const companyEmailsApi = new CompanyEmailsApi();
