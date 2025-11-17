import { deepCopy } from "src/utils/deep-copy";
import { post, posts } from "./data";
import apiClient from "src/utils/request";

class BlogApi {
  getPosts() {
    return Promise.resolve(deepCopy(posts));
  }

  getPost() {
    return Promise.resolve(deepCopy(post));
  }

  async getArticles(request = {}) {
    const response = await apiClient.get("/article/questions", {
      params: request,
    });
    return response;
  }

  async getArticle(id, companyId) {
    const response = await apiClient.get(`/article/questions/${id}`, {
      params: { company_id: companyId }
    });
    return response;
  }

  async createArticle(request = {}) {
    const response = await apiClient.post('/article/questions', request);
    return response;
  }

  async updateArticle(id, request = {}) {
    const response = await apiClient.put(`/article/questions/${id}`, request);
    return response;
  }

  async deleteArticle(id) {
    await apiClient.delete(`/article/questions/${id}`);
  }

  async getArticleLabels(params = {}) {
    const response = await apiClient.get('/article/question_labels', {
      params
    });
    return response;
  }

  async createArticleLabel(request = {}) {
    const response = await apiClient.post('/article/question_labels', request);
    return response;
  }

  async updateArticleLabel(request = {}) {
    const response = await apiClient.put(`/article/question_labels/${request.id}`, request);
    return response;
  }

  async deleteArticleLabel(id) {
    await apiClient.delete(`/article/question_labels/${id}`);
  }
}

export const blogApi = new BlogApi();
