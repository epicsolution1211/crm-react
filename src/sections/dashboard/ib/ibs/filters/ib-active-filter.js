import React from 'react';
import { useSelector } from "react-redux";

import { MultiSelect } from "src/components/multi-select";

export const IBActiveFilter = ({ updateFilters }) => {

  const filters = useSelector((state) => state.customers.iBsFilters);

  return (
    <MultiSelect
      noPadding
      label="ACTIVE"
      width={150}
      options={
      [{
          label: "Active",
          value: "true",
        },
        {
          label: "InActive",
          value: "false",
        }]
      }
      onChange={(val) => {
        updateFilters({ is_active_ib: val });
      }}
      value={filters?.is_active_ib}
    />
  )
}
