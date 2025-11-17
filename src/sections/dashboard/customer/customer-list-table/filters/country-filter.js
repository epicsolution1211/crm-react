import React, { useMemo } from 'react';
import { useSelector } from "react-redux";

import { FilterMultiSelect } from "src/components/customize/filter-multi-select";
import { countries } from "src/utils/constant";

export const CountryFilter = ({ updateFilters }) => {
  const filters = useSelector((state) => state.customers.customerFilters);

  const countryList = useMemo(() => {
    if (countries) {
      const countryArray = countries?.map((item) => ({
        label: item?.label,
        value: item?.code,
      }));
      return countryArray;
    }
  }, [countries]);

  return (
    <FilterMultiSelect
      label="COUNTRY"
      withSearch
      isExclude
      placeholder="Country..."
      options={countryList ?? []}
      onChange={(val) => {
        updateFilters({ countries: val });
      }}
      value={filters?.countries}
      onChangeNon={(val) => {
        updateFilters({ non_countries: val });
      }}
      valueNon={filters?.non_countries}
    />
  )
}