import apiClient from 'src/utils/request';

class ConversationApi {
  async getConversations(params = {}) {
    return await apiClient.get(`/chat/conversation/conversations/internals`, { params });
  }

  async getConversation(id) {
    return await apiClient.get(`/chat/conversation/conversations/internals/${id}`);
  }

  async updateConversation(id, request = {}) {
    return await apiClient.put(`/chat/conversation/conversations/internals/${id}`, request);
  }

  async getConversationAccounts(id, params = {}) {
    return await apiClient.get("/chat/conversation/conversations/accounts", {
      params: {
        ...params,
        conversation_id: id,
      }
    })
  }

  async updateConversationAccount(id, request = {}) {
    return await apiClient.put(`/chat/conversation/conversations/accounts/${id}`, request);
  }

  async deleteMessage(id, params = {}) {
    await apiClient.delete(`/chat/conversation/message/messages/${id}`, {
      params,
    });
  }

  async updateMessage(id, request = {}) {
    await apiClient.put(`/chat/conversation/message/messages/${id}`, request);
  }
}

export const conversationApi = new ConversationApi();
