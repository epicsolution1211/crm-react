import React from 'react';
import { FilterSelect } from "src/components/customize/filter-select";

export const FieldFilter = ({ field, updateFilters, fieldList }) => {

  return (
    <FilterSelect
      withSearch
      label="FIELD"
      placeholder="Field..."
      options={fieldList ?? []}
      setValue={(val) => {
        updateFilters(val);
      }}
      value={field}
    />
  )
}
