import React from 'react';
import { useSelector } from "react-redux";

import { FilterSelect } from "src/components/customize/filter-select";
import { useAuth } from "src/hooks/use-auth";
import { useGetCustomerAgents } from "src/api-swr/customer";

export const ThirdCaller = ({ updateFilters }) => {

  const filters = useSelector((state) => state.customers.iBRequestsFilters);

  const { user } = useAuth();
  const { agentList } = useGetCustomerAgents({ desk_ids: user?.desk_ids, per_page: 10000, non_account_ids: [], q : "*"});

  return (
    <FilterSelect
      withSearch
      label="THIRD CALLER"
      placeholder="Third Caller..."
      options={agentList ?? []}
      setValue={(val) => {
        updateFilters({ third_caller_name: val });
      }}
      value={filters?.third_caller_name}
    />
  )
}
