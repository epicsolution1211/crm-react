import apiClient from "src/utils/request";

class AiSupportApi {
  async getAIQuestions(params) {
    const response = await apiClient.get(`/account/ai_questions`, { params });
    return response;
  }

  async createAIQuestion(data) {
    const response = await apiClient.post(`/account/ai_questions`, data);
    return response;
  }

  async askQuestion(data) {
    const response = await apiClient.post(`/ai/docs/ask`, data);
    return response;
  }
}

export const aiSupportApi = new AiSupportApi();
