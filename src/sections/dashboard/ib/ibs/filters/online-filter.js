import React from 'react';
import { useSelector } from "react-redux";

import { MultiSelect } from "src/components/multi-select";
import { onlineOption } from '../../../customer/constants';

export const OnlineFilter = ({ updateFilters }) => {

  const filters = useSelector((state) => state.customers.iBsFilters);

  return (
    <MultiSelect
      noPadding
      label="ONLINE"
      width={150}
      options={onlineOption}
      onChange={(val) => {
        updateFilters({ online: val });
      }}
      value={filters?.online}
    />
  )
}
