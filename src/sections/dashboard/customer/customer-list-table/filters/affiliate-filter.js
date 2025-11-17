import React from 'react';
import { useSelector } from "react-redux";

import { FilterMultiSelect } from "src/components/customize/filter-multi-select";
import { useGetCustomerAffiliates } from "src/api-swr/customer";

export const AffiliateFilter = ({ updateFilters }) => {
  const filters = useSelector((state) => state.customers.customerFilters);

  const { affiliateList } = useGetCustomerAffiliates({ per_page: 10000 });

  return (
    <FilterMultiSelect
      label="AFFILIATE"
      withSearch
      placeholder="Affiliate..."
      options={affiliateList ?? []}
      onChange={(val) => {
        updateFilters({ affiliate_ids: val });
      }}
      value={filters?.affiliate_ids}
      isExclude
      onChangeNon={(val) => {
        updateFilters({ non_affiliate_ids: val });
      }}
      valueNon={filters?.non_affiliate_ids}
    />
  )
}
