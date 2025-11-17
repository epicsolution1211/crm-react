import apiClient from "src/utils/request";

export const pspLinksApi = {
  getPspLinks: (params) => apiClient.get('/company/psp_links', { params }),
  
  createPspLink: (data) => {
    const formData = new FormData();
    if (data.file) {
      formData.append('avatar', data.file);
    }
    formData.append('name', data.name);
    formData.append('link', data.link);
    formData.append('description', data.description);
    formData.append('internal_brand_id', data.internal_brand_id);
    if (data.client_id) {
      formData.append('client_id', data.client_id);
    }
    return apiClient.post('/company/psp_links', formData);
  },
  
  updatePspLink: (id, data) => {
    const formData = new FormData();
    if (data.file) {
      formData.append('avatar', data.file);
    }
    formData.append('name', data.name);
    formData.append('link', data.link);
    formData.append('description', data.description);
    formData.append('internal_brand_id', data.internal_brand_id);
    if (data.client_id) {
      formData.append('client_id', data.client_id);
    }
    return apiClient.put(`/company/psp_links/${id}`, formData);
  },

  deletePspLink: (id) => apiClient.delete(`/company/psp_links/${id}`),
};
