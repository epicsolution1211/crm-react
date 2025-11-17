import apiClient from "src/utils/request";

class TodoApi {
  async getToDoList(params) {
    const response = await apiClient.get('/account/todos', { params });
    return response;
  }

  async getToDo(id) {
    const response = await apiClient.get(`/account/todos/${id}`);
    return response;
  }

  async createToDo(data) {
    const response = await apiClient.post('/account/todos', data);
    return response;
  }

  async deleteToDo(id) {
    const response = await apiClient.delete(`/account/todos/${id}`);
    return response;
  }

  async updateToDo(id, data) {
    // If data contains attachments, use FormData for multipart upload
    if (data.attachments && data.attachments.length > 0) {
      const formData = new FormData();
      
      // Add all non-file data
      Object.keys(data).forEach(key => {
        if (key !== 'attachments') {
          if (typeof data[key] === 'object') {
            formData.append(key, JSON.stringify(data[key]));
          } else {
            formData.append(key, data[key]);
          }
        }
      });
      
      // Add attachments as array parameters (attachments[], attachments[], etc.)
      data.attachments.forEach((file) => {
        // Ensure we have a valid File object
        if (file instanceof File) {
          formData.append('attachments[]', file);
        } else if (file && typeof file === 'object' && file.file instanceof File) {
          // Handle case where file is wrapped in an object with a 'file' property
          formData.append('attachments[]', file.file);
        } else {
          console.warn(`Invalid file object:`, file);
        }
      });
      
      const response = await apiClient.put(`/account/todos/${id}`, formData);
      return response;
    }
    
    // Regular JSON request for non-file updates
    const response = await apiClient.put(`/account/todos/${id}`, data);
    return response;
  }

  async addParticipant(id, data) {
    const response = await apiClient.put(`/account/todos/${id}/add_participant`, data);
    return response;
  }

  async removeParticipant(id, data) {
    const response = await apiClient.put(`/account/todos/${id}/remove_participant`, data);
    return response;
  }

  async addWatcher(id, data) {
    const response = await apiClient.put(`/account/todos/${id}/add_watcher`, data);
    return response;
  }

  async removeWatcher(id, data) {
    const response = await apiClient.put(`/account/todos/${id}/remove_watcher`, data);
    return response;
  }

  async addTeam(id, data) {
    const response = await apiClient.put(`/account/todos/${id}/add_team`, data);
    return response;
  }

  async removeTeam(id, data) {
    const response = await apiClient.put(`/account/todos/${id}/remove_team`, data);
    return response;
  }

  async addDesk(id, data) {
    const response = await apiClient.put(`/account/todos/${id}/add_desk`, data);
    return response;
  }

  async removeDesk(id, data) {
    const response = await apiClient.put(`/account/todos/${id}/remove_desk`, data);
    return response;
  } 

  // Todo Labels
  async createTodoLabel(data) {
    const response = await apiClient.post('/account/todo_labels', data);
    return response;
  }

  async updateTodoLabel(id, data) {
    const response = await apiClient.put(`/account/todo_labels/${id}`, data);
    return response;
  }

  async deleteTodoLabel(id) {
    const response = await apiClient.delete(`/account/todo_labels/${id}`);
    return response;
  }

  // Todo Comments
  async getTodoComments(params) {
    const response = await apiClient.get('/account/todo_comments', { params });
    return response;
  }

  async createTodoComment(data) {
    const response = await apiClient.post('/account/todo_comments', data);
    return response;
  }

  async updateTodoComment(id, data) {
    const response = await apiClient.put(`/account/todo_comments/${id}`, data);
    return response;
  }

  async deleteTodoComment(id) {
    const response = await apiClient.delete(`/account/todo_comments/${id}`);
    return response;
  }

  async generateAiSummary(id, data) {
    const response = await apiClient.post(`/account/todos/${id}/generate_ai_summary`, data);
    return response;
  }

  async generateBulkAiSummary() {
    const response = await apiClient.post('/account/todos/bulk_ai_summary', { bulk_generate: true });
    return response;
  }
}

export const todoApi = new TodoApi();
