import apiClient from "src/utils/request";

// NOTE: We use sessionStorage since memory storage is lost after page reload.
//  This should be replaced with a server call that returns DB persisted data.

class AuthApi {
  async getCompanies(request) {
    const response = await apiClient.post("/user/session", request);

    return response.companies;
  }

  async signUp(request) {
    const { email, name } = request;

    await apiClient.post("/user/users", {
      email,
      company_name: name,
    });
  }

  async me(request) {
    const { accountId } = request;

    const { account, company } = await apiClient.get(
      `/account/info/${accountId}`
    );

    return {
      account,
      company,
    };
  }

  async verifyEmail(request = {}) {
    const response = await apiClient.put("/account/invitation", request);
    return response;
  }

  async sendRecoveryEmail(request = {}) {
    await apiClient.post("/user/password_recovery", request);
  }

  async recoverPassword(request = {}, token = "") {
    await apiClient.put("/user/password", request, {
      headers: {
        Authorization: token,
      },
    });
  }

  async updatePassword(request = {}) {
    await apiClient.put("/account/password", request);
  }

  async logoutAllSessions() {
    await apiClient.delete("/user/session", {
      params: { logout_all: true },
    });
  }

  async getCompanyId(params = {}) {
    const response = await apiClient.get("/company/token", { params });
    return response;
  }

  async getServerUrl(request = {}) {
    const response = await apiClient.post("/company/server_urls", request);
    return response;
  }
}

export const authApi = new AuthApi();
