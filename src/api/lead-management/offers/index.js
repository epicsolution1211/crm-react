import apiClient from 'src/utils/request';

class OffersApi {
  async getOffers(params = {}) {
    const response = await apiClient.get("/lead_management/offers", { params });
    return response;
  }

  async getOffer(id) {
    const response = await apiClient.get(`/lead_management/offers/${id}`);
    return response;
  }

  async updateOffer(id, data = {}) {
    const response = await apiClient.put(`/lead_management/offers/${id}`, data);
    return response;
  }

  async deleteOffer(id) {
    await apiClient.delete(`/lead_management/offers/${id}`);
  }

  async createOffer(data = {}) {
    const response = await apiClient.post("/lead_management/offers", data);
    return response;
  }
}

export const offersApi = new OffersApi();
