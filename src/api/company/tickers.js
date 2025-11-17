import apiClient from "../../utils/request";

export const tickersApi = {
  getTickers: ({ market_type, q, internal_brand_id, page, per_page }) => 
    apiClient.get('/company/tickers', {
      params: {
        market_type,
        q,
        internal_brand_id,
        page,
        per_page
      }
    }),
}; 