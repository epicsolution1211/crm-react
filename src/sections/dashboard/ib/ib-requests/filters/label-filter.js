import React from 'react';
import { useSelector } from "react-redux";
import { FilterMultiSelect } from "src/components/customize/filter-multi-select";
import { useGetCustomerLabels } from "src/api-swr/customer";

export const LabelFilter = ({ handleLabelsDialogOpen, updateFilters }) => {

  const { labelList } = useGetCustomerLabels();

  const filters = useSelector((state) => state.customers.iBRequestsFilters);

  return (
    <FilterMultiSelect
      label="LABELS"
      withSearch
      placeholder="Label..."
      options={labelList ?? []}
      onChange={(val) => {
        updateFilters({ label_ids: val });
      }}
      isExclude
      handleModalOpen={() => handleLabelsDialogOpen(true)}
      value={filters?.label_ids}
      onChangeNon={(val) => {
        updateFilters({ non_label_ids: val });
      }}
      valueNon={filters?.non_label_ids}
    />
  )
}
