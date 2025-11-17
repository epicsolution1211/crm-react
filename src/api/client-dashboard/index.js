import apiClient from "../../utils/request";

class ClientDashboardApi {
  async getIcoOffers(params = {}) {
    return await apiClient.get("/company/ico_offers", { params });
  }

  async deleteIcoOffer(id) {
    await apiClient.delete(`/company/ico_offers/${id}`);
  }

  async updateIcoOffer(id, request = {}) {
    await apiClient.put(`/company/ico_offers/${id}`, request);
  }

  async createIcoOffer(request = {}) {
    return await apiClient.post("/company/ico_offers", request);
  }

  async getSavingAccounts(params = {}) {
    return await apiClient.get("/company/saving_accounts", { params });
  }
  
  async createSavingAccount(request = {}) {
    return await apiClient.post("/company/saving_accounts", request);
  }

  async updateSavingAccount(id, request = {}) {
    return await apiClient.put(`/company/saving_accounts/${id}`, request);
  }

  async deleteSavingAccount(id) {
    await apiClient.delete(`/company/saving_accounts/${id}`);
  }

  // Client

  async getClientContracts(params = {}) {
    return await apiClient.get("/company/ico_contracts", { params });
  }

  async createClientContract(request = {}) {
    return await apiClient.post("/company/ico_contracts", request);
  }

  async updateClientContract(id, request = {}) {
    return await apiClient.put(`/company/ico_contracts/${id}`, request);
  }
  
  async deleteClientContract(id) {
    await apiClient.delete(`/company/ico_contracts/${id}`);
  }

  async getClientSavingAccounts(params = {}) {
    return await apiClient.get("/company/client_saving_accounts", { params });
  }

  async createClientSavingAccount(request = {}) {
    return await apiClient.post("/company/client_saving_accounts", request);
  }

  async updateClientSavingAccount(id, request = {}) {
    return await apiClient.put(`/company/client_saving_accounts/${id}`, request);
  }
  
  async deleteClientSavingAccount(id) {
    await apiClient.delete(`/company/client_saving_accounts/${id}`);
  }
}

export const clientDashboardApi = new ClientDashboardApi();
