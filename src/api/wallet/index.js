import apiClient from "src/utils/request";

class WalletApi {
  async getWalletList() {
    return await apiClient.get("/account/wallet/wallets");
  }

  async getUsersAddressByContract(params = {}) {
    return await apiClient.get("/account/info", { params });
  }

  async handleCryptoSend(data = {}) {
    return await apiClient.post("/account/wallet/transactions", data);
  }

}

export const walletApi = new WalletApi();
