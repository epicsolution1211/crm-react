import apiClient from "src/utils/request";

class CustomerFieldsApi {
  async getCustomerFields(params = {}) {
    return await apiClient.get("/client/client_fields", { params });
  }

  async createCustomerField(request = {}) {
    return await apiClient.post("/client/client_fields", request);
  }

  async updateCustomerField(id, request = {}) {
    return await apiClient.put(`/client/client_fields/${id}`, request);
  }

  async deleteCustomerField(id) {
    await apiClient.delete(`/client/client_fields/${id}`);
  }

  async getCustomerFieldValue(params = {}) {
    return await apiClient.get("/client/client_field_value", { params });
  }

  async updateCustomerFieldValue(request = {}, params = {}) {
    return await apiClient.put("/client/client_field_value", request, { params });
  }
}

export const customerFieldsApi = new CustomerFieldsApi();
