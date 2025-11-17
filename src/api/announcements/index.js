import apiClient from "src/utils/request";

class AnnouncementsApi {
  async getAnnouncements(params = {}) {
    return await apiClient.get("/company/client/announcement/announcements", { params });
  }

  async getAnnouncement(id) {
    return await apiClient.get(`/company/client/announcement/announcements/${id}`);
  }

  async createAnnouncement(request = {}) {
    return await apiClient.post("/company/client/announcement/announcements", request);
  }

  async updateAnnouncement(id, request = {}) {
    return await apiClient.put(`/company/client/announcement/announcements/${id}`, request);
  }

  async deleteAnnouncement(id) {
    return await apiClient.delete(`/company/client/announcement/announcements/${id}`);
  }

  async getClientAnnouncements(params = {}) {
    return await apiClient.get(`/company/client/announcement/settings/client_announcements`, { params });
  }

  async assignAnnouncement(params = {}, request = {}) {
    return await apiClient.post(`/company/client/announcement/settings/update_bulk`, request, { params });
  }
}

export const announcementsApi = new AnnouncementsApi();
