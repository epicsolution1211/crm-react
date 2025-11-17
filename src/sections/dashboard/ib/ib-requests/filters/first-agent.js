import React from 'react';
import { useSelector, useDispatch } from "react-redux";

import { FilterSelect } from "src/components/customize/filter-select";
import { thunks } from "src/thunks/customers";
import { useAuth } from "src/hooks/use-auth";
import { useGetCustomerAgents } from "src/api-swr/customer";

export const FirstAgent = () => {
  const dispatch = useDispatch();

  const filters = useSelector((state) => state.customers.iBRequestsFilters);
  const updateFilters = (data) => dispatch(thunks.setFilters(data));

  const { user } = useAuth();
  const { agentList } = useGetCustomerAgents({ desk_ids: user?.desk_ids, per_page: 10000, non_account_ids: [], q : "*"});

  return (
    <FilterSelect
      withSearch
      label="FIRST ASSIGNED AGENT"
      placeholder="First Assigned Agent..."
      options={agentList ?? []}
      setValue={(val) => {
        updateFilters({ first_assigned_agent_name: val });
      }}
      value={filters?.first_assigned_agent_name}
    />
  )
}
