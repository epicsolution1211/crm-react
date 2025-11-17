import React from 'react';
import { useSelector } from "react-redux";

import { FilterSelect } from "src/components/customize/filter-select";
import { statusList } from '../../../customer/constants';

export const ChatState = ({ updateFilters }) => {
  const filters = useSelector((state) => state.customers.iBsFilters);

  return (
    <FilterSelect
      label="CHATS STATE"
      options={statusList ?? []}
      setValue={(val) => {
        updateFilters({ status: val });
      }}
      value={filters?.status}
      isExclude
      setNonValue={(val) => {
        updateFilters({ non_status: val });
      }}
      nonValue={filters?.non_status}
    />
  )
}
