import axios from 'axios';

import { getDynamicMiniChatServerUrl } from 'src/config';
class MiniChatApi {
  async initializeChat(companyToken, data) {
    const response = axios.post(`${getDynamicMiniChatServerUrl()}/chat/minichat/initializations`, data,
      { headers: { 'Authorization': companyToken, 'Content-Type': 'application/json' } });
    return response;
  }

  async getTickets(companyToken, params) {
    const response = axios.get(`${getDynamicMiniChatServerUrl()}/ticket/tickets`,
      { params, headers: { 'Authorization': companyToken, 'Content-Type': 'application/json' } });
    return response;
  }

  async getMessages(token, params = {}) {
    const response = await axios.get(`${getDynamicMiniChatServerUrl()}/chat/conversation/message/messages/`, {
      params, headers: { 'Authorization': token, 'Content-Type': 'application/json' }
    });
    return response;
  }

  async getMiniAppearance(companyToken) {
    const response = await axios.get(`${getDynamicMiniChatServerUrl()}/chat/minichat/appearance/`,
      { headers: { 'Authorization': companyToken, 'Content-Type': 'application/json' } });
    return response;
  }

  async getMiniStartNotice(companyToken) {
    const response = await axios.get(`${getDynamicMiniChatServerUrl()}/chat/minichat/notice/`,
      { headers: { 'Authorization': companyToken, 'Content-Type': 'application/json' } }
    );
    return response;
  }

  async sendMessage(clientToken, data) {
    const response = await axios.post(`${getDynamicMiniChatServerUrl()}/chat/conversation/message/messages/`, data,
      { headers: { 'Authorization': clientToken, 'Content-Type': 'application/json' } }
    );
    return response;
  }

  async getCompany(id) {
    const response = await axios.get(`${getDynamicMiniChatServerUrl()}/company/companies/${id}`);
    return response;
  }
}

export const miniChatApi = new MiniChatApi();
