import React from 'react';
import { useSelector } from "react-redux";
import { FilterMultiSelect } from "src/components/customize/filter-multi-select";

import { useGetCustomerBrands } from "src/api-swr/customer";

export const BrandFilter = ({ updateFilters }) => {
  const { brandList: brandsList } = useGetCustomerBrands({});

  const filters = useSelector((state) => state.customers.iBRequestsFilters);

  return (
    <FilterMultiSelect
      label="INTERNAL BRAND"
      withSearch
      placeholder="Internal brand..."
      options={brandsList ?? []}
      onChange={(val) => {
        updateFilters({ internal_brand_ids: val });
      }}
      value={filters?.internal_brand_ids}
      isExclude
      onChangeNon={(val) => {
        updateFilters({ non_internal_brand_ids: val });
      }}
      valueNon={filters?.non_internal_brand_ids}
    />
  )
}