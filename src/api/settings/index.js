import { useMemo } from "react";
import apiClient, { fetcher } from "src/utils/request";
import useSWR from "swr";
import { useAuth } from "src/hooks/use-auth";

class SettingsApi {
  async getCompanyToken() {
    const response = await apiClient.get("/company/api_token");
    return response.api_token;
  }

  async getCompany(id) {
    const response = await apiClient.get(`/company/companies/${id}`);
    return {...response.company, server_ip: response?.server_ip };
  }

  async updateCompany(request) {
    const response = await apiClient.put(
      `/company/companies/${request.id}`,
      request.data
    );
    return response.company;
  }

  async updateCompanyAiAvatar(id, request = {}) {
    const response = await apiClient.put(`/company/companies/${id}`, request);
    return response.company;
  }

  async getMembers(query = [], q = "*", params = {}, account_ids = []) {
    const response = await apiClient.get("/account/info", {
      params: {
        account_ids,
        non_account_ids: query,
        q,
        ...params,
      },
    });
    return response;
  }

  async getMemberList(params = {}) {
    const response = await apiClient.get("/account/info", { params });
    return response;
  }

  async getMember(request) {
    const response = await apiClient.get(`/account/info/${request.id}`);
    return response.account;
  }

  async updateMember(id, request = {}) {
    return await apiClient.put(`/account/info/${id}`, request);
  }

  async updateMemberAccess(request) {
    const response = await apiClient.put(
      `/account/rights/${request.id}`,
      request.data
    );
    return response;
  }

  async getSkillTeams(q, desk_id = "") {
    const response = await apiClient.get("/ticket/teams/teams", {
      params: {
        q,
        desk_id,
      },
    });
    return response.teams;
  }

  async getSkillTeam(request) {
    const response = await apiClient.get(`/ticket/teams/teams/${request.id}`);
    return response.team;
  }

  async updateSkillTeam(request) {
    const response = await apiClient.put(`/ticket/teams/teams/${request.id}`, request);
    return response;
  }

  async removeSkillTeam(request) {
    await apiClient.delete(`/ticket/teams/teams/${request.id}`);
  }

  async createSkillTeam(request) {
    await apiClient.post("/ticket/teams/teams", { name: request.name });
  }

  async getMiniChatWelcomeMessage() {
    const response = await apiClient.get("/chat/minichat/notice");
    return response.starting_notice;
  }

  async updateMiniChatWelcomeMessage(request = {}) {
    await apiClient.put("/chat/minichat/notice", request);
  }

  async getMiniChatAppearance() {
    const response = await apiClient.get("/chat/minichat/appearance");
    return response;
  }

  async updateMiniChatAppearance(request) {
    const response = await apiClient.put("/chat/minichat/appearance", request);
    return response?.appearance;
  }

  async getMiniChatInput() {
    const response = await apiClient.get("/chat/minichat/chat_input");
    return response;
  }

  async updateMiniChatInput(request) {
    await apiClient.put("/chat/minichat/chat_input", request);
  }

  async getTeams() {
    const response = await apiClient.get("/ticket/teams/teams");
    return response.teams;
  }

  async updateMiniChatDefaultTeam(request) {
    await apiClient.put("/chat/minichat/default_team", request);
  }

  async getMiniChatAvailable() {
    const response = await apiClient.get("/chat/minichat/reply_time");
    return response.reply_time;
  }

  async updateMiniChatAvailable(request) {
    await apiClient.put("/chat/minichat/reply_time", request);
  }

  async getMiniChatRating() {
    const response = await apiClient.get("/ticket/rating/setting");
    return response;
  }

  async updateMiniChatRating(request) {
    await apiClient.put("/ticket/rating/setting", request);
  }

  async getMiniChatNotice() {
    const response = await apiClient.get(
      "/chat/conversation/conversations/starting_notice"
    );
    return response;
  }

  async updateMiniChatNotice(request) {
    await apiClient.put(
      "/chat/conversation/conversations/starting_notice",
      request
    );
  }

  async updateMiniChatEmailNotification(request) {
    await apiClient.put("/chat/minichat/ticket_email", request);
  }

  async getAccountType(params = {}) {
    const response = await apiClient.get("/client/finance/account_types", {
      params,
    });
    return response;
  }

  async createAccountType(request) {
    const response = await apiClient.post(
      "client/finance/account_types",
      request
    );
    return response;
  }

  async updateAccountType(id, request) {
    const response = await apiClient.put(
      `client/finance/account_types/${id}`,
      request
    );
    return response;
  }

  async deleteAccountType(id) {
    await apiClient.delete(`client/finance/account_types/${id}`);
  }

  async getSpreadInfo(
    market,
    account_type_id,
    enabled,
    query,
    page,
    perPage,
    internalBrand
  ) {
    return await apiClient.get('/client/finance/spreads', {
      params: {
        market,
        account_type_id,
        enabled,
        q: query?.length > 0 ? query : null,
        per_page: perPage,
        page: page + 1,
        internal_brand_id: internalBrand,
      }
    });
  }

  async getSpreads(params = {}) {
    return await apiClient.get("/client/finance/spreads", { params });
  }

  async getTickers(params = {}) {
    const response = await apiClient.get(`client/finance/tickers`, { params });
    return response;
  }

  async updateSpread(id, data) {
    const response = await apiClient.put(`client/finance/spreads/${id}`, data);
    return response;
  }

  async getCompanyLogo(id, { params }) {
    const response = await apiClient.get(`/company/companies/${id}`, { params });
    return response;
  }

  async getTeamsData() {
    const response = await apiClient.get(`/ticket/teams/teams/`);
    return response;
  }

  async updateEmailDomain() {
    const response = await apiClient.put(`/company/email_domain`);
    return response;
  }

  async getCompanyData(id) {
    const response = await apiClient.get(`/company/companies/${id}`);
    return response;
  }

  async updateCompanyLogo(id, data) {
    const response = await apiClient.put(`/company/companies/${id}`, data);
    return response;
  }

  async deleteCompanyLogo() { }

  async getCompanyWallet(params) {
    const response = await apiClient.get(
      `/company/wallet/wallets`,
      { params }
    );
    return response;
  }

  async updateCompanyWallet(id, data) {
    const response = await apiClient.put(`/company/wallet/wallets/${id}`, data);
    return response;
  }

  async withdrawWallet(data) {
    const response = await apiClient.post(`/company/wallet/withdrawl`, data);
    return response;
  }

  async getCallProviders(params = {}) {
    const response = await apiClient.get("/chat/conversation/call/providers", {
      params,
    });
    return response;
  }

  async getCallProfiles(params = {}) {
    const response = await apiClient.get("/company/provider_profiles", {
      params,
    });
    return response;
  }

  async getCallProfile(id) {
    const response = await apiClient.get(`/company/provider_profiles/${id}`);
    return response;
  }

  async createCallProfile(request = {}) {
    const response = await apiClient.post("/company/provider_profiles", request);
    return response;
  }

  async updateCallProfile(id, request = {}) { 
    const response = await apiClient.put(`/company/provider_profiles/${id}`, request);
    return response;
  }

  async deleteCallProfile(id) {
    await apiClient.delete(`/company/provider_profiles/${id}`);
  }

  async makeCallProfileDefault(id) {
    const response = await apiClient.put(`/company/provider_profiles/${id}`, {
      provider_profile: {
        is_default: true,
      }
    });
    return response;
  }

  async getCallProvider(params = {}) {
    const response = await apiClient.get(
      "/chat/conversation/call/providers/x",
      {
        params,
      }
    );
    return response;
  }

  async updateCallProvider(request = {}) {
    const response = await apiClient.put(
      "/chat/conversation/call/providers/x",
      request
    );
    return response;
  }

  async callRequest(request = {}) {
    const response = await apiClient.post(
      "/chat/conversation/call/call_request",
      request
    );
    return response;
  }

  async syncCampaign(request = {}) {
    const response = await apiClient.put(
      "/chat/conversation/call/call_request",
      request
    );
    return response;
  }

  async inviteMember(request = {}) {
    return await apiClient.post("/account/invitation/", request);
  }

  async getReminders(params = {}) {
    const response = await apiClient.get("/account/reminders", { params });
    return response;
  }

  async createReminder(request = {}) {
    const response = await apiClient.post("/account/reminders", request);
    return response;
  }

  async deleteReminder(id) {
    await apiClient.delete(`/account/reminders/${id}`);
  }

  async deleteAllReminder(data, id = 1) {
    await apiClient.put(`/account/reminders/${id}`, data);
  }

  async updateReminder(id, data) {
    await apiClient.put(`/account/reminders/${id}`, data);
  }

  async deleteMember(id) {
    await apiClient.delete(`/user/users`, {
      params: { account_id: id },
    });
  }

  async getIpAddress(id) {
    const response = await apiClient.get(`/account/ips`, {
      params: { account_id: id },
    });
    return response;
  }

  async createIpAddress(data) {
    const response = await apiClient.post(`/account/ips`, data);
    return response;
  }

  async updateIpAddress(id, data) {
    const response = await apiClient.put(`/account/ips/${id}`, data);
    return response;
  }

  async deleteIpAddress(id, params = {}) {
    const response = await apiClient.delete(`account/ips/${id}`, { params });
    return response;
  }

  // Company IP
  async getCompanyIpAddress(id) {
    const response = await apiClient.get(`/company/ips`, {
      params: { account_id: id },
    });
    return response;
  }

  async createCompanyIpAddress(data) {
    const response = await apiClient.post(`/company/ips`, data);
    return response;
  }

  async updateCompanyIpAddress(id, data) {
    const response = await apiClient.put(`/company/ips/${id}`, data);
    return response;
  }

  async deleteCompanyIpAddress(id) {
    const response = await apiClient.delete(`/company/ips/${id}`);
    return response;
  }

  // TODO: Remove this after implementing swr hook
  async getDesk(params = {}) {
    return await apiClient.get("/client/desks", { params });
  }

  async getDeskInfo(id) {
    return await apiClient.get(`/client/desks/${id}`);
  }

  async createDesk(request = {}) {
    return await apiClient.post("/client/desks", request);
  }

  async updateDesk(id, request = {}) {
    return await apiClient.put(`/client/desks/${id}`, request);
  }

  async deleteDesk(id) {
    await apiClient.delete(`/client/desks/${id}`);
  }

  // Roles
  async getRoles(params = {}) {
    return await apiClient.get("/company/role_temps", { params });
  }

  async getRole(id) {
    return await apiClient.get(`/company/role_temps/${id}`);
  }

  async createRole(request = {}) {
    return await apiClient.post("/company/role_temps", request);
  }

  async updateRole(id, request = {}) {
    return await apiClient.put(`/company/role_temps/${id}`, request);
  }

  async deleteRole(id) {
    await apiClient.delete(`/company/role_temps/${id}`);
  }

  async getCards(params = {}) {
    return await apiClient.get("/client/dashboard/cards", { params });
  }

  async createCard(request = {}) {
    return await apiClient.post("/client/dashboard/cards", request);
  }

  async updateCard(id, request = {}) {
    return await apiClient.put(`/client/dashboard/cards/${id}`, request);
  }

  async deleteCard(id, params = {}) {
    await apiClient.delete(`/client/dashboard/cards/${id}`, { params });
  }

  async getReports() {
    return await apiClient.get("/company/reports");
  }

  async getHistory(params = {}) {
    return await apiClient.get("/company/history", { params });
  }

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

export const settingsApi = new SettingsApi();


// ----------------------------------------------------------------------

export const useGetDesks = (options = {}) => {
  const { user } = useAuth();
  const URL = '/client/desks';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, { 
    revalidateOnFocus: false,
    keepPreviousData: true,
    ...options 
  });

  const memoizedValue = useMemo(
    () => ({
      desks: data?.desks ?? [],
      deskOptions: data?.desks?.length > 0 ? data?.desks?.map((item) => ({
        label: item?.name,
        value: item?.id,
      })) : [],
      desksFilteredByUser: data?.desks?.length > 0 ? data?.desks?.filter((item) => user?.desk_ids?.includes(item?.id)).map((desk) => ({
        label: desk?.name,
        value: desk?.id,
      })) : [],
      isLoading: isLoading,
      error: error,
      isValidating: isValidating,
      empty: !isLoading && !data?.desks?.length,
    }),
    [data, error, isLoading, isValidating, user]
  );

  return memoizedValue;
}

