import apiClient from "src/utils/request";

class CustomersApi {
  async getCustomers(params) {
    const response = await apiClient.get("/client/clients", { params });
    return response;
  }

  async deleteCustomers(params) {
    await apiClient.delete("/client/clients/x", { params });
  }

  async getCustomerInfo(id) {
    const response = await apiClient.get(`/client/clients/${id}`);
    return response;
  }

  async updateCustomerKyc(id, request = {}) {
    const response = await apiClient.put(
      `/client/clients/${id}`,
      request
    );
    return response;
  }

  async updateCustomer(request = {}) {
    const response = await apiClient.put(
      `/client/clients/${request.id}`,
      request
    );
    return response;
  }

  async getCustomerLabels(params) {
    const response = await apiClient.get("/client/labels/labels/", { params });
    return response;
  }

  async createCustomer(request = {}) {
    const response = await apiClient.post("/client/clients", request);
    return response;
  }

  async getPositions(params) {
    const response = await apiClient.get(
      `client/finance/positions?client_id=${params?.id}&per_page=${params?.perPage}&page=${params?.page}&q=${params?.query}`
    );
    return response;
  }

  async getTicket(params = {}) {
    const response = await apiClient.get(`/ticket/tickets/${params?.id}`);
    return response;
  }

  async getCustomerPrevTickets(params = {}) {
    const response = await apiClient.get("/ticket/tickets", {
      params,
    });
    return response;
  }

  async getCustomersLabels(params = {}) {
    const response = await apiClient.get("/client/labels/labels", {
      params,
    });
    return response;
  }

  async getCustomersTeams(params = {}) {
    const response = await apiClient.get("/ticket/teams/teams", {
      params,
    });
    return response;
  }

  async assignCustomerTeam(request = {}) {
    const response = await apiClient.put("/client/team", request);
    return response;
  }

  async assignCustomerLabel(request = {}) {
    const response = await apiClient.put(
      "/client/labels/client_label/",
      request
    );
    return response;
  }

  async updateCustomerLabelTeam(request = {}) {
    const response = await apiClient.put(
      `/ticket/teams/team_client_labels/${request.id}`,
      request
    );
    return response;
  }

  async updateCustomerLabel(request = {}) {
    const response = await apiClient.put(
      `/client/labels/labels/${request.id}`,
      request
    );
    return response;
  }

  async deleteCustomerLabel(id) {
    const response = await apiClient.delete(`/client/labels/labels/${id}`);
    return response;
  }

  async createCustomerLabel(request = {}) {
    const response = await apiClient.post("/client/labels/labels/", request);
    return response;
  }

  async createTicket(request = {}) {
    const response = await apiClient.post("/ticket/tickets/", request);
    return response;
  }

  async closeTicket(request = {}) {
    await apiClient.delete(`/ticket/tickets/${request.id}`, request);
  }

  async updateTicket(request = {}) {
    const response = await apiClient.put(
      `/ticket/tickets/${request.id}`,
      request
    );
    return response;
  }

  async getClientCompanies(params) {
    const response = await apiClient.get("/client/companies/", { params });
    return response;
  }

  async createClientCompanies(data) {
    const response = await apiClient.post("/client/companies/", data);
    return response;
  }

  async updateClientCompanies(id, data) {
    const response = await apiClient.put(`/client/companies/${id}`, data);
    return response;
  }

  async deleteClientCompanies(id) {
    const response = await apiClient.delete(`/client/companies/${id}`);
    return response;
  }

  async deleteCustomer(id) {
    await apiClient.delete(`/client/clients/${id}`);
  }

  async openNextTicket(request = {}) {
    const response = await apiClient.post(
      "/ticket/assignee/next_ticket/",
      request
    );
    return response;
  }

  async getCustomerLastTicket(params = {}) {
    const response = await apiClient.get(
      "/chat/conversation/call/call_transaction",
      {
        params,
      }
    );
    return response;
  }

  async startAutodial(request = {}) {
    const response = await apiClient.post(
      "/ticket/assignee/auto_dial",
      request
    );
    return response;
  }

  async stopAutodial(request = {}) {
    await apiClient.delete("/ticket/assignee/auto_dial", request);
  }
  async getCustomerWallets(params = {}) {
    const response = await apiClient.get("/client/finance/wallet/wallets", {
      params,
    });
    return response;
  }

  async getTransaction(params = {}) {
    const response = await apiClient.get("/client/finance/transactions", {
      params,
    });
    return response;
  }

  async getTransactionDetails(id) {
    const response = await apiClient.get(`/client/finance/transactions/${id}`);
    return response;
  }

  async createTransaction(data) {
    const response = await apiClient.post("/client/finance/transactions", data);
    return response;
  }

  async updateTransaction(id, data) {
    const response = await apiClient.put(
      `/client/finance/transactions/${id}`,
      data
    );
    return response;
  }

  async deleteTransaction(id) {
    await apiClient.delete(`/client/finance/transactions/${id}`);
  }

  // Transaction status
  async getTransactionStatuses(params = {}) {
    return await apiClient.get("/client/finance/transaction_status", { params });
  }

  async createTransactionStatus(request = {}) {
    return await apiClient.post("/client/finance/transaction_status", request);
  }

  async updateTransactionStatus(id, request = {}) {
    return await apiClient.put(`/client/finance/transaction_status/${id}`, request);
  }

  async deleteTransactionStatus(id) {
    await apiClient.delete(`/client/finance/transaction_status/${id}`);
  }

  async getAccountTypes() {
    const response = await apiClient.get("/client/finance/account_types");
    return response;
  }

  async getBalance(params) {
    const response = await apiClient.get("/client/finance/balance", { params });
    return response;
  }

  async updateCustomerWallet(id, request = {}) {
    await apiClient.put(`/client/client_account/finance/wallet/wallets/${id}`, request);
  }

  async assignCustomerTeams(request = {}, params = {}) {
    await apiClient.post("/client/assignee/teams", request, { params });
  }

  async assignCustomerAgents(request = {}, params = {}) {
    await apiClient.post("/client/assignee/agents", request, { params });
  }

  async assignCustomerForms(request = {}, params = {}) {
    await apiClient.put("/client/forms/assign", request, { params });
  }
  
  async getCustomerPhones(params = {}) {
    const res = await apiClient.get("/company/client/phone_numbers", { params });
    return res;
  }

  async getCustomerEmails(params = {}) {
    const res = await apiClient.get("/company/client/emails", { params });
    return res;
  }

  async sendOtp(request = {}) {
    return await apiClient.post("/company/client_verification", request);
  }

  async getClientPosts(params = {}) {
    return await apiClient.get("/client/client_guides", { params });
  }

  async createClientPost(request = {}) {
    return await apiClient.post("/client/client_guides", request);
  }

  async updateClientPost(id, request = {}) {
    return await apiClient.put(`/client/client_guides/${id}`, request);
  }

  async deleteClientPost(id) {
    return await apiClient.delete(`/client/client_guides/${id}`);
  }

  async refreshWallets(params = {}) {
    return await apiClient.post("/client/finance/wallet/refresh", params);
  }

  async createTraderAccount(data = {}) {
    return await apiClient.post("/client/finance/trading_accounts", data);
  }

  async updateTraderAccount(id, data = {}) {
    return await apiClient.put(`/client/finance/trading_accounts/${id}`, data);
  }

  async deleteTraderAccount(id) {
    await apiClient.delete(`/client/finance/trading_accounts/${id}`);
  }

  async getTraderAccounts(params = {}) {
    return await apiClient.get("/client/finance/trading_accounts", { params });
  }

  async createTransferFund(data = {}) {
    return await apiClient.post("/client/finance/transfer_funds", data);
  }

  async updateTraderAccountPasswords(accountId, request = {}) {
    const response = await apiClient.put(`/client/trading_accounts/${accountId}/passwords`, request);
    return response;
  }

  // Security report
  async getClientSecurityReport(params = {}) {
    return await apiClient.get("/report/security/security", { params });
  }

  // AI Summary
  async getClientAISummary(clientId) {
    const response = await apiClient.get(`/client/clients/${clientId}/ai_summary`);
    return response;
  }
  
  async getClientTransactionAISummary(clientId) {
    const response = await apiClient.post(`/client/finance/transactions/generate_ai_summary`, { client_id: clientId });
    return response;
  }

  // Calendar AI Summary (Account Reminders)
  async getCalendarAISummary() {
    const response = await apiClient.post(`/account/reminders/generate_ai_summary`);
    return response;
  }

  // Role Template AI Summary
  async getRoleTemplateAISummary(id) {
    const response = await apiClient.get(`/company/role_temps/${id}/ai_insights`);
    return response;
  }

  // Member Access AI Summary
  async getMemberAccessAISummary(id) {
    const response = await apiClient.get(`account/info/ai_summary`, { params: { account_id: id } });
    return response;
  }
}

export const customersApi = new CustomersApi();
