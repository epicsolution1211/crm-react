import { useMemo } from "react";
import apiClient, { fetcher } from "src/utils/request";
import useSWR from "swr";

class ReportsApi {
  async getAgentStatistics(data) {
    const response = await apiClient.get(`/report/agent/statistics`, { params: data });
    return response;
  }

  async getAffilateStatistics(data) {
    const response = await apiClient.get(`/report/affiliate/statistics`, { params: data });
    return response;
  }

  async getDeskStatistics(data) {
    const response = await apiClient.get(`/report/desk/statistics`, { params: data });
    return response;
  }

  // TODO: Remove this after implementing swr hook
  async getLeaderboard(data) {
    const response = await apiClient.get('/report/desk/leader', { params: data });
    return response;
  }

  async getSecurity(data) {
    const response = await apiClient.get(`/report/security/security`, { params: data });
    return response;
  }

  async getMetabaseDashboards(data) {
    const response = await apiClient.get(`/report/metabase/dashboard/dashboards`, { params: data });
    return response;
  }

  async getMetabaseDashboard(id) {
    const response = await apiClient.get(`/report/metabase/dashboard/dashboards/${id}`);
    return response;
  }

  async createMetabaseDashboard(data) {
    const response = await apiClient.post(`/report/metabase/dashboard/dashboards`, data);
    return response;
  }

  async updateMetabaseDashboard(id, data) {
    const response = await apiClient.put(`/report/metabase/dashboard/dashboards/${id}`, data);
    return response;
  }

  async deleteMetabaseDashboard(id) {
    const response = await apiClient.delete(`/report/metabase/dashboard/dashboards/${id}`);
    return response;
  }

  async resetMetabaseDashboardPassword() {
    const response = await apiClient.put(`/report/metabase/password/passwords/`);
    return response;
  }
}

export const reportsApi = new ReportsApi();

// ----------------------------------------------------------------------

export const useGetLeaderboard = (params, options) => {
  const URL = params?.desk_id ? ['/report/desk/leader', { params }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, { 
    revalidateOnFocus: false,
    keepPreviousData: true,
    ...options 
  });

  const memoizedValue = useMemo(
    () => ({
      leaderboardInfo: data?.data,
      isLoading: isLoading,
      error: error,
      isValidating: isValidating,
      empty: !isLoading && !data?.data,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
