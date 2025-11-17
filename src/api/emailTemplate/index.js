import apiClient from "../../utils/request";

class EmailTemplateApi {
  async getEmailTemplates(params = {}) {
    return await apiClient.get("/company/email_templates", { params });
  }
  async createEmailTemplate(request = {}) {
    return await apiClient.post("/company/email_templates", request );
  } 

  async updateEmailTemplate(id, request = {}) {
    return await apiClient.put(`/company/email_templates/${id}`, request);
  }

  async deleteEmailTemplate(id) {
    await apiClient.delete(`/company/email_templates/${id}`);
  }
  
}

export const emailTemplateApi = new EmailTemplateApi();
