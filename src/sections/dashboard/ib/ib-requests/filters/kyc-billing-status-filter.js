import React from 'react';
import { useSelector } from "react-redux";

import { FilterSelect } from "src/components/customize/filter-select";

const kycBillingStatusList = [
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
  { label: "Not Verified", value: "Not verified" },
];

export const KycBillingStatusFilter = ({ updateFilters }) => {
  const filters = useSelector((state) => state.customers.iBRequestsFilters);

  return (
    <FilterSelect
      withSearch
      label="KYC BILLING STATUS"
      placeholder="KYC Billing Status..."
      options={kycBillingStatusList ?? []}
      setValue={(val) => {
        updateFilters({ kyc_billing_status: val });
      }}
      value={filters?.kyc_billing_status}
    />
  )
}
