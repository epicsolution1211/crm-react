import React from 'react';
import { useSelector } from "react-redux";

import { FilterSelect } from "src/components/customize/filter-select";
import { useAuth } from "src/hooks/use-auth";
import { useGetCustomerAgents } from "src/api-swr/customer";

export const SecondAgent = ({ updateFilters }) => {
  const filters = useSelector((state) => state.customers.customerFilters);

  const { user } = useAuth();
  const { agentList } = useGetCustomerAgents({ desk_ids: user?.desk_ids, per_page: 10000, non_account_ids: [], q : "*"});

  return (
    <FilterSelect
      withSearch
      label="SECOND ASSIGNED AGENT"
      placeholder="Second Assigned Agent..."
      options={agentList ?? []}
      setValue={(val) => {
        updateFilters({ second_assigned_agent_name: val });
      }}
      value={filters?.second_assigned_agent_name}
    />
  )
}
