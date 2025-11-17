import apiClient from "src/utils/request";

class UserApi {
  async setReadNotification (request) {
    const response = await apiClient.put(`/account/account_notification`, request);
    return response;
  }

  async updateUser(id, request) {
    const response = await apiClient.put(`/account/info/${id}`, request);
    return response;
  }

  async updateTimezone(request) {
    const response = await apiClient.put(`/user/time_zone/`, request);
    return response;
  }

  async updatePassword(request) {
    const response = await apiClient.put(`/user/password/`, request);
    return response;
  }

  async deleteAccount() {
    const response = await apiClient.delete(`/user/users`);
    return response;
  }

  async contactUs(request = {}) {
    const response = await apiClient.post('/contact/contact', request);
    return response;
  }

  async getFilter(params) {
    const response = await apiClient.get('/client/saved_filter', { params });
    return response;
  }

  async createFilter(request = {}) {
    const response = await apiClient.post('/client/saved_filter', request);
    return response;
  }

  async updateFilter(request = {}) {
    const response = await apiClient.put('/client/saved_filter', request);
    return response;
  }

  async getExchange() {
    const response = await apiClient.get('/company/exchange');
    return response;
  }

  async createAccountEmail(request) {
    const response = await apiClient.post('/account/email_configs', request);
    return response;
  }

  async updateAccountEmail(id, request) {
    const response = await apiClient.put(`/account/email_configs/${id}`, request);
    return response;
  }

  async deleteAccountEmail(id) {
    const response = await apiClient.delete(`/account/email_configs/${id}`);
    return response;
  }
}

export const userApi = new UserApi();
