/* eslint-disable no-unused-vars */
import { useMemo, useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import isEqual from "lodash.isequal";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ChipSet } from "src/components/customize/chipset";
import { CustomFilterMultiRadio } from "src/components/customize/custom-filter-multi-radio";
import { countries } from "src/utils/constant";
import { thunks } from "src/thunks/customers";
import { useAuth } from "src/hooks/use-auth";
import { hasCustomFilter, hasFilter } from "src/utils/function";
import { useTimezone } from "src/hooks/use-timezone";

import {
  useGetCustomerLabels,
  useGetCustomerAgents,
  useGetCustomerTeams,
  useGetCustomerDesks,
  useGetCustomerAffiliates,
  useGetCustomerBrands,
  useGetCustomerAccountTypes,
} from "src/api-swr/customer";
import { statusList } from "../../customer/constants";

const kycIdStatusList = [
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
  { label: "Not Verified", value: "Not verified" },
];

export const _FilterChips = ({
  onDeselectAll,
  onSetCustomFilters,
  customFilters,
  searchSetting,
  selectedFilterValue,
}) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { toLocalTime } = useTimezone();

  const { teamList } = useGetCustomerTeams();
  const { agentList } = useGetCustomerAgents({ desk_ids: user?.desk_ids, per_page: 10000, non_account_ids: [], q: "*" });
  const { deskList } = useGetCustomerDesks({}, user);
  const { affiliateList } = useGetCustomerAffiliates({});
  const { brandList: brandsList } = useGetCustomerBrands({});
  const { labelList } = useGetCustomerLabels();
  const { accountTypeList } = useGetCustomerAccountTypes();
  const emails = useSelector((state) => state.customers.emails);
  const phones = useSelector((state) => state.customers.phones);

  const filters = useSelector((state) => state.customers.iBRequestsFilters);
  const { currentPage, perPage, ...commonFilters } = filters;

  const updateFilters = (data) => dispatch(thunks.setIBRequestsFilters(data));

  const resetFilters = () => dispatch(thunks.resetIBRequestsFilter());

  const currentFilter = useMemo(() => {
    if (searchSetting?.customer?.length && selectedFilterValue !== undefined && selectedFilterValue !== null) {
      const result = searchSetting?.customer?.find(
        (item) => item?.id === selectedFilterValue?.id
      )?.filter;
      const customFields = searchSetting?.customer?.find(
        (item) => item?.id === selectedFilterValue?.id
      )?.customFields;
      const name = selectedFilterValue.name;
      return { filter: result, fields: customFields, name };
    }
  }, [searchSetting, selectedFilterValue]);

  const currentSavedFilterName = useMemo(() => {
    if (currentFilter) {
      const currentFilters = currentFilter?.filter;
      const currentFields = currentFilter?.fields
        ? customFilters?.map((item) => {
          if (
            currentFilter?.fields?.find((field) => field?.id === item?.id)
          ) {
            return {
              ...item,
              filter: currentFilter?.fields?.find(
                (field) => field?.id === item?.id
              )?.filter,
            };
          }
          return item;
        })
        : customFilters;

      if (
        isEqual(currentFilters, filters) &&
        isEqual(currentFields, customFilters)
      ) {
        return currentFilter?.name;
      } else {
        return undefined;
      }
    }
  }, [currentFilter, customFilters, filters]);

  const setFilterSetting = () => {
    resetFilters();
    updateFilters({ ...currentFilter?.filter });
    if (currentFilter?.fields) {
      onSetCustomFilters(
        customFilters?.map((item) => {
          if (currentFilter?.fields?.find((field) => field?.id === item?.id)) {
            return {
              ...item,
              filter: currentFilter?.fields?.find(
                (field) => field?.id === item?.id
              )?.filter,
            };
          }
          return item;
        })
      );
    }
  };

  useEffect(() => {
    if (currentFilter) {
      setFilterSetting();
    }
  }, [currentFilter]);

  const countryList = useMemo(() => {
    if (countries) {
      const countryArray = countries?.map((item) => ({
        label: item?.label,
        value: item?.code,
      }));
      return countryArray;
    }
  }, [countries]);

  const dateChipVal = (val, label) => {
    if (val) {
      const newChips = val
        ? [
          {
            displayValue: val ? toLocalTime(val) : "",
            value: val,
            label: label,
          },
        ]
        : [];
      return newChips;
    } else return [];
  };

  const labelChip = useMemo(
    () =>
      filters?.label_ids?.map((value) => ({
        displayValue: labelList?.find(
          (item) => value == item?.value?.toString()
        )?.label,
        value: value,
        label: "Label",
      })),
    [filters?.label_ids, labelList]
  );

  const accountTypeChip = useMemo(
    () =>
      filters?.trading_account_ids?.map((value) => ({
        displayValue: accountTypeList?.find(
          (item) => value?.toString() === item?.value?.toString()
        )?.label,
        value: value,
        label: "Trading Account",
      })),
    [filters?.trading_account_ids, accountTypeList]
  );

  const nonTradingAccountChip = useMemo(
    () =>
      filters?.non_trading_account_ids?.map((value) => ({
        displayValue: accountTypeList?.find(
          (item) => value?.toString() === item?.value?.toString()
        )?.label,
        value: value,
        label: "Exclude Trading Account",
      })),
    [filters?.non_trading_account_ids, accountTypeList]
  );

  const onlineChip = useMemo(() => {
    const newChips = filters?.online?.map((item) => ({
      displayValue: item === "true" ? "Yes" : "No",
      value: item,
      label: "Online",
    }));
    return newChips;
  }, [filters?.online]);

  const iBApprovedChip = useMemo(() => {
    const newChips = filters?.is_ib_approved?.filter((item)=> item === "true")?.map((item) => ({
      displayValue: item === "true" ? "Yes" : "No",
      value: item,
      label: "IB Approved",
    }));
    return newChips;
  }, [filters?.is_ib_approved]);

  const deskChip = useMemo(
    () =>
      filters?.desk_ids?.map((value) => ({
        displayValue: deskList?.find((item) => value == item?.value?.toString())
          ?.label,
        value: value,
        label: "Desk",
      })),
    [filters?.desk_ids, deskList]
  );

  const balanceChip = useMemo(() => {
    const newChips = filters?.balance
      ? [
        {
          displayValue: filters?.balance,
          value: filters?.balance,
          label: "Min Balance",
        },
      ]
      : [];
    return newChips;
  }, [filters?.balance]);

  const maxBalanceChip = useMemo(() => {
    const newChips = filters?.lte_balance
      ? [
        {
          displayValue: filters?.lte_balance,
          value: filters?.lte_balance,
          label: "Max Balance",
        },
      ]
      : [];
    return newChips;
  }, [filters?.lte_balance]);

  const nonDesksChip = useMemo(
    () =>
      filters?.non_desk_ids?.map((value) => ({
        displayValue: deskList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Exclude Desk",
      })),
    [filters?.non_desk_ids, deskList]
  );

  const affiliateChip = useMemo(
    () =>
      filters?.affiliate_ids?.map((value) => ({
        displayValue: affiliateList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Affiliate",
      })),
    [filters?.affiliate_ids, affiliateList]
  );

  const nonAffiliateChip = useMemo(
    () =>
      filters?.non_affiliate_ids?.map((value) => ({
        displayValue: affiliateList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Exclude Affiliate",
      })),
    [filters?.non_affiliate_ids, affiliateList]
  );

  const ftdOwnerChip = useMemo(
    () =>
      filters?.ftd_owner_ids?.map((value) => ({
        displayValue: agentList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "FTD Owner",
      })),
    [filters?.ftd_owner_ids, agentList]
  );

  const nonFtdOwnerChip = useMemo(
    () =>
      filters?.non_ftd_owner_ids?.map((value) => ({
        displayValue: agentList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Exclude FTD Owner",
      })),
    [filters?.non_ftd_owner_ids, agentList]
  );

  const brandChip = useMemo(
    () =>
      filters?.internal_brand_ids?.map((value) => ({
        displayValue: brandsList?.find(
          (item) => value == item?.value?.toString()
        )?.label,
        value: value,
        label: "Internal Brand",
      })),
    [filters?.internal_brand_ids, brandsList]
  );

  const nonBrandChip = useMemo(
    () =>
      filters?.non_internal_brand_ids?.map((value) => ({
        displayValue: brandsList?.find(
          (item) => value == item?.value?.toString()
        )?.label,
        value: value,
        label: "Exclude Internal Brand",
      })),
    [filters?.non_internal_brand_ids, brandsList]
  );

  const nonLabelChip = useMemo(
    () =>
      filters?.non_label_ids?.map((value) => ({
        displayValue: labelList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Exclude Label",
      })),
    [filters?.non_label_ids, labelList]
  );

  const agentChip = useMemo(
    () =>
      filters?.agent_ids?.map((value) => ({
        displayValue: agentList?.find(
          (item) => value == item?.value?.toString()
        )?.label,
        value: value,
        label: "Agent",
      })),
    [filters?.agent_ids, agentList]
  );

  const nonAgentChip = useMemo(
    () =>
      filters?.non_agent_ids?.map((value) => ({
        displayValue: agentList?.find(
          (item) => value == item?.value?.toString()
        )?.label,
        value: value,
        label: "Exclude Agent",
      })),
    [filters?.non_agent_ids, agentList]
  );

  const teamChip = useMemo(
    () =>
      filters?.team_ids?.map((value) => ({
        displayValue: teamList?.find((item) => value == item?.value?.toString())
          ?.label,
        value: value,
        label: "Team",
      })),
    [filters?.team_ids, teamList]
  );

  const nonTeamChip = useMemo(
    () =>
      filters?.non_team_ids?.map((value) => ({
        displayValue: teamList?.find((item) => value == item?.value?.toString())
          ?.label,
        value: value,
        label: "Exclude Team",
      })),
    [filters?.non_team_ids, teamList]
  );

  const customFilterChip = useMemo(
    () =>
      customFilters
        ?.filter((value) => value?.filter)
        ?.map(function (value) {
          const data = {
            label: value?.label + " ",
          };

          if (
            value?.filter?.field_type === "multi_choice" ||
            value?.filter?.field_type === "multi_choice_radio"
          ) {
            data.value = value?.filter?.query?.join(", ");
            data.displayValue = value?.filter?.query
              ?.join(", ")
              ?.replace("_empty", "Empty");
          }

          if (value?.filter?.field_type === "text") {
            data.value = value?.filter?.query;
            data.displayValue =
              value?.filter?.query === "_empty"
                ? "Empty"
                : value?.filter?.query;
          }
          if (value?.filter?.field_type === "number") {
            data.displayValue = `${value?.filter?.query?.gt}-${value?.filter?.query?.lt}`;
            data.value = `${value?.filter?.query?.gt}-${value?.filter?.query?.lt}`;
          }
          if (value?.filter?.field_type === "boolean") {
            data.value = value?.filter?.query;
            data.displayValue = JSON.stringify(value?.filter?.query);
          }

          return data;
        })
        ?.filter((item) => !!item.value),
    [customFilters]
  );

  const nonCustomFilterChip = useMemo(
    () =>
      customFilters
        ?.filter((value) => value?.filter)
        ?.map(function (value) {
          const data = {
            label: "Exclude" + " " + value?.label + " ",
          };
          if (
            value?.filter?.field_type === "multi_choice" ||
            value?.filter?.field_type === "multi_choice_radio"
          ) {
            data.value = value?.filter?.non_query?.join(", ");
            data.displayValue = value?.filter?.non_query
              ?.join(", ")
              ?.replace("_empty", "Empty");
          }
          return data;
        })
        ?.filter((item) => !!item.value),
    [customFilters]
  );

  const firstAffiliateChip = useMemo(() => {
    const newChips = filters?.first_affiliate_id
      ? [
        {
          displayValue: affiliateList?.find(
            (item) => item.value === filters?.first_affiliate_id
          )?.label,
          value:
            filters?.first_affiliate_id === "_empty"
              ? "Empty"
              : filters?.first_affiliate_id,
          label: "First Affiliate",
        },
      ]
      : [];
    return newChips;
  }, [filters?.first_affiliate_id, affiliateList]);

  const nonFirstAffiliateChip = useMemo(() => {
    const newChips = filters?.non_first_affiliate_id
      ? [
        {
          displayValue: affiliateList?.find(
            (item) => item.value === filters?.non_first_affiliate_id
          )?.label,
          value:
            filters?.non_first_affiliate_id === "_empty"
              ? "Empty"
              : filters?.non_first_affiliate_id,
          label: "Exclude First Affiliate",
        },
      ]
      : [];
    return newChips;
  }, [filters?.non_first_affiliate_id, affiliateList]);

  const lastAgentStartChip = useMemo(() => {
    return dateChipVal(filters?.last_assigned_agent_at_start, "Last Agent Start");
  }, [filters?.last_assigned_agent_at_start]);

  const lastAgentEndChip = useMemo(() => {
    return dateChipVal(filters?.last_assigned_agent_at_end, "Last Agent End");
  }, [filters?.last_assigned_agent_at_end]);

  const firstStatusChangedAtStartChip = useMemo(() => {
    return dateChipVal(filters?.first_status_changed_at_start, "First Status Changed At Start");
  }, [filters?.first_status_changed_at_start]);

  const firstStatusChangedAtEndChip = useMemo(() => {
    return dateChipVal(filters?.first_status_changed_at_end, "First Status Changed At End");
  }, [filters?.first_status_changed_at_end]);

  const lastStatusChangedAtStartChip = useMemo(() => {
    return dateChipVal(filters?.last_status_changed_at_start, "Last Status Changed At Start");
  }, [filters?.last_status_changed_at_start]);

  const lastStatusChangedAtEndChip = useMemo(() => {
    return dateChipVal(filters?.last_status_changed_at_end, "Last Status Changed At End");
  }, [filters?.last_status_changed_at_end]);

  const lastCommunicationStartChip = useMemo(() => {
    return dateChipVal(filters?.last_communication_at_start, "Last Communication Start");
  }, [filters?.last_communication_at_start]);

  const lastCommunicationEndChip = useMemo(() => {
    return dateChipVal(filters?.last_communication_at_end, "Last Communication End");
  }, [filters?.last_communication_at_end]);

  const lastTeamStartChip = useMemo(() => {
    return dateChipVal(filters?.last_assigned_team_at_start, "Last Team Start");
  }, [filters?.last_assigned_team_at_start]);

  const lastTeamEndChip = useMemo(() => {
    return dateChipVal(filters?.last_assigned_team_at_end, "Last Team End");
  }, [filters?.last_assigned_team_at_end]);

  const lastDeskStartChip = useMemo(() => {
    return dateChipVal(filters?.last_assigned_desk_at_start, "Last Desk Start");
  }, [filters?.last_assigned_desk_at_start]);

  const lastDeskEndChip = useMemo(() => {
    return dateChipVal(filters?.last_assigned_desk_at_end, "Last Desk End");
  }, [filters?.last_assigned_desk_at_end]);

  const createdStartDateChip = useMemo(() => {
    return dateChipVal(filters?.created_at_start, "Created Start At");
  }, [filters?.created_at_start]);

  const createdEndDateChip = useMemo(() => {
    return dateChipVal(filters?.created_at_end, "Created At End");
  }, [filters?.created_at_end]);

  const lastOnlineStartChip = useMemo(() => {
    return dateChipVal(filters?.last_online_start, "Last Online Start");
  }, [filters?.last_online_start]);

  const lastOnlineEndChip = useMemo(() => {
    return dateChipVal(filters?.last_online_end, "Last Online End");
  }, [filters?.last_online_end]);

  const lastLoginStartChip = useMemo(() => {
    return dateChipVal(filters?.last_login_start, "Last Login Start");
  }, [filters?.last_login_start]);

  const lastLoginEndChip = useMemo(() => {
    return dateChipVal(filters?.last_login_end, "Last Login End");
  }, [filters?.last_login_end]);

  const lastTradeStartChip = useMemo(() => {
    return dateChipVal(filters?.last_trade_at_start, "Last Trade At Start");
  }, [filters?.last_trade_at_start]);

  const lastTradeEndChip = useMemo(() => {
    return dateChipVal(filters?.last_trade_at_end, "Last Trade At End");
  }, [filters?.last_trade_at_end]);

  const lastLeadDateStartChip = useMemo(() => {
    return dateChipVal(filters?.last_lead_date_start, "Last Lead Date Start");
  }, [filters?.last_lead_date_start]);

  const lastLeadDateEndChip = useMemo(() => {
    return dateChipVal(filters?.last_lead_date_end, "Last Lead Date End");
  }, [filters?.last_lead_date_end]);

  const ftdDateStartChip = useMemo(() => {
    return dateChipVal(filters?.ftd_date_start, "FTD Date Start");
  }, [filters?.ftd_date_start]);

  const ftdDateEndChip = useMemo(() => {
    return dateChipVal(filters?.ftd_date_end, "FTD Date End");
  }, [filters?.ftd_date_end]);

  const statusChip = useMemo(() => {
    const newChips = filters?.status
      ? [
        {
          displayValue: statusList?.find(
            (item) => item?.value == filters?.status
          )?.label,
          value: filters?.status === "_empty" ? "Empty" : filters?.status,
          label: "Status",
        },
      ]
      : [];
    return newChips;
  }, [filters?.status]);

  const nonStatusChip = useMemo(() => {
    const newChips = filters?.non_status
      ? [
        {
          displayValue: statusList?.find(
            (item) => item?.value == filters?.non_status
          )?.label,
          value:
            filters?.non_status === "_empty" ? "Empty" : filters?.non_status,
          label: "Exclude Status",
        },
      ]
      : [];
    return newChips;
  }, [filters?.non_status]);

  const countryChip = useMemo(
    () =>
      filters?.countries?.map((value) => ({
        displayValue: countryList?.find((item) => item?.value === value)?.label,
        value: value,
        label: "Country",
      })),
    [filters?.countries, countryList]
  );

  const nonCountryChip = useMemo(
    () =>
      filters?.non_countries?.map((value) => ({
        displayValue: countryList?.find((item) => item?.value === value)?.label,
        value: value,
        label: "Exclude country",
      })),
    [filters?.non_countries, countryList]
  );

  const emailChip = useMemo(
    () =>
      filters?.email_ids?.map((value) => ({
        displayValue: emails?.find((item) => value == item?.value)?.label,
        value: value,
        label: "Email",
      })),
    [filters?.email_ids, emails]
  );

  const nonEmailChip = useMemo(
    () =>
      filters?.non_email_ids?.map((value) => ({
        displayValue: emails?.find((item) => value == item?.value)?.label,
        value: value,
        label: "Exclude Email",
      })),
    [filters?.non_email_ids, emails]
  );

  const phoneChip = useMemo(
    () =>
      filters?.phone_ids?.map((value) => ({
        displayValue: phones?.find((item) => value == item?.value)?.label,
        value: value,
        label: "Phone",
      })),
    [filters?.phone_ids, phones]
  );

  const nonPhoneChip = useMemo(
    () =>
      filters?.non_phone_ids?.map((value) => ({
        displayValue: phones?.find((item) => value == item?.value)?.label,
        value: value,
        label: "Exclude Phone",
      })),
    [filters?.non_phone_ids, phones]
  );

  const idsChip = useMemo(() => {
    const newChips = filters?.ids
      ? [
        {
          displayValue: filters?.ids,
          value: filters?.ids,
          label: "Client Id",
        },
      ]
      : [];
    return newChips;
  }, [filters?.ids]);

  const nonIdsChip = useMemo(() => {
    const newChips = filters?.non_ids
      ? [
        {
          displayValue: filters?.non_ids,
          value: filters?.non_ids,
          label: "Exclude Client Id",
        },
      ]
      : [];
    return newChips;
  }, [filters?.non_ids]);

  const tronWalletChip = useMemo(() => {
    const newChips = filters?.tron_wallet
      ? [
        {
          displayValue: filters?.tron_wallet,
          value: filters?.tron_wallet,
          label: "Tron Wallet",
        },
      ]
      : [];
    return newChips;
  }, [filters?.tron_wallet]);

  const ethereumWalletChip = useMemo(() => {
    const newChips = filters?.ethereum_wallet
      ? [
        {
          displayValue: filters?.ethereum_wallet,
          value: filters?.ethereum_wallet,
          label: "Ethereum Wallet",
        },
      ]
      : [];
    return newChips;
  }, [filters?.ethereum_wallet]);

  const bitcoinWalletChip = useMemo(() => {
    const newChips = filters?.bitcoin_wallet
      ? [
        {
          displayValue: filters?.bitcoin_wallet,
          value: filters?.bitcoin_wallet,
          label: "Bitcoin Wallet",
        },
      ]
      : [];
    return newChips;
  }, [filters?.bitcoin_wallet]);

  const depositCountChip = useMemo(() => {
    const newChips = filters?.deposit_count
      ? [
        {
          displayValue: filters?.deposit_count,
          value: filters?.deposit_count,
          label: "Min Deposit Count",
        },
      ]
      : [];
    return newChips;
  }, [filters?.deposit_count]);

  const maxDepositCountChip = useMemo(() => {
    const newChips = filters?.lte_deposit_count
      ? [
        {
          displayValue: filters?.lte_deposit_count,
          value: filters?.lte_deposit_count,
          label: "Max Deposit Count",
        },
      ]
      : [];
    return newChips;
  }, [filters?.lte_deposit_count]);

  const firstDepositChip = useMemo(() => {
    const newChips = filters?.first_deposit
      ? [
        {
          displayValue: filters?.first_deposit,
          value: filters?.first_deposit,
          label: "Min First Deposit",
        },
      ]
      : [];
    return newChips;
  }, [filters?.first_deposit]);

  const maxFirstDepositChip = useMemo(() => {
    const newChips = filters?.lte_first_deposit
      ? [
        {
          displayValue: filters?.lte_first_deposit,
          value: filters?.lte_first_deposit,
          label: "Max First Deposit",
        },
      ]
      : [];
    return newChips;
  }, [filters?.lte_first_deposit]);

  const secondDepositChip = useMemo(() => {
    const newChips = filters?.second_deposit
      ? [
        {
          displayValue: filters?.second_deposit,
          value: filters?.second_deposit,
          label: "Min Second Deposit",
        },
      ]
      : [];
    return newChips;
  }, [filters?.second_deposit]);

  const maxSecondDepositChip = useMemo(() => {
    const newChips = filters?.lte_second_deposit
      ? [
        {
          displayValue: filters?.lte_second_deposit,
          value: filters?.lte_second_deposit,
          label: "Max Second Deposit",
        },
      ]
      : [];
    return newChips;
  }, [filters?.lte_second_deposit]);

  const thirdDepositChip = useMemo(() => {
    const newChips = filters?.third_deposit
      ? [
        {
          displayValue: filters?.third_deposit,
          value: filters?.third_deposit,
          label: "Min Third Deposit",
        },
      ]
      : [];
    return newChips;
  }, [filters?.third_deposit]);

  const maxThirdDepositChip = useMemo(() => {
    const newChips = filters?.lte_third_deposit
      ? [
        {
          displayValue: filters?.lte_third_deposit,
          value: filters?.lte_third_deposit,
          label: "Max Third Deposit",
        },
      ]
      : [];
    return newChips;
  }, [filters?.lte_third_deposit]);

  const lastDepositChip = useMemo(() => {
    const newChips = filters?.last_deposit
      ? [
        {
          displayValue: filters?.last_deposit,
          value: filters?.last_deposit,
          label: "Min Last Deposit",
        },
      ]
      : [];
    return newChips;
  }, [filters?.last_deposit]);

  const maxLastDepositChip = useMemo(() => {
    const newChips = filters?.lte_last_deposit
      ? [
        {
          displayValue: filters?.lte_last_deposit,
          value: filters?.lte_last_deposit,
          label: "Max Last Deposit",
        },
      ]
      : [];
    return newChips;
  }, [filters?.lte_last_deposit]);

  const totalDepositChip = useMemo(() => {
    const newChips = filters?.total_deposit
      ? [
        {
          displayValue: filters?.total_deposit,
          value: filters?.total_deposit,
          label: "Min Total Deposit",
        },
      ]
      : [];
    return newChips;
  }, [filters?.total_deposit]);

  const maxTotalDepositChip = useMemo(() => {
    const newChips = filters?.lte_total_deposit
      ? [
        {
          displayValue: filters?.lte_total_deposit,
          value: filters?.lte_total_deposit,
          label: "Max Total Deposit",
        },
      ]
      : [];
    return newChips;
  }, [filters?.lte_total_deposit]);

  const netDepositChip = useMemo(() => {
    const newChips = filters?.net_deposit
      ? [
        {
          displayValue: filters?.net_deposit,
          value: filters?.net_deposit,
          label: "Min Net Deposit",
        },
      ]
      : [];
    return newChips;
  }, [filters?.net_deposit]);

  const maxNetDepositChip = useMemo(() => {
    const newChips = filters?.lte_net_deposit
      ? [
        {
          displayValue: filters?.lte_net_deposit,
          value: filters?.lte_net_deposit,
          label: "Max Net Deposit",
        },
      ]
      : [];
    return newChips;
  }, [filters?.lte_net_deposit]);

  const firstDepositDateStartChip = useMemo(() => {
    return dateChipVal(filters?.first_deposit_date_start, "First Deposit Start Date");
  }, [filters?.first_deposit_date_start]);

  const firstDepositDateEndChip = useMemo(() => {
    return dateChipVal(filters?.first_deposit_date_end, "First Deposit End Date");
  }, [filters?.first_deposit_date_end]);

  const secondDepositDateStartChip = useMemo(() => {
    return dateChipVal(filters?.second_deposit_date_start, "Second Deposit Start Date");
  }, [filters?.second_deposit_date_start]);

  const secondDepositDateEndChip = useMemo(() => {
    return dateChipVal(filters?.second_deposit_date_end, "Second Deposit End Date");
  }, [filters?.second_deposit_date_end]);

  const thirdDepositDateStartChip = useMemo(() => {
    return dateChipVal(filters?.third_deposit_date_start, "Third Deposit Start Date");
  }, [filters?.third_deposit_date_start]);

  const thirdDepositDateEndChip = useMemo(() => {
    return dateChipVal(filters?.third_deposit_date_end, "Third Deposit End Date");
  }, [filters?.third_deposit_date_end]);

  const lastDepositDateStartChip = useMemo(() => {
    return dateChipVal(filters?.last_deposit_date_start, "Last Deposit Start Date");
  }, [filters?.last_deposit_date_start]);

  const lastDepositDateEndChip = useMemo(() => {
    return dateChipVal(filters?.last_deposit_date_end, "Last Deposit End Date");
  }, [filters?.last_deposit_date_end]);

  const firstDeskNameChip = useMemo(() => {
    const newChips = filters?.first_desk_name
      ? [
        {
          displayValue: filters?.first_desk_name,
          value: filters?.first_desk_name,
          label: "First Desk Name",
        },
      ]
      : [];
    return newChips;
  }, [filters?.first_desk_name]);

  const secondDeskNameChip = useMemo(() => {
    const newChips = filters?.second_desk_name
      ? [
        {
          displayValue: filters?.second_desk_name,
          value: filters?.second_desk_name,
          label: "Second Desk Name",
        },
      ]
      : [];
    return newChips;
  }, [filters?.second_desk_name]);

  const thirdDeskNameChip = useMemo(() => {
    const newChips = filters?.third_desk_name
      ? [
        {
          displayValue: filters?.third_desk_name,
          value: filters?.third_desk_name,
          label: "Third Desk Name",
        },
      ]
      : [];
    return newChips;
  }, [filters?.third_desk_name]);

  const firstAssignedAgentIdChip = useMemo(() => {
    const newChips = filters?.first_assigned_agent_id
      ? [
        {
          displayValue: filters?.first_assigned_agent_id,
          value: filters?.first_assigned_agent_id,
          label: "First Assigned Agent ID",
        },
      ]
      : [];
    return newChips;
  }, [filters?.first_assigned_agent_id]);

  const firstAssignedAgentNameChip = useMemo(() => {
    const newChips = filters?.first_assigned_agent_name
      ? [
        {
          displayValue: agentList?.find(
            (a) => a?.value === filters?.first_assigned_agent_name
          )?.label,
          value: filters?.first_assigned_agent_name,
          label: "First Assigned Agent Name",
        },
      ]
      : [];
    return newChips;
  }, [filters?.first_assigned_agent_name]);

  const firstAssignedAgentAtStartChip = useMemo(() => {
    return dateChipVal(filters?.first_assigned_agent_at_start, "First Assigned Agent At Start Date");
  }, [filters?.first_assigned_agent_at_start]);

  const firstAssignedAgentAtEndChip = useMemo(() => {
    return dateChipVal(filters?.first_assigned_agent_at_end, "First Assigned Agent At End Date");
  }, [filters?.first_assigned_agent_at_end]);

  const secondAssignedAgentIdChip = useMemo(() => {
    const newChips = filters?.second_assigned_agent_id
      ? [
        {
          displayValue: filters?.second_assigned_agent_id,
          value: filters?.second_assigned_agent_id,
          label: "Second Assigned Agent ID",
        },
      ]
      : [];
    return newChips;
  }, [filters?.second_assigned_agent_id]);

  const secondAssignedAgentNameChip = useMemo(() => {
    const newChips = filters?.second_assigned_agent_name
      ? [
        {
          displayValue: agentList?.find(
            (a) => a?.value === filters?.second_assigned_agent_name
          )?.label,
          value: filters?.second_assigned_agent_name,
          label: "Second Assigned Agent Name",
        },
      ]
      : [];
    return newChips;
  }, [filters?.second_assigned_agent_name]);

  const secondAssignedAgentAtStartChip = useMemo(() => {
    return dateChipVal(filters?.second_assigned_agent_at_start, "Second Assigned Agent At Start Date");
  }, [filters?.second_assigned_agent_at_start]);

  const secondAssignedAgentAtEndChip = useMemo(() => {
    return dateChipVal(filters?.second_assigned_agent_at_end, "Second Assigned Agent At End Date");
  }, [filters?.second_assigned_agent_at_end]);

  const thirdAssignedAgentIdChip = useMemo(() => {
    const newChips = filters?.third_assigned_agent_id
      ? [
        {
          displayValue: filters?.third_assigned_agent_id,
          value: filters?.third_assigned_agent_id,
          label: "Third Assigned Agent ID",
        },
      ]
      : [];
    return newChips;
  }, [filters?.third_assigned_agent_id]);

  const thirdAssignedAgentNameChip = useMemo(() => {
    const newChips = filters?.third_assigned_agent_name
      ? [
        {
          displayValue: agentList?.find(
            (a) => a?.value === filters?.third_assigned_agent_name
          )?.label,
          value: filters?.third_assigned_agent_name,
          label: "Third Assigned Agent Name",
        },
      ]
      : [];
    return newChips;
  }, [filters?.third_assigned_agent_name]);

  const lastAssignedAgentIdChip = useMemo(() => {
    const newChips = filters?.last_assigned_agent_id
      ? [
        {
          displayValue: filters?.last_assigned_agent_id,
          value: filters?.last_assigned_agent_id,
          label: "Last Assigned Agent ID",
        },
      ]
      : [];
    return newChips;
  }, [filters?.last_assigned_agent_id]);

  const lastAssignedAgentNameChip = useMemo(() => {
    const newChips = filters?.last_assigned_agent_name
      ? [
        {
          displayValue: agentList?.find(
            (a) => a?.value === filters?.last_assigned_agent_name
          )?.label,
          value: filters?.last_assigned_agent_name,
          label: "Last Assigned Agent Name",
        },
      ]
      : [];
    return newChips;
  }, [filters?.last_assigned_agent_name]);

  const thirdAssignedAgentAtStartChip = useMemo(() => {
    return dateChipVal(filters?.third_assigned_agent_at_start, "Third Assigned Agent At Start Date");
  }, [filters?.third_assigned_agent_at_start]);

  const thirdAssignedAgentAtEndChip = useMemo(() => {
    return dateChipVal(filters?.third_assigned_agent_at_end, "Third Assigned Agent At End Date");
  }, [filters?.third_assigned_agent_at_end]);


  const lastAssignedAgentAtStartChip = useMemo(() => {
    return dateChipVal(filters?.second_assigned_agent_at_start, "Last Assigned Agent At Start Date");
  }, [filters?.second_assigned_agent_at_start]);

  const lastAssignedAgentAtEndChip = useMemo(() => {
    return dateChipVal(filters?.second_assigned_agent_at_end, "Last Assigned Agent At End Date");
  }, [filters?.second_assigned_agent_at_end]);

  const firstCallByChip = useMemo(() => {
    const newChips = filters?.first_call_by
      ? [
        {
          displayValue: filters?.first_call_by,
          value: filters?.first_call_by,
          label: "First Call By",
        },
      ]
      : [];
    return newChips;
  }, [filters?.first_call_by]);

  const firstCallerNameChip = useMemo(() => {
    const newChips = filters?.first_caller_name
      ? [
        {
          displayValue: agentList?.find(
            (a) => a?.value === filters?.first_caller_name
          )?.label,
          value: filters?.first_caller_name,
          label: "First Caller Name",
        },
      ]
      : [];
    return newChips;
  }, [filters?.first_caller_name]);

  const kycIdStatusChip = useMemo(() => {
    const newChips = filters?.kyc_id_status
      ? [
        {
          displayValue: kycIdStatusList?.find(
            (a) => a?.value === filters?.kyc_id_status
          )?.label,
          value: filters?.kyc_id_status,
          label: "KYC ID Status",
        },
      ]
      : [];
    return newChips;
  }, [filters?.kyc_id_status]);

  const kycBillingStatusChip = useMemo(() => {
    const newChips = filters?.kyc_billing_status
      ? [
        {
          displayValue: kycIdStatusList?.find(
            (a) => a?.value === filters?.kyc_billing_status
          )?.label,
          value: filters?.kyc_billing_status,
          label: "KYC Billing Status",
        },
      ]
      : [];
    return newChips;
  }, [filters?.kyc_billing_status]);

  const firstCallAtStartChip = useMemo(() => {
    return dateChipVal(filters?.first_call_at_start, "First Call At Start Date");
  }, [filters?.first_call_at_start]);

  const firstCallAtEndChip = useMemo(() => {
    return dateChipVal(filters?.first_call_at_end, "First Call At End Date");
  }, [filters?.first_call_at_end]);

  const secondCallByChip = useMemo(() => {
    const newChips = filters?.second_call_by
      ? [
        {
          displayValue: filters?.second_call_by,
          value: filters?.second_call_by,
          label: "Second Call By",
        },
      ]
      : [];
    return newChips;
  }, [filters?.second_call_by]);

  const secondCallerNameChip = useMemo(() => {
    const newChips = filters?.second_caller_name
      ? [
        {
          displayValue: agentList?.find(
            (a) => a?.value === filters?.second_caller_name
          )?.label,
          value: filters?.second_caller_name,
          label: "Second Caller Name",
        },
      ]
      : [];
    return newChips;
  }, [filters?.second_caller_name]);

  const secondCallAtStartChip = useMemo(() => {
    return dateChipVal(filters?.second_call_at_start, "Second Call At Start Date");
  }, [filters?.second_call_at_start]);

  const secondCallAtEndChip = useMemo(() => {
    return dateChipVal(filters?.second_call_at_end, "Second Call At End Date");
  }, [filters?.second_call_at_end]);

  const thirdCallByChip = useMemo(() => {
    const newChips = filters?.third_call_by
      ? [
        {
          displayValue: filters?.third_call_by,
          value: filters?.third_call_by,
          label: "Third Call By",
        },
      ]
      : [];
    return newChips;
  }, [filters?.third_call_by]);

  const thirdCallerNameChip = useMemo(() => {
    const newChips = filters?.third_caller_name
      ? [
        {
          displayValue: agentList?.find(
            (a) => a?.value === filters?.third_caller_name
          )?.label,
          value: filters?.third_caller_name,
          label: "Third Caller Name",
        },
      ]
      : [];
    return newChips;
  }, [filters?.third_caller_name]);

  const thirdCallAtStartChip = useMemo(() => {
    return dateChipVal(filters?.third_call_at_start, "Third Call At Start Date");
  }, [filters?.third_call_at_start]);

  const thirdCallAtEndChip = useMemo(() => {
    return dateChipVal(filters?.third_call_at_end, "Third Call At End Date");
  }, [filters?.third_call_at_end]);

  const frdOwnerIdChip = useMemo(() => {
    const newChips = filters?.frd_owner_id
      ? [
        {
          displayValue: filters?.frd_owner_id,
          value: filters?.frd_owner_id,
          label: "FRD Owner ID",
        },
      ]
      : [];
    return newChips;
  }, [filters?.frd_owner_id]);

  const frdOwnerNameChip = useMemo(() => {
    const newChips = filters?.frd_owner_name
      ? [
        {
          displayValue: agentList?.find(
            (a) => a?.value === filters?.frd_owner_name
          )?.label,
          value: filters?.frd_owner_name,
          label: "FRD Owner Name",
        },
      ]
      : [];
    return newChips;
  }, [filters?.frd_owner_name]);

  const frdDateStartChip = useMemo(() => {
    return dateChipVal(filters?.frd_date_start, "FRD Start Date");
  }, [filters?.frd_date_start]);

  const frdDateEndChip = useMemo(() => {
    return dateChipVal(filters?.frd_date_end, "FRD End Date");
  }, [filters?.frd_date_end]);

  const closePnlChip = useMemo(() => {
    const newChips = filters?.close_pnl
      ? [
        {
          displayValue: filters?.close_pnl,
          value: filters?.close_pnl,
          label: "Min Close PNL",
        },
      ]
      : [];
    return newChips;
  }, [filters?.close_pnl]);

  const maxClosePnlChip = useMemo(() => {
    const newChips = filters?.lte_close_pnl
      ? [
        {
          displayValue: filters?.lte_close_pnl,
          value: filters?.lte_close_pnl,
          label: "Max Close PNL",
        },
      ]
      : [];
    return newChips;
  }, [filters?.lte_close_pnl]);

  const firstLeadCampaignChip = useMemo(() => {
    const newChips = filters?.first_lead_campaign
      ? [
        {
          displayValue: filters?.first_lead_campaign,
          value: filters?.first_lead_campaign,
          label: "First Lead Campaign",
        },
      ]
      : [];
    return newChips;
  }, [filters?.first_lead_campaign]);

  const lastLeadCampaignChip = useMemo(() => {

    const newChips = filters?.last_lead_campaign
      ? [
        {
          displayValue: filters?.last_lead_campaign,
          value: filters?.last_lead_campaign,
          label: "Last Lead Campaign",
        },
      ]
      : [];
    return newChips;
  }, [filters?.last_lead_campaign]);

  const totalCalledChip = useMemo(() => {
    const newChips = filters?.total_called
      ? [
        {
          displayValue: filters?.total_called,
          value: filters?.total_called,
          label: "Min Total Called",
        },
      ]
      : [];
    return newChips;
  }, [filters?.total_called]);

  const maxTotalCalledChip = useMemo(() => {
    const newChips = filters?.lte_total_called
      ? [
        {
          displayValue: filters?.lte_total_called,
          value: filters?.lte_total_called,
          label: "Max Total Called",
        },
      ]
      : [];
    return newChips;
  }, [filters?.lte_total_called]);

  const frdAmountChip = useMemo(() => {
    const newChips = filters?.frd_amount
      ? [
        {
          displayValue: filters?.frd_amount,
          value: filters?.frd_amount,
          label: "Min FRD Amount",
        },
      ]
      : [];
    return newChips;
  }, [filters?.frd_amount]);

  const maxFrdAmountChip = useMemo(() => {
    const newChips = filters?.lte_frd_amount
      ? [
        {
          displayValue: filters?.lte_frd_amount,
          value: filters?.lte_frd_amount,
          label: "Max FRD Amount",
        },
      ]
      : [];
    return newChips;
  }, [filters?.lte_frd_amount]);

  const chipList = useMemo(() => ([
    (labelChip?.length > 0 ?
      {
        chip: labelChip,
        remove: (value) => {
          onDeselectAll();
          const newLabels = [...filters?.label_ids].filter(
            (item) => item !== value
          );
          updateFilters({ label_ids: newLabels });
        }
      } : null
    ),
    (accountTypeChip?.length > 0 ?
      {
        chip: accountTypeChip,
        remove: (value) => {
          onDeselectAll();
          const newAccountTypes = [...filters?.trading_account_ids].filter(
            (item) => item !== value
          );
          updateFilters({ trading_account_ids: newAccountTypes });
        }
      } : null
    ),
    (nonTradingAccountChip?.length > 0 ?
      {
        chip: nonTradingAccountChip,
        remove: (value) => {
          onDeselectAll();
          const newTradingAccounts = [...filters?.non_trading_account_ids].filter(
            (item) => item !== value
          );
          updateFilters({ non_trading_account_ids: newTradingAccounts });
        }
      } : null
    ),
    (onlineChip?.length > 0 ?
      {
        chip: onlineChip,
        remove: (value) => {
          onDeselectAll();
          const newValue = [...filters?.online].filter((item) => item !== value);
          updateFilters({ online: newValue });
        }
      } : null
    ),
    (iBApprovedChip?.length > 0 ?
      {
        chip: iBApprovedChip,
        remove: (value) => {
          onDeselectAll();
          const newValue = [...filters?.is_ib_approved].filter((item) => item !== value);
          updateFilters({ is_ib_approved : newValue });
        }
      } : null
    ),
    (deskChip?.length > 0 ?
      {
        chip: deskChip,
        remove: (value) => {
          onDeselectAll();
          const newDesks = [...filters?.desk_ids].filter((item) => item !== value);
          updateFilters({ desk_ids: newDesks });
        }
      } : null
    ),
    (balanceChip?.length > 0 ?
      {
        chip: balanceChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ balance: "" });
        }
      } : null
    ),
    (maxBalanceChip?.length > 0 ?
      {
        chip: maxBalanceChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ lte_balance: "" });
        }
      } : null
    ),
    (nonDesksChip?.length > 0 ?
      {
        chip: nonDesksChip,
        remove: (value) => {
          onDeselectAll();
          const newNonDesks = [...filters?.non_desk_ids].filter(
            (item) => item !== value
          );
          updateFilters({ non_desk_ids: newNonDesks });
        }
      } : null
    ),
    (affiliateChip?.length > 0 ?
      {
        chip: affiliateChip,
        remove: (value) => {
          onDeselectAll();
          const newAffiliate = [...filters?.affiliate_ids].filter(
            (item) => item !== value
          );
          updateFilters({ affiliate_ids: newAffiliate });
        }
      } : null
    ),
    (nonAffiliateChip?.length > 0 ?
      {
        chip: nonAffiliateChip,
        remove: (value) => {
          onDeselectAll();
          const newNonAffiliate = [...filters?.non_affiliate_ids].filter(
            (item) => item !== value
          );
          updateFilters({ non_affiliate_ids: newNonAffiliate });
        }
      } : null
    ),
    (ftdOwnerChip?.length > 0 ?
      {
        chip: ftdOwnerChip,
        remove: (value) => {
          onDeselectAll();
          const newFtdOwner = [...filters?.ftd_owner_ids].filter(
            (item) => item !== value
          );
          updateFilters({ ftd_owner_ids: newFtdOwner });
        }
      } : null
    ),
    (nonFtdOwnerChip?.length > 0 ?
      {
        chip: nonFtdOwnerChip,
        remove: (value) => {
          onDeselectAll();
          const newNonFtdOwner = [...filters?.non_ftd_owner_ids].filter(
            (item) => item !== value
          );
          updateFilters({ non_ftd_owner_ids: newNonFtdOwner });
        }
      } : null
    ),
    (brandChip?.length > 0 ?
      {
        chip: brandChip,
        remove: (value) => {
          onDeselectAll();
          const newBrands = [...filters?.internal_brand_ids].filter(
            (item) => item !== value
          );
          updateFilters({ internal_brand_ids: newBrands });
        }
      } : null
    ),
    (nonBrandChip?.length > 0 ?
      {
        chip: nonBrandChip,
        remove: (value) => {
          onDeselectAll();
          const newNonBrands = [...filters?.non_internal_brand_ids].filter(
            (item) => item !== value
          );
          updateFilters({ non_internal_brand_ids: newNonBrands });
        }
      } : null
    ),
    (nonLabelChip?.length > 0 ?
      {
        chip: nonLabelChip,
        remove: (value) => {
          onDeselectAll();
          const newLabels = [...filters?.non_label_ids].filter(
            (item) => item !== value
          );
          updateFilters({ non_label_ids: newLabels });
        }
      } : null
    ),
    (agentChip?.length > 0 ?
      {
        chip: agentChip,
        remove: (value) => {
          onDeselectAll();
          const newAgent = [...filters?.agent_ids].filter((item) => item !== value);
          updateFilters({ agent_ids: newAgent });
        }
      } : null
    ),
    (nonAgentChip?.length > 0 ?
      {
        chip: nonAgentChip,
        remove: (value) => {
          onDeselectAll();
          const newNonAgent = [...filters?.non_agent_ids].filter(
            (item) => item !== value
          );
          updateFilters({ non_agent_ids: newNonAgent });
        }
      } : null
    ),
    (teamChip?.length > 0 ?
      {
        chip: teamChip,
        remove: (value) => {
          onDeselectAll();
          const newTeams = [...filters?.team_ids].filter((item) => item !== value);
          updateFilters({ team_ids: newTeams });
        }
      } : null
    ),
    (nonTeamChip?.length > 0 ?
      {
        chip: nonTeamChip,
        remove: (value) => {
          onDeselectAll();
          const newNonTeams = [...filters?.non_team_ids].filter(
            (item) => item !== value
          );
          updateFilters({ non_team_ids: newNonTeams });
        }
      } : null
    ),
    (customFilterChip?.length > 0 ?
      {
        chip: customFilterChip,
        remove: (value) => {
          onDeselectAll();
          const newCustomFields = customFilters?.map((field) => {
            if (
              field?.filter &&
              field?.filter?.field_type === "number" &&
              `${field?.filter?.query?.gt}-${field?.filter?.query?.lt}` === value
            ) {
              return {
                ...field,
                filter: null,
              };
            } else if (field?.filter && field?.filter?.query === value) {
              return {
                ...field,
                filter: null,
              };
            } else if (
              field?.filter &&
              (field?.filter?.field_type === "multi_choice" ||
                field?.filter?.field_type === "multi_choice_radio") &&
              field?.filter?.query?.join(", ") === value
            ) {
              const data = {
                ...field,
                id: field?.filter?.field_id,
                field_type: field?.filter?.field_type,
                friendly_name: field?.label,
                setting: field?.setting,
                filter: {
                  ...field?.filter,
                  query: [],
                },
              };
              return {
                ...field,
                field_type: field?.filter?.field_type,
                filter: {
                  ...field?.filter,
                  query: [],
                },
                headerRender: () => {
                  return (
                    <CustomFilterMultiRadio
                      label={field?.label}
                      setting={field?.setting}
                      field={data}
                      onSetField={(val) => {
                        onSetCustomFilters(val);
                      }}
                    />
                  );
                },
              };
            } else {
              return field;
            }
          });
          updateFilters({});
          onSetCustomFilters(newCustomFields);
        }
      } : null
    ),
    (nonCustomFilterChip?.length > 0 ?
      {
        chip: nonCustomFilterChip,
        remove: (value) => {
          onDeselectAll();
          const newCustomFields = customFilters?.map((field) => {
            if (
              field?.filter &&
              (field?.filter?.field_type === "multi_choice" ||
                field?.filter?.field_type === "multi_choice_radio") &&
              field?.filter?.non_query?.join(", ") === value
            ) {
              const data = {
                ...field,
                id: field?.filter?.field_id,
                field_type: field?.filter?.field_type,
                friendly_name: field?.label,
                setting: field?.setting,
                filter: {
                  ...field?.filter,
                  non_query: [],
                },
              };
              return {
                ...field,
                field_type: field?.filter?.field_type,
                filter: {
                  ...field?.filter,
                  non_query: [],
                },
                headerRender: () => {
                  return (
                    <CustomFilterMultiRadio
                      label={field?.label}
                      setting={field?.setting}
                      field={data}
                      onSetField={(val) => {
                        onSetCustomFilters(val);
                      }}
                    />
                  );
                },
              };
            } else {
              return field;
            }
          });
          updateFilters({});
          onSetCustomFilters(newCustomFields);
        }
      } : null
    ),
    (firstAffiliateChip?.length > 0 ?
      {
        chip: firstAffiliateChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ first_affiliate_id: "" });
        }
      } : null
    ),
    (nonFirstAffiliateChip?.length > 0 ?
      {
        chip: nonFirstAffiliateChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ non_first_affiliate_id: "" });
        }
      } : null
    ),
    (lastAgentStartChip?.length > 0 ?
      {
        chip: lastAgentStartChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ last_assigned_agent_at_start: "" });
        }
      } : null
    ),
    (lastAgentEndChip?.length > 0 ?
      {
        chip: lastAgentEndChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ last_assigned_agent_at_end: "" });
        }
      } : null
    ),
    (lastCommunicationStartChip?.length > 0 ?
      {
        chip: lastCommunicationStartChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ last_communication_at_start: "" });
        }
      } : null
    ),
    (lastCommunicationEndChip?.length > 0 ?
      {
        chip: lastCommunicationEndChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ last_communication_at_end: "" });
        }
      } : null
    ),
    (firstStatusChangedAtStartChip?.length > 0 ?
      {
        chip: firstStatusChangedAtStartChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ first_status_changed_at_start: "" });
        }
      } : null
    ),
    (firstStatusChangedAtEndChip?.length > 0 ?
      {
        chip: firstStatusChangedAtEndChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ first_status_changed_at_end: "" });
        }
      } : null
    ),
    (lastStatusChangedAtStartChip?.length > 0 ?
      {
        chip: lastStatusChangedAtStartChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ last_status_changed_at_start: "" });
        }
      } : null
    ),
    (lastStatusChangedAtEndChip?.length > 0 ?
      {
        chip: lastStatusChangedAtEndChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ last_status_changed_at_end: "" });
        }
      } : null
    ),
    (lastTeamStartChip?.length > 0 ?
      {
        chip: lastTeamStartChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ last_assigned_team_at_start: "" });
        }
      } : null
    ),
    (lastTeamEndChip?.length > 0 ?
      {
        chip: lastTeamEndChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ last_assigned_team_at_end: "" });
        }
      } : null
    ),
    (lastDeskStartChip?.length > 0 ?
      {
        chip: lastDeskStartChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ last_assigned_desk_at_start: "" });
        }
      } : null
    ),
    (lastDeskEndChip?.length > 0 ?
      {
        chip: lastDeskEndChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ last_assigned_desk_at_end: "" });
        }
      } : null
    ),
    (createdStartDateChip?.length > 0 ?
      {
        chip: createdStartDateChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ created_at_start: "" });
        }
      } : null
    ),
    (createdEndDateChip?.length > 0 ?
      {
        chip: createdEndDateChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ created_at_end: "" });
        }
      } : null
    ),
    (lastOnlineStartChip?.length > 0 ?
      {
        chip: lastOnlineStartChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ last_online_start: "" });
        }
      } : null
    ),
    (lastOnlineEndChip?.length > 0 ?
      {
        chip: lastOnlineEndChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ last_online_end: "" });
        }
      } : null
    ),
    (lastLoginStartChip?.length > 0 ?
      {
        chip: lastLoginStartChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ last_login_start: "" });
        }
      } : null
    ),
    (lastLoginEndChip?.length > 0 ?
      {
        chip: lastLoginEndChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ last_login_end: "" });
        }
      } : null
    ),
    (lastTradeStartChip?.length > 0 ?
      {
        chip: lastTradeStartChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ last_trade_at_start: "" });
        }
      } : null
    ),
    (lastTradeEndChip?.length > 0 ?
      {
        chip: lastTradeEndChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ last_trade_at_end: "" });
        }
      } : null
    ),
    (lastLeadDateStartChip?.length > 0 ?
      {
        chip: lastLeadDateStartChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ last_lead_date_start: "" });
        }
      } : null
    ),
    (lastLeadDateEndChip?.length > 0 ?
      {
        chip: lastLeadDateEndChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ last_lead_date_end: "" });
        }
      } : null
    ),
    (ftdDateStartChip?.length > 0 ?
      {
        chip: ftdDateStartChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ ftd_date_start: "" });
        }
      } : null
    ),
    (ftdDateEndChip?.length > 0 ?
      {
        chip: ftdDateEndChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ ftd_date_end: "" });
        }
      } : null
    ),
    (statusChip?.length > 0 ?
      {
        chip: statusChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ status: "" });
        }
      } : null
    ),
    (nonStatusChip?.length > 0 ?
      {
        chip: nonStatusChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ non_status: "" });
        }
      } : null
    ),
    (countryChip?.length > 0 ?
      {
        chip: countryChip,
        remove: (value) => {
          onDeselectAll();
          const newCountry = [...filters?.countries].filter(
            (item) => item !== value
          );
          updateFilters({ countries: newCountry });
        }
      } : null
    ),
    (nonCountryChip?.length > 0 ?
      {
        chip: nonCountryChip,
        remove: (value) => {
          onDeselectAll();
          const newNonCountry = [...filters?.non_countries].filter(
            (item) => item !== value
          );
          updateFilters({ non_countries: newNonCountry });
        }
      } : null
    ),
    (emailChip?.length > 0 ?
      {
        chip: emailChip,
        remove: (value) => {
          onDeselectAll();
          const newDesks = [...filters?.email_ids].filter((item) => item !== value);
          updateFilters({ email_ids: newDesks });
        }
      } : null
    ),
    (nonEmailChip?.length > 0 ?
      {
        chip: nonEmailChip,
        remove: (value) => {
          onDeselectAll();
          const newDesks = [...filters?.non_email_ids].filter(
            (item) => item !== value
          );
          updateFilters({ non_email_ids: newDesks });
        }
      } : null
    ),
    (phoneChip?.length > 0 ?
      {
        chip: phoneChip,
        remove: (value) => {
          onDeselectAll();
          const newPhones = [...filters?.phone_ids].filter(
            (item) => item !== value
          );
          updateFilters({ phone_ids: newPhones });
        }
      } : null
    ),
    (nonPhoneChip?.length > 0 ?
      {
        chip: nonPhoneChip,
        remove: (value) => {
          onDeselectAll();
          const newPhones = [...filters?.non_phone_ids].filter(
            (item) => item !== value
          );
          updateFilters({ non_phone_ids: newPhones });
        }
      } : null
    ),
    (idsChip?.length > 0 ?
      {
        chip: idsChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ ids: "" });
        }
      } : null
    ),
    (nonIdsChip?.length > 0 ?
      {
        chip: nonIdsChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ non_ids: "" });
        }
      } : null
    ),
    (tronWalletChip?.length > 0 ?
      {
        chip: tronWalletChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ tron_wallet: "" });
        }
      } : null
    ),
    (ethereumWalletChip?.length > 0 ?
      {
        chip: ethereumWalletChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ ethereum_wallet: "" });
        }
      } : null
    ),
    (bitcoinWalletChip?.length > 0 ?
      {
        chip: bitcoinWalletChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ bitcoin_wallet: "" });
        }
      } : null
    ),
    (depositCountChip?.length > 0 ?
      {
        chip: depositCountChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ deposit_count: "" });
        }
      } : null
    ),  
    (maxDepositCountChip?.length > 0 ?  
      {
        chip: maxDepositCountChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ lte_deposit_count: "" });
        }
      } : null
    ),
    (firstDepositChip?.length > 0 ?
      {
        chip: firstDepositChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ first_deposit: "" });
        }
      } : null
    ),
    (maxFirstDepositChip?.length > 0 ?
      {
        chip: maxFirstDepositChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ lte_first_deposit: "" });
        }
      } : null
    ),
    (secondDepositChip?.length > 0 ?
      {
        chip: secondDepositChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ second_deposit: "" });
        }
      } : null
    ),
    (maxSecondDepositChip?.length > 0 ?
      {
        chip: maxSecondDepositChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ lte_second_deposit: "" });
        }
      } : null
    ),
    (thirdDepositChip?.length > 0 ?
      {
        chip: thirdDepositChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ third_deposit: "" });
        }
      } : null
    ),
    (maxThirdDepositChip?.length > 0 ?
      {
        chip: maxThirdDepositChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ lte_third_deposit: "" });
        }
      } : null
    ),
    (lastDepositChip?.length > 0 ?
      {
        chip: lastDepositChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ last_deposit: "" });
        }
      } : null
    ),
    (maxLastDepositChip?.length > 0 ?
      {
        chip: maxLastDepositChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ lte_last_deposit: "" });
        }
      } : null
    ),
    (totalDepositChip?.length > 0 ?
      {
        chip: totalDepositChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ total_deposit: "" });
        }
      } : null
    ),
    (maxTotalDepositChip?.length > 0 ?
      {
        chip: maxTotalDepositChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ lte_total_deposit: "" });
        }
      } : null
    ),
    (netDepositChip?.length > 0 ?
      {
        chip: netDepositChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ net_deposit: "" });
        }
      } : null
    ),
    (maxNetDepositChip?.length > 0 ?
      {
        chip: maxNetDepositChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ lte_net_deposit: "" });
        }
      } : null
    ),
    (firstDepositDateStartChip?.length > 0 ?
      {
        chip: firstDepositDateStartChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ first_deposit_date_start: "" });
        }
      } : null
    ),
    (firstDepositDateEndChip?.length > 0 ?
      {
        chip: firstDepositDateEndChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ first_deposit_date_end: "" });
        }
      } : null
    ),
    (secondDepositDateStartChip?.length > 0 ?
      {
        chip: secondDepositDateStartChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ second_deposit_date_start: "" });
        }
      } : null
    ),
    (secondDepositDateEndChip?.length > 0 ?
      {
        chip: secondDepositDateEndChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ second_deposit_date_end: "" });
        }
      } : null
    ),
    (thirdDepositDateStartChip?.length > 0 ?
      {
        chip: thirdDepositDateStartChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ third_deposit_date_start: "" });
        }
      } : null
    ),
    (thirdDepositDateEndChip?.length > 0 ?
      {
        chip: thirdDepositDateEndChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ third_deposit_date_end: "" });
        }
      } : null
    ),
    (lastDepositDateStartChip?.length > 0 ?
      {
        chip: lastDepositDateStartChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ last_deposit_date_start: "" });
        }
      } : null
    ),
    (lastDepositDateEndChip?.length > 0 ?
      {
        chip: lastDepositDateEndChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ last_deposit_date_end: "" });
        }
      } : null
    ),
    (firstDeskNameChip?.length > 0 ?
      {
        chip: firstDeskNameChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ first_desk_name: "" });
        }
      } : null
    ),
    (secondDeskNameChip?.length > 0 ?
      {
        chip: secondDeskNameChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ second_desk_name: "" });
        }
      } : null
    ),
    (thirdDeskNameChip?.length > 0 ?
      {
        chip: thirdDeskNameChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ third_desk_name: "" });
        }
      } : null
    ),
    (firstAssignedAgentIdChip?.length > 0 ?
      {
        chip: firstAssignedAgentIdChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ first_assigned_agent_id: "" });
        }
      } : null
    ),
    (firstAssignedAgentNameChip?.length > 0 ?
      {
        chip: firstAssignedAgentNameChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ first_assigned_agent_name: "" });
        }
      } : null
    ),
    (firstAssignedAgentAtStartChip?.length > 0 ?
      {
        chip: firstAssignedAgentAtStartChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ first_assigned_agent_at_start: "" });
        }
      } : null
    ),
    (firstAssignedAgentAtEndChip?.length > 0 ?
      {
        chip: firstAssignedAgentAtEndChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ first_assigned_agent_at_end: "" });
        }
      } : null
    ),
    (secondAssignedAgentIdChip?.length > 0 ?
      {
        chip: secondAssignedAgentIdChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ second_assigned_agent_id: "" });
        }
      } : null
    ),
    (secondAssignedAgentNameChip?.length > 0 ?
      {
        chip: secondAssignedAgentNameChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ second_assigned_agent_name: "" });
        }
      } : null
    ),
    (secondAssignedAgentAtStartChip?.length > 0 ?
      {
        chip: secondAssignedAgentAtStartChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ second_assigned_agent_at_start: "" });
        }
      } : null
    ),
    (secondAssignedAgentAtEndChip?.length > 0 ?
      {
        chip: secondAssignedAgentAtEndChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ second_assigned_agent_at_end: "" });
        }
      } : null
    ),
    (thirdAssignedAgentIdChip?.length > 0 ?
      {
        chip: thirdAssignedAgentIdChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ third_assigned_agent_id: "" });
        }
      } : null
    ),
    (thirdAssignedAgentNameChip?.length > 0 ?
      {
        chip: thirdAssignedAgentNameChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ third_assigned_agent_name: "" });
        }
      } : null
    ),
    (lastAssignedAgentIdChip?.length > 0 ?
      {
        chip: lastAssignedAgentIdChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ last_assigned_agent_id: "" });
        }
      } : null
    ),
    (lastAssignedAgentNameChip?.length > 0 ?
      {
        chip: lastAssignedAgentNameChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ last_assigned_agent_name: "" });
        }
      } : null
    ),
    (thirdAssignedAgentAtStartChip?.length > 0 ?
      {
        chip: thirdAssignedAgentAtStartChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ third_assigned_agent_at_start: "" });
        }
      } : null
    ),
    (thirdAssignedAgentAtEndChip?.length > 0 ?
      {
        chip: thirdAssignedAgentAtEndChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ third_assigned_agent_at_end: "" });
        }
      } : null
    ),
    (lastAssignedAgentAtStartChip?.length > 0 ?
      {
        chip: lastAssignedAgentAtStartChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ last_assigned_agent_at_start: "" });
        }
      } : null
    ),
    (lastAssignedAgentAtEndChip?.length > 0 ?
      {
        chip: lastAssignedAgentAtEndChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ last_assigned_agent_at_end: "" });
        }
      } : null
    ),
    (firstCallByChip?.length > 0 ?
      {
        chip: firstCallByChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ first_call_by: "" });
        }
      } : null
    ),
    (firstCallerNameChip?.length > 0 ?
      {
        chip: firstCallerNameChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ first_caller_name: "" });
        }
      } : null
    ),
    (kycIdStatusChip?.length > 0 ?
      {
        chip: kycIdStatusChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ kyc_id_status: "" });
        }
      } : null
    ),
    (kycBillingStatusChip?.length > 0 ?
      {
        chip: kycBillingStatusChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ kyc_billing_status: "" });
        }
      } : null
    ),
    (firstCallAtStartChip?.length > 0 ?
      {
        chip: firstCallAtStartChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ first_call_at_start: "" });
        }
      } : null
    ),
    (firstCallAtEndChip?.length > 0 ?
      {
        chip: firstCallAtEndChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ first_call_at_end: "" });
        }
      } : null
    ),
    (secondCallByChip?.length > 0 ?
      {
        chip: secondCallByChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ second_call_by: "" });
        }
      } : null
    ),
    (secondCallerNameChip?.length > 0 ?
      {
        chip: secondCallerNameChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ second_caller_name: "" });
        }
      } : null
    ),
    (secondCallAtStartChip?.length > 0 ?
      {
        chip: secondCallAtStartChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ second_call_at_start: "" });
        }
      } : null
    ),
    (secondCallAtEndChip?.length > 0 ?
      {
        chip: secondCallAtEndChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ second_call_at_end: "" });
        }
      } : null
    ),
    (thirdCallByChip?.length > 0 ?
      {
        chip: thirdCallByChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ third_call_by: "" });
        }
      } : null
    ),
    (thirdCallerNameChip?.length > 0 ?
      {
        chip: thirdCallerNameChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ third_caller_name: "" });
        }
      } : null
    ),
    (thirdCallAtStartChip?.length > 0 ?
      {
        chip: thirdCallAtStartChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ third_call_at_start: "" });
        }
      } : null
    ),
    (thirdCallAtEndChip?.length > 0 ?
      {
        chip: thirdCallAtEndChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ third_call_at_end: "" });
        }
      } : null
    ),
    (frdOwnerIdChip?.length > 0 ?
      {
        chip: frdOwnerIdChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ frd_owner_id: "" });
        }
      } : null
    ),
    (frdOwnerNameChip?.length > 0 ?
      {
        chip: frdOwnerNameChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ frd_owner_name: "" });
        }
      } : null
    ),
    (frdDateStartChip?.length > 0 ?
      {
        chip: frdDateStartChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ frd_date_start: "" });
        }
      } : null
    ),
    (frdDateEndChip?.length > 0 ?
      {
        chip: frdDateEndChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ frd_date_end: "" });
        }
      } : null
    ),
    (closePnlChip?.length > 0 ?
      {
        chip: closePnlChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ close_pnl: "" });
        }
      } : null
    ),
    (maxClosePnlChip?.length > 0 ?
      {
        chip: maxClosePnlChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ lte_close_pnl: "" });
        }
      } : null
    ),
    (firstLeadCampaignChip?.length > 0 ?
      {
        chip: firstLeadCampaignChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ first_lead_campaign: "" });
        }
      } : null
    ),
    (lastLeadCampaignChip?.length > 0 ?
      {
        chip: lastLeadCampaignChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ last_lead_campaign: "" });
        }
      } : null
    ),
    (frdAmountChip?.length > 0 ?
      {
        chip: frdAmountChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ frd_amount: "" });
        }
      } : null
    ),
    (maxFrdAmountChip?.length > 0 ?
      {
        chip: maxFrdAmountChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ lte_frd_amount: "" });
        }
      } : null
    ),
    (totalCalledChip?.length > 0 ?
      {
        chip: totalCalledChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ total_called: "" });
        }
      } : null
    ),
    (maxTotalCalledChip?.length > 0 ?
      {
        chip: maxTotalCalledChip,
        remove: () => {
          onDeselectAll();
          updateFilters({ lte_total_called: "" });
        }
      } : null
    ),
  ]),
    [filters,
      labelChip,
      onlineChip,
      accountTypeChip,
      nonTradingAccountChip,
      deskChip,
      balanceChip,
      maxBalanceChip,
      nonDesksChip,
      affiliateChip,
      nonAffiliateChip,
      ftdOwnerChip,
      nonFtdOwnerChip,
      brandChip,
      nonBrandChip,
      nonLabelChip,
      agentChip,
      nonAgentChip,
      teamChip,
      nonTeamChip,
      customFilterChip,
      nonCustomFilterChip,
      firstAffiliateChip,
      nonFirstAffiliateChip,
      lastAgentStartChip,
      lastAgentEndChip,
      lastCommunicationStartChip,
      lastCommunicationEndChip,
      lastTeamStartChip,
      lastTeamEndChip,
      lastDeskStartChip,
      lastDeskEndChip,
      createdStartDateChip,
      createdEndDateChip,
      lastOnlineStartChip,
      lastOnlineEndChip,
      lastLoginStartChip,
      lastLoginEndChip,
      lastTradeStartChip,
      lastTradeEndChip,
      lastLeadDateStartChip,
      lastLeadDateEndChip,
      ftdDateStartChip,
      ftdDateEndChip,
      statusChip,
      nonStatusChip,
      countryChip,
      nonCountryChip,
      emailChip,
      nonEmailChip,
      phoneChip,
      nonPhoneChip,
      idsChip,
      tronWalletChip,
      bitcoinWalletChip,
      depositCountChip,
      maxDepositCountChip,
      firstDepositChip,
      maxFirstDepositChip,
      secondDepositChip,
      maxSecondDepositChip,
      thirdDepositChip,
      maxThirdDepositChip,
      lastDepositChip,
      maxLastDepositChip,
      totalDepositChip,
      maxTotalDepositChip,
      firstDepositDateStartChip,
      firstDepositDateEndChip,
      secondDepositDateStartChip,
      secondDepositDateEndChip,
      thirdDepositDateStartChip,
      thirdDepositDateEndChip,
      lastDepositDateStartChip,
      lastDepositDateEndChip,
      firstDeskNameChip,
      secondDeskNameChip,
      thirdDeskNameChip,
      firstAssignedAgentIdChip,
      firstAssignedAgentNameChip,
      firstAssignedAgentAtStartChip,
      firstAssignedAgentAtEndChip,
      secondAssignedAgentIdChip,
      secondAssignedAgentNameChip,
      secondAssignedAgentAtStartChip,
      secondAssignedAgentAtEndChip,
      thirdAssignedAgentIdChip,
      thirdAssignedAgentNameChip,
      lastAssignedAgentIdChip,
      lastAssignedAgentNameChip,
      thirdAssignedAgentAtStartChip,
      thirdAssignedAgentAtEndChip,
      lastAssignedAgentAtStartChip,
      lastAssignedAgentAtEndChip,
      firstCallByChip,
      firstCallerNameChip,
      kycIdStatusChip,
      kycBillingStatusChip,
      firstCallAtStartChip,
      firstCallAtEndChip,
      secondCallByChip,
      secondCallerNameChip,
      secondCallAtStartChip,
      secondCallAtEndChip,
      thirdCallByChip,
      thirdCallerNameChip,
      thirdCallAtStartChip,
      thirdCallAtEndChip,
      frdOwnerIdChip,
      frdOwnerNameChip,
      frdDateStartChip,
      frdDateEndChip,
      closePnlChip,
      maxClosePnlChip,
      firstLeadCampaignChip,
      lastLeadCampaignChip,
      frdAmountChip,
      maxFrdAmountChip,
      maxTotalCalledChip,
      totalCalledChip,
    ]);

    return (
    ((hasFilter(commonFilters) || hasCustomFilter(customFilters)) && commonFilters?.is_ib_approved?.[0] !== 'false')  ?
      <>
        <Divider />
        <Stack
          alignItems="center"
          direction="row"
          flexWrap="wrap"
          gap={1}
          sx={{ p: 2, px: 3 }}
        >
          {currentSavedFilterName ? (
            <Typography>{currentSavedFilterName ?? ""}:</Typography>
          ) : null}

          {chipList?.map((item, index) => (
            <ChipSet
              key={index}
              chips={item?.chip}
              handleRemoveChip={item?.remove}
            />
          ))}
        </Stack>
      </>
      : null
  );
};

export const FilterChips = memo(_FilterChips);
