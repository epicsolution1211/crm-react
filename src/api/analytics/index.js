import apiClient from "src/utils/request";

class AnalyticsApi {
  async getAnalyticsInfo(params) {
    let url = "";
    if (params?.company_id) {
      url = `/lead_management/analytics?start_time=${params?.start_time}&end_time=${params?.end_time}&company_id=${params?.company_id}`;
    } else {
      url = `/lead_management/analytics?start_time=${params?.start_time}&end_time=${params?.end_time}`;
    }
    const response = await apiClient.get(url);
    return response;
  }
}

export const analyticsApi = new AnalyticsApi();
