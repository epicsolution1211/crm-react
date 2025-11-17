import apiClient from 'src/utils/request';

class CurrencyAPi {
  async createCurrency(data) {
    const response = await apiClient.post(`/audit/currencies`, data);
    return response;
  }

  async getCurrencies(request) {
    const response = await apiClient.get(`/audit/currencies`, { params: request });
    return response;
  }

  async getCurrency(id) {
    const response = await apiClient.get(`/audit/currencies/${id}`);
    return response;
  }

  async updateCurrency(id, data) {
    const response = await apiClient.put(`/audit/currencies/${id}`, data);
    return response;
  }

  async deleteCurrency(id) {
    const response = await apiClient.delete(`/audit/currencies/${id}`);
    return response;
  }
}

export const currencyApi = new CurrencyAPi();
