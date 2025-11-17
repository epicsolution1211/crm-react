import React from 'react';
import { useSelector } from "react-redux";

import { FilterSelect } from "src/components/customize/filter-select";
import { useGetCustomerAffiliates } from "src/api-swr/customer";

export const FirstAffiliate = ({ updateFilters }) => {
  const filters = useSelector((state) => state.customers.iBsFilters);

  const { affiliateList } = useGetCustomerAffiliates({});

  return (
    <FilterSelect
      withSearch
      label="FIRST AFFILIATE"
      placeholder="First Affiliate..."
      options={affiliateList ?? []}
      setValue={(val) => {
        updateFilters({ first_affiliate_id: val });
      }}
      value={filters?.first_affiliate_id}
      isExclude
      setNonValue={(val) => {
        updateFilters({ non_first_affiliate_id: val });
      }}
      nonValue={filters?.non_first_affiliate_id}
    />
  )
}
