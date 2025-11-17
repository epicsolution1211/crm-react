import React from 'react';
import { useSelector } from "react-redux";

import { FilterSelect } from "src/components/customize/filter-select";

const kycIdStatusList = [
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
  { label: "Not Verified", value: "Not verified" },
];

export const KycIdStatusFilter = ({ updateFilters }) => {
  const filters = useSelector((state) => state.customers.iBsFilters);

  return (
    <FilterSelect
      withSearch
      label="KYC ID STATUS"
      placeholder="KYC ID Status..."
      options={kycIdStatusList ?? []}
      setValue={(val) => {
        updateFilters({ kyc_id_status: val });
      }}
      value={filters?.kyc_id_status}
    />
  )
}
