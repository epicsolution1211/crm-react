import React from 'react';
import { useSelector } from "react-redux";

import { MultiSelect } from "src/components/multi-select";

export const approvedOption = [
  {
    label: "Approved",
    value: "true",
  },
];

export const IBApprovedFilter = ({ updateFilters }) => {

  const filters = useSelector((state) => state.customers.iBRequestsFilters);

  return (
    <MultiSelect
      noPadding
      label="APPROVED IB"
      width={150}
      options={approvedOption}
      onChange={(val) => {
        updateFilters({ is_ib_approved : val });
      }}
      value={filters?.is_ib_approved }
    />
  )
}
