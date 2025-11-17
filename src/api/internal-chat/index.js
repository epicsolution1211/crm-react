import apiClient from 'src/utils/request';

class InternalChatApi {
  async getInternalChats(params = {}) {
    const response = apiClient.get('/chat/conversation/conversations/internals', {
      params,
    });
    return response;
  }

  async createConversation(request = {}) {
    const response = apiClient.post('/chat/conversation/conversations/internals', request);
    return response;
  }

  async updateConversation(id, request = {}) {
    const response = apiClient.put(`/chat/conversation/conversations/internals/${id}`, request);
    return response;
  }

  async updateUnReadCount(data) {
    const response = apiClient.put('/chat/conversation/conversations/unread_count', data);
    return response;
  }
}

export const internalChatApi = new InternalChatApi();
