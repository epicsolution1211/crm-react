import apiClient from "../../utils/request";

class CommentsApi {
  async getComments(params = {}) {
    return await apiClient.get("/client/comments", { params });
  }

  async createComment(request = {}) {
    return await apiClient.post("/client/comments", request);
  }

  async deleteComment(id) {
    await apiClient.delete(`/client/comments/${id}`);
  }

  async updateComment(id, request = {}) {
    return await apiClient.put(`/client/comments/${id}`, request);
  }
}

export const commentsApi = new CommentsApi();
