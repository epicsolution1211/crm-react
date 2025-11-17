import React from 'react';
import { useSelector } from "react-redux";

import { FilterMultiSelect } from "src/components/customize/filter-multi-select";
import { useGetCustomerTeams } from "src/api-swr/customer";

export const TeamFilter = ({ updateFilters }) => {

  const filters = useSelector((state) => state.customers.iBsFilters);

  const { teamList } = useGetCustomerTeams();

  return (
    <FilterMultiSelect
      label="TEAM"
      withSearch
      placeholder="Team..."
      options={teamList ?? []}
      onChange={(val) => {
        updateFilters({ team_ids: val });
      }}
      isExclude
      value={filters?.team_ids}
      onChangeNon={(val) => {
        updateFilters({ non_team_ids: val });
      }}
      valueNon={filters?.non_team_ids}
    />
  )
}
