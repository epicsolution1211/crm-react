import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { FilterMultiSelect } from "src/components/customize/filter-multi-select";
import { settingsApi } from '../../../../../api/settings/index';

export const TradingAccountFilter = ({ updateFilters }) => {
  const [tradingAccountList, setTradingAccountList] = useState([]);

  const getAccountType = async () => {
    try {
      const res = await settingsApi.getAccountType({ per_page: 10000 });
      setTradingAccountList(res?.account_types?.map((item) => ({
        label: item?.name,
        value: item?.id,
      })));
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getAccountType();
  }, []);

  const filters = useSelector((state) => state.customers.iBsFilters);

  return (
    <FilterMultiSelect
      label="TRADING ACCOUNTS"
      withSearch
      placeholder="Trading Account..."
      options={tradingAccountList ?? []}
      onChange={(val) => {
        updateFilters({ trading_account_ids: val });
      }}
      isExclude
      value={filters?.trading_account_ids}
      onChangeNon={(val) => {
        updateFilters({ non_trading_account_ids: val });
      }}
      valueNon={filters?.non_trading_account_ids}
    />
  )
}
