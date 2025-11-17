import apiClient from 'src/utils/request';

class AffiliateApi {
  async createAffiliate(data) {
    const response = await apiClient.post(`/lead_management/affiliates`, data);
    return response;
  }

  async getAffiliates(request) {
    const response = await apiClient.get(`/lead_management/affiliates`, { params: request });
    return response;
  }

  async getAffiliate(id) {
    const response = await apiClient.get(`/lead_management/affiliates/${id}`);
    return response;
  }

  async updateAffiliate(id, data) {
    const response = await apiClient.put(`/lead_management/affiliates/${id}`, data);
    return response;
  }

  async deleteAffiliate(id) {
    const response = await apiClient.delete(`/lead_management/affiliates/${id}`);
    return response;
  }

  async refreshAffiliatePassword(id) {
    const response = await apiClient.put(`lead_management/affiliate_passwords/${id}`);
    return response;
  }

  // AI Summary
  async getAffiliateAISummary(id) {
    const response = await apiClient.post(`/lead_management/affiliates/generate_ai_summary`, { affiliate_id: id });
    return response;
  }

  async getAllCountryRoutings(params) {
    const response = await apiClient.get(`/lead_management/country_routings`, { params });
    return response;
  }

  async createCountryRoutings(data) {
    const response = await apiClient.post(`/lead_management/country_routings`, data);
    return response;
  }

  async updateCountryRoutings(id, data) {
    const response = await apiClient.put(`/lead_management/country_routings/${id}`, data);
    return response;
  }

  async deleteCountryRoutings(id) {
    const response = await apiClient.delete(`/lead_management/country_routings/${id}`);
    return response;
  }

  async getAffiliateApiLogs(params = {}) {
    const response = await apiClient.get(`/company/affiliate_api_logs`, { params });
    return response;
  }
}

export const affiliateApi = new AffiliateApi();
