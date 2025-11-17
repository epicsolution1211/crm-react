import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";

import { thunks } from "src/thunks/customers";
import { FilterMultiSelect } from "src/components/customize/filter-multi-select";
import { useGetCustomerPhones } from "src/api-swr/customer";

export const PhoneFilter = ({ updateFilters }) => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.customers.customerFilters);
  const { phone } = useSelector((state) => state.customers.emailPhoneSearch);

  const updateSearchQuery = (phone) => dispatch(thunks.setEmailPhoneQuery({ phone }));

  const updatePhones = (phones) => dispatch(thunks.updatePhones(phones));
  const { phoneList } = useGetCustomerPhones(phone);

  useEffect(() => {
    updatePhones(phoneList)
  }, [phoneList])

  return (
    <FilterMultiSelect
      withSearch
      label="PHONE"
      isExclude
      placeholder="Phone number..."
      options={phoneList ?? []}
      onChange={(val) => {
        updateFilters({ phone_ids: val });
      }}
      value={filters?.phone_ids}
      onGetOptions={updateSearchQuery}
      onChangeNon={(val) => {
        updateFilters({ non_phone_ids: val });
      }}
      valueNon={filters?.non_phone_ids}
    />
  )
}