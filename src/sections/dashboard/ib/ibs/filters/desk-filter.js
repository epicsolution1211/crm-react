import React from 'react';
import { useSelector } from "react-redux";

import { useAuth } from "src/hooks/use-auth";
import { FilterMultiSelect } from "src/components/customize/filter-multi-select";

import { useGetCustomerDesks } from "src/api-swr/customer";

export const DeskFilter = ({ updateFilters }) => {
  const { user } = useAuth();

  const { deskList } = useGetCustomerDesks({}, user);

  const filters = useSelector((state) => state.customers.iBsFilters);

  return (
    <FilterMultiSelect
      label="DESK"
      withSearch
      placeholder="Desk..."
      options={deskList ?? []}
      onChange={(val) => {
        updateFilters({ desk_ids: val });
      }}
      value={filters?.desk_ids}
      isExclude
      onChangeNon={(val) => {
        updateFilters({ non_desk_ids: val });
      }}
      valueNon={filters?.non_desk_ids}
    />
  )
}
