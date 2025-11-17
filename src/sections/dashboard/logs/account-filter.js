import React from 'react';
import { FilterSelect } from "src/components/customize/filter-select";
export const AccountFilter = ({ account, updateFilters, agentList }) => {
  return (
    <FilterSelect
      withSearch
      label="ACCOUNT NAME"
      placeholder="Account name..."
      options={agentList?.filter((item) => item?.value !== "_empty") ?? []}
      setValue={(val) => {
        updateFilters(val);
      }}
      value={account}
    />
  )
}
