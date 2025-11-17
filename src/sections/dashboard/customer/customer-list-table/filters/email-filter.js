import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";

import { thunks } from "src/thunks/customers";
import { FilterMultiSelect } from "src/components/customize/filter-multi-select";
import { useGetCustomerEmails } from "src/api-swr/customer";

export const EmailFilter = ({ updateFilters }) => {
  const dispatch = useDispatch();

  const filters = useSelector((state) => state.customers.customerFilters);
  const { email } = useSelector((state) => state.customers.emailPhoneSearch);

  const updateSearchQuery = (email) => dispatch(thunks.setEmailPhoneQuery({ email }));
  const updateEmails = (emails) => dispatch(thunks.updateEmails(emails));

  const { emailList } = useGetCustomerEmails(email);

  useEffect(() => {
    updateEmails(emailList)
  }, [emailList])

  return (
    <FilterMultiSelect
      label="EMAIL"
      withSearch
      isExclude
      placeholder="Email..."
      options={emailList ?? []}
      onChange={(val) => {
        updateFilters({ email_ids: val });
      }}
      value={filters?.email_ids}
      onGetOptions={updateSearchQuery}
      onChangeNon={(val) => {
        updateFilters({ non_email_ids: val });
      }}
      valueNon={filters?.non_email_ids}
    />
  )
}