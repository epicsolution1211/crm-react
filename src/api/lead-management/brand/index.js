import apiClient from "src/utils/request";

class BrandsApi {
  async createBrand(data) {
    const response = await apiClient.post(`/lead_management/brands`, data);
    return response;
  }

  async getBrands(request) {
    const response = await apiClient.get(`/lead_management/brands`, {
      params: request,
    });
    return response;
  }

  async getBrand(id) {
    const response = await apiClient.get(`/lead_management/brands/${id}`);
    return response;
  }

  async updateBrand(id, data) {
    const response = await apiClient.put(`/lead_management/brands/${id}`, data);
    return response;
  }

  async deleteBrand(id) {
    const response = await apiClient.delete(`/lead_management/brands/${id}`);
    return response;
  }

  async getBrandStatuses(params = {}) {
    const response = await apiClient.get("/lead_management/brand_statuses", {
      params,
    });
    return response;
  }

  async createBrandStatus(request = {}) {
    const response = await apiClient.post(
      "/lead_management/brand_statuses",
      request
    );
    return response;
  }

  async updateBrandStatus(request = {}) {
    const response = await apiClient.put(
      `/lead_management/brand_statuses/${request?.id}`,
      request
    );
    return response;
  }

  async deleteBrandStatus(id) {
    await apiClient.delete(`/lead_management/brand_statuses/${id}`);
  }

  async createAffiliate(data) {
    const response = await apiClient.post(
      `/lead_management/brand_affiliates`,
      data
    );
    return response;
  }

  async getAffiliate(id) {
    const response = await apiClient.get(
      `/lead_management/brand_affiliates?brand_id=${id}`
    );
    return response;
  }

  async updateAffiliate(id, data) {
    const response = await apiClient.put(
      `/lead_management/brand_affiliates/${id}`,
      data
    );
    return response;
  }

  async deleteAffiliate(id) {
    const response = await apiClient.delete(
      `/lead_management/brand_affiliates/${id}`
    );
    return response;
  }

  async getTimeCapacities(id) {
    const response = await apiClient.get(
      `/lead_management/time_and_capacities?brand_id=${id}`
    );
    return response;
  }

  async createTimeCapacities(data) {
    const response = await apiClient.post(
      `/lead_management/time_and_capacities`,
      data
    );
    return response;
  }

  async updateTimeCapacities(id, data) {
    const response = await apiClient.put(
      `/lead_management/time_and_capacities/${id}`,
      data
    );
    return response;
  }

  async deleteTimeCapacities(id) {
    const response = await apiClient.delete(
      `/lead_management/time_and_capacities/${id}`
    );
    return response;
  }

  async getBrandCountries(params = {}) {
    const response = await apiClient.get("/lead_management/brand_countries", {
      params,
    });
    return response;
  }

  async createBrandCountry(data = {}) {
    const response = await apiClient.post(
      "/lead_management/brand_countries",
      data
    );
    return response;
  }

  async updateBrandCountry(id, data = {}) {
    const response = await apiClient.put(
      `/lead_management/brand_countries/${id}`,
      data
    );
    return response;
  }

  async deleteBrandCountry(id) {
    await apiClient.delete(`/lead_management/brand_countries/${id}`);
  }

  async getBrandParams(params = {}) {
    const response = await apiClient.get("/lead_management/brand_params", {
      params,
    });
    return response;
  }

  async createBrandParams(data = {}) {
    const response = await apiClient.post(
      "/lead_management/brand_params",
      data
    );
    return response;
  }

  async updateBrandParams(id, data = {}) {
    const response = await apiClient.put(
      `/lead_management/brand_params/${id}`,
      data
    );
    return response;
  }

  async deleteBrandParams(id, params) {
    await apiClient.delete(`/lead_management/brand_params/${id}`, {
      params,
    });
  }

  async getInternalBrands() {
    return await apiClient.get("/company/internal_brands");
  }

  async updateInternalBrand(id, request = {}) {
    return await apiClient.put(`/company/internal_brands/${id}`, request);
  }

  async createTransfer(request = {}) {
    await apiClient.post("/lead_management/brand_transfers", request);
  }

  async getTransfers(params = {}) {
    return await apiClient.get("/lead_management/brand_transfers", {
      params,
    });
  }

  async getWhatsAppTemplates(brandId, params = {}) {
    return await apiClient.get(`/company/internal_brands/${brandId}/whatsapp_templates`, {
      params,
    });
  }

  async createWhatsAppTemplate(brandId, request = {}) {
    return await apiClient.post(`/company/internal_brands/${brandId}/whatsapp_templates`, request);
  }

  async updateWhatsAppTemplate(brandId, templateId, request = {}) {
    return await apiClient.put(`/company/internal_brands/${brandId}/whatsapp_templates/${templateId}`, request);
  }

  async deleteWhatsAppTemplate(brandId, templateId) {
    return await apiClient.delete(`/company/internal_brands/${brandId}/whatsapp_templates/${templateId}`);
  }
}

export const brandsApi = new BrandsApi();
