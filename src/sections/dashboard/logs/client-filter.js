import React from 'react';
import { FilterSelect } from "src/components/customize/filter-select";

export const ClientFilter = ({ clientId, updateFilters, clientList, clientSearch, onSetClientSearch }) => {
  return (
    <FilterSelect
      withApiSearch
      label="CLIENT"
      placeholder="Client name..."
      options={clientList ?? []}
      setValue={(val) => {
        updateFilters(val);
      }}
      value={clientId}
      searchValue={clientSearch}
      onSetSearchValue={onSetClientSearch}
    />
  )
}
