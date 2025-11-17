import { useState, useEffect } from 'react';
import { brandsApi } from "src/api/lead-management/brand";

export const useInternalBrands = () => {
  const [internalBrandsList, setInternalBrandsList] = useState([]);
  const [internalBrandsInfo, setInternalBrandsInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getBrands = async () => {
    try {
      setIsLoading(true);
      const res = await brandsApi.getInternalBrands();
      
      if (!res?.internal_brands) {
        throw new Error('No internal brands data received');
      }

      const brandsInfo = res.internal_brands.map((brand) => ({
        label: brand.company_name || 'Unnamed Brand',
        value: brand.id,
      }));

      setInternalBrandsList(brandsInfo);
      setInternalBrandsInfo(res.internal_brands);
    } catch (err) {
      setInternalBrandsList([]);
      setInternalBrandsInfo([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  return { internalBrandsList, internalBrandsInfo, isLoading, getBrands };
};