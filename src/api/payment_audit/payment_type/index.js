import apiClient from 'src/utils/request';

class PaymentTypeApi {
  async createPaymentType(data) {
    const response = await apiClient.post(`/audit/payment_types`, data);
    return response;
  }

  async getPaymentTypes(request) {
    const response = await apiClient.get(`/audit/payment_types`, { params: request });
    return response;
  }

  async getPaymentType(id) {
    const response = await apiClient.get(`/audit/payment_types/${id}`);
    return response;
  }

  async updatePaymentType(id, data) {
    const response = await apiClient.put(`/audit/payment_types/${id}`, data);
    return response;
  }

  async deletePaymentType(id) {
    const response = await apiClient.delete(`/audit/payment_types/${id}`);
    return response;
  }
}

export const paymentTypeApi = new PaymentTypeApi();
