import { useCallback, useMemo, useState, useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import isEqual from "lodash.isequal";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

import FilterIcon from "src/icons/untitled-ui/duocolor/filter";
import { Iconify } from 'src/components/iconify';
import SettingIcon from "src/icons/untitled-ui/duocolor/setting";
import { CircularProgressWithLabel } from "src/components/loader-with-percentage";
import { FilterModal } from "src/components/filter-settings-modal";
import { defaultQuickIconRule, TableModal } from "src/components/table-settings-modal";
import { authApi } from "src/api/auth";
import { countries } from "src/utils/constant";
import { customersApi } from "src/api/customers";
import { exportToExcel } from "src/utils/export-excel";
import { hasCustomFilter, hasFilter } from "src/utils/function";
import { thunks } from "src/thunks/customers";
import { useAuth } from "src/hooks/use-auth";
import { userApi } from "src/api/user";
import { settingsApi } from "src/api/settings";

export const statuses = {
  1: "Open",
  2: "Pending",
  3: "Closed",
};

export const _CustomerTableToolbar = ({
  isLoading,
  onGetData,
  onSetCustomFilters,
  customFilters,
  query,
  selectAll,
  selected = [],
  setText,
  text,
  onSortingSet = () => { },
  onPinnedFieldsSet = () => { },
  sortingState = {},
  pinnedFields = [],
  columnSettings,

  defaultColumn,
  tableColumn,
  selectedFilterValue,
  setSelectedFilterValue,
  rule,
  setRule,
  searchSetting,
  setSearchSetting,
  renderCustomFilter,
  onInitCustomFields = () => { },
  selectFirstPerPage = null,
}) => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.customers.iBRequestsFilters);
  // eslint-disable-next-line no-unused-vars
  const { currentPage, perPage, ...currentFilters } = filters;
  const updateFilters = (data) => dispatch(thunks.setIBRequestsFilters(data));
  // Export slice
  const exportLoading = useSelector((state) => state.customers.isExporting);
  const progress = useSelector((state) => state.customers.exportProgress);
  const setExportLoading = (value) => dispatch(thunks.setIsExporting(value));
  const setProgress = (value) => dispatch(thunks.setExportProgress(value));

  const { user } = useAuth();

  const { refreshUser } = useAuth();

  const accountId = localStorage.getItem("account_id");

  const resetFilters = () => dispatch(thunks.resetIBRequestsFilter());

  const [tableModal, setTableModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);

  const currentFilter = useMemo(() => {
    if (searchSetting?.customer?.length && selectedFilterValue !== undefined) {
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

  const handleSortReset = async () => {

    onSortingSet({});
    const updateSetting = {
      ...columnSettings,
      ibRequestTable: rule,
      iBRequestsSorting: {},
    };
    await userApi.updateUser(accountId, {
      column_setting: JSON.stringify(updateSetting),
    });
    await refreshUser();
  }

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

  const syncCustomerFields = (fromModal, param) => {
    if (fromModal == "create") {
      const field = param;
      const modifiedParam = {
        ...param,
        render: (row) => {
          if (field?.field_type === "boolean") {
            if (row?.client_fields[field?.custom_id] === "true") {
              return (
                <CheckCircleOutlineIcon fontSize="small" color="success" />
              );
            } else {
              return null;
            }
          } else if (
            field?.field_type === "multi_choice" ||
            field?.field_type === "multi_choice_radio"
          ) {
            const setting = field?.setting ? JSON.parse(field?.setting) : [];
            const val = row?.client_fields[field?.custom_id];
            const color = setting.find((s) => s?.option?.trim() === val?.trim())?.color ?? 'primary.main';
            return (
              <Stack direction="row" alignItems="center" spacing={1}>
                {(color && val) ? (
                  <Box
                    sx={{
                      backgroundColor: color,
                      maxWidth: 1,
                      height: 1,
                      padding: 1,
                      borderRadius: 20,
                    }}
                  ></Box>
                ) : null}
                <Typography sx={{ whiteSpace: "nowrap" }}>{val}</Typography>
              </Stack>
            );
          }
          return (
            <Typography>{row?.client_fields[field?.custom_id]}</Typography>
          );
        },

        headerRender: () => renderCustomFilter(modifiedParam),
      };
      onSetCustomFilters((prev) => [...prev, modifiedParam]);
    } else if (fromModal == "edit") {
      const field = param;
      const modifiedParam = {
        ...param,
        render: (row) => {
          if (field?.field_type === "boolean") {
            if (row?.client_fields[field?.custom_id] === "true") {
              return (
                <CheckCircleOutlineIcon fontSize="small" color="success" />
              );
            } else {
              return null;
            }
          } else if (
            field?.field_type === "multi_choice" ||
            field?.field_type === "multi_choice_radio"
          ) {
            const setting = field?.setting ? JSON.parse(field?.setting) : [];
            const val = row?.client_fields[field?.custom_id];
            const color = setting.find((s) => s?.option?.trim() === val?.trim())?.color;
            return (
              <Stack direction="row" alignItems="center" spacing={1}>
                {(color && val) ? (
                  <Box
                    sx={{
                      backgroundColor: color,
                      maxWidth: 1,
                      height: 1,
                      padding: 1,
                      borderRadius: 20,
                    }}
                  ></Box>
                ) : null}
                <Typography sx={{ whiteSpace: "nowrap" }}>{val}</Typography>
              </Stack>
            );
          }
          return (
            <Typography>{row?.client_fields[field?.custom_id]}</Typography>
          );
        },
        headerRender: () => renderCustomFilter(field),
      };
      onSetCustomFilters((prev) =>
        prev?.map((item) => {
          if (item?.custom_id == modifiedParam?.custom_id) {
            return modifiedParam;
          } else return item;
        })
      );
    } else if (fromModal == 'delete') {
      onSetCustomFilters((prev) => prev?.filter((item) => item?.custom_id != param?.custom_id));
    }
  }

  const getUserInfo = async () => {
    try {
      const { account } = await authApi.me({ accountId });
      if (account?.search_setting) {
        setSearchSetting(account?.search_setting);
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    if (!filterModal) {
      getUserInfo();
    }
  }, [filterModal]);

  const enableBulkActions = selected.length > 0;

  const updateRule = async (rule, sortingState, pinned) => {
    setRule(rule);

    if (columnSettings) {
      const updateSetting = {
        ...columnSettings,
        iBRequestTable: rule,
        iBRequestsSorting: sortingState,
        pinnedFields: pinned,
      };
      await userApi.updateUser(accountId, {
        column_setting: JSON.stringify(updateSetting),
      });
      // setTableSetting(updateSetting);
      onSortingSet(sortingState);
    } else {
      const updatedTableSettings = {
        iBRequestTable: rule,
        iBRequestsSorting: sortingState,
        pinnedFields: pinned,
      };
      await userApi.updateUser(accountId, {
        column_setting: JSON.stringify(updatedTableSettings),
      });
      // setTableSetting(updatedTableSettings);
      onSortingSet(sortingState);
    }
  };

  const handleExport = useCallback(async () => {
    const dateNow = new Date();
    const exportDate = format(dateNow, "dd.mm.yyyy");
    const { data: excelData, params } = await handleMakeExcelData();

    if (rule?.length) {
      const filteredAndSortedFields = rule
        .filter((setting) => setting.enabled)
        .sort((a, b) => a.order - b.order)
        .map((setting) => setting.id);

      const modifiedArray = excelData?.map((obj) => {
        const modifiedObj = {};
        filteredAndSortedFields.forEach((field) => {
          const customFieldsNames = customFilters?.map((field) => field?.id);
          if (field === "email" && obj?.emails?.length) {
            modifiedObj["email"] = obj?.emails?.join(", ");
          } else if (field === "phone" && obj?.phone_numbers?.length) {
            modifiedObj["phone"] = obj?.phone_numbers?.join(", ");
          } else if (field === "desk_id") {
            modifiedObj["desk"] = obj?.desk_name;
          } else if (field === "name") {
            modifiedObj["name"] = obj["full_name"];
          } else if (field === "call_chat") {
          } else if (field === "last_online") {
            modifiedObj["last online"] = obj?.last_online ? format(new Date(obj?.last_online), "dd/MM/yyyy HH:mm:ss") : "";
          } else if (field === "created_at") {
            modifiedObj["created at"] = obj?.created_at ? format(new Date(obj?.created_at), "dd/MM/yyyy HH:mm:ss") : "";
          } else if (field === "last_login") {
            modifiedObj["last login"] = obj?.last_login ? format(new Date(obj?.last_login), "dd/MM/yyyy HH:mm:ss") : "";
          }
          else if (field === "last_message_at") {
            modifiedObj["last message at"] = obj?.last_message_at ? format(new Date(obj?.last_message_at), "dd/MM/yyyy HH:mm:ss") : "";
          }
          else if (field === "last_comunication") {
            modifiedObj["last communication at"] = obj?.last_comunication ? format(new Date(obj?.last_comunication), "dd/MM/yyyy HH:mm:ss") : "";
          }
          else if (field === "last_assigned_agent_at") {
            modifiedObj["last assigned agent at"] = obj?.last_assigned_agent_at ? format(new Date(obj?.last_assigned_agent_at), "dd/MM/yyyy HH:mm:ss") : "";
          }
          else if (field === "last_assigned_desk_at") {
            modifiedObj["last assigned desk at"] = obj?.last_assigned_desk_at ? format(new Date(obj?.last_assigned_desk_at), "dd/MM/yyyy HH:mm:ss") : "";
          }
          else if (field === "last_assigned_team_at") {
            modifiedObj["last assigned team at"] = obj?.last_assigned_team_at ? format(new Date(obj?.last_assigned_team_at), "dd/MM/yyyy HH:mm:ss") : "";
          }
          else if (field === "last_comment") {
            modifiedObj["last comment"] = obj?.last_comment_text ? `${obj?.last_comment_text}` : "No comment";
          }
          else if (field === "ftd_date") {
            modifiedObj["ftd date"] = obj?.ftd_date ? format(new Date(obj?.ftd_date), "dd/MM/yyyy HH:mm:ss") : "";
          }
          else if (field === "first_deposit_date") {
            modifiedObj["first deposit date"] = obj?.first_deposit_date ? format(new Date(obj?.first_deposit_date), "dd/MM/yyyy HH:mm:ss") : "";
          }
          else if (field === "second_deposit_date") {
            modifiedObj["second deposit date"] = obj?.second_deposit_date ? format(new Date(obj?.second_deposit_date), "dd/MM/yyyy HH:mm:ss") : "";
          }
          else if (field === "third_deposit_date") {
            modifiedObj["third deposit date"] = obj?.third_deposit_date ? format(new Date(obj?.third_deposit_date), "dd/MM/yyyy HH:mm:ss") : "";
          }
          else if (field === "last_lead_at") {
            modifiedObj["last lead at"] = obj?.last_lead_at ? format(new Date(obj?.last_lead_at), "dd/MM/yyyy HH:mm:ss") : "";
          }
          else if (field === "first_assigned_agent_at") {
            modifiedObj["first assigned agent at"] = obj?.first_assigned_agent_at ? format(new Date(obj?.first_assigned_agent_at), "dd/MM/yyyy HH:mm:ss") : "";
          }
          else if (field === "second_assigned_agent_at") {
            modifiedObj["second assigned agent at"] = obj?.second_assigned_agent_at ? format(new Date(obj?.second_assigned_agent_at), "dd/MM/yyyy HH:mm:ss") : "";
          }
          else if (field === "third_assigned_agent_at") {
            modifiedObj["third assigned agent at"] = obj?.third_assigned_agent_at ? format(new Date(obj?.third_assigned_agent_at), "dd/MM/yyyy HH:mm:ss") : "";
          }
          else if (field === "first_call_at") {
            modifiedObj["first call at"] =obj?.first_call_at ? format(new Date(obj?.first_call_at), "dd/MM/yyyy HH:mm:ss") : "";
          }
          else if (field === "second_call_at") {
            modifiedObj["second call at"] = obj?.second_call_at ? format(new Date(obj?.second_call_at), "dd/MM/yyyy HH:mm:ss") : "";
          }
          else if (field === "third_call_at") {
            modifiedObj["third call at"] = obj?.third_call_at ? format(new Date(obj?.third_call_at), "dd/MM/yyyy HH:mm:ss") : "";
          }
          else if (field === "frd_date") {
            modifiedObj["frd date"] = obj?.frd_date ? format(new Date(obj?.frd_date), "dd/MM/yyyy HH:mm:ss") : "";
          }
          else if (field === "local_time") {
            modifiedObj["local time"] = obj?.local_time;
          }
          else if (field === "last_lead_date") {
            modifiedObj["last lead date"] = obj?.last_lead_date ? format(new Date(obj?.last_lead_date), "dd/MM/yyyy HH:mm:ss") : "";
          }
          else if (field === "first_lead_campaign") {
            modifiedObj["first lead campaign"] = obj?.first_lead_campaign;
          }
          else if (field === "first_lead_description") {
            modifiedObj["first lead description"] = obj?.first_lead_description;
          }
          else if (field === "open_pnl") {
            modifiedObj["open pnl"] = obj?.open_pnl;
          }
          else if (field === "close_pnl") {
            modifiedObj["close pnl"] = obj?.close_pnl;
          }
          else if (field === "first_deposit") {
            modifiedObj["first deposit"] = obj?.first_deposit;
          }
          else if (field === "second_deposit") {
            modifiedObj["second deposit"] = obj?.second_deposit;
          }
          else if (field === "third_deposit") {
            modifiedObj["third deposit"] = obj?.third_deposit;
          }
          else if (field === "first_name") {
            modifiedObj["first name"] = obj?.first_name;
          }
          else if (field === "last_name") {
            modifiedObj["last name"] = obj?.last_name;
          }
          else if (field === "ftd_amount") {
            modifiedObj["ftd amount"] = obj?.ftd_amount;
          }
          else if (field === "ftd_owner_name") {
            modifiedObj["ftd owner"] = obj?.ftd_owner_name;
          }
          else if (field === "tron_wallet") {
            modifiedObj["tron wallet"] = obj?.tron_wallet;
          }
          else if (field === "bitcoin_wallet") {
            modifiedObj["bitcoin wallet"] = obj?.bitcoin_wallet;
          }
          else if (field === "total_deposit") {
            modifiedObj["total deposit"] = obj?.total_deposit;
          }
          else if (field === "last_trade_at") {
            modifiedObj["last trade at"] = obj?.last_trade_at ? format(new Date(obj?.last_trade_at), "dd/MM/yyyy HH:mm:ss") : "";
          }
          else if (field === "internal_brand_id") {
            modifiedObj["internal brand"] = obj?.internal_brand_name;
          } else if (field === "labels" && obj?.client_labels?.length) {
            modifiedObj["labels"] = obj?.client_labels
              ?.map((l) => l?.name)
              ?.join(", ");
          } else if (field === "affiliate_id") {
            modifiedObj["affiliates"] = obj?.affiliate_names?.join(", ");
          } else if (field === "status") {
            modifiedObj["status"] = statuses[obj?.status];
          } else if (field === "first_affiliate_id ") {
            modifiedObj["first affiliate"] = obj?.first_affiliate_name;
          } else if (field === "team" && obj?.client_teams?.length) {
            modifiedObj["team"] = obj?.client_teams
              ?.map((t) => t?.name)
              ?.join(", ");
          } else if (field === "agent" && obj?.client_agents?.length) {
            modifiedObj["agent"] = obj?.client_agents
              ?.map((a) => a?.name)
              ?.join(", ");
          } else if (
            customFieldsNames.includes(field) &&
            customFilters?.length &&
            obj?.client_fields
          ) {
            const customFieldObj = customFilters?.find((f) => f?.id === field);
            modifiedObj[field?.replace("_", " ")] = obj?.client_fields[customFieldObj?.custom_id];
          } else if (field === "country" && obj?.country) {
            modifiedObj["country"] = countries.find(
              (c) => c.code === obj?.country
            )?.label;
          } else {
            modifiedObj[field] = obj[field];
          }
        });
        return modifiedObj;
      });

      exportToExcel(modifiedArray, `customers-import-${exportDate}`);

      localStorage.setItem("last_beat_time", new Date().getTime());
      await settingsApi.updateMember(accountId, {
        last_beat: true,
        trigger: "export",
        export_filter_data: JSON.stringify(params),
        export_count: selectAll ? excelData?.length + "" : selected?.length ? selected?.length + "" : 0,
        export_table: "IB Request"
      });
    } else {
      if (excelData) exportToExcel(excelData, `customers-import-${exportDate}`);
      localStorage.setItem("last_beat_time", new Date().getTime());
      await settingsApi.updateMember(accountId, {
        last_beat: true,
        trigger: "export",
        export_filter_data: JSON.stringify(params),
        export_count: selectAll ? excelData?.length + "" : selected?.length ? selected?.length + "" : 0,
        export_table: "Position"
      });
    }
  }, [query, filters, rule, selected, customFilters, selectFirstPerPage]);

  const handleMakeExcelData = async () => {
    const timer = setInterval(() => {
      setProgress(progress >= 100 ? 0 : progress + 10);
    }, 800);

    try {
      setExportLoading(true);
      const data = [];

      const newParams = {
        page: filters?.currentPage + 1,
        per_page: 1000,
        q: query?.length > 0 ? query : null,
        client_ids: filters?.ids ? [filters?.ids] : undefined,
        ...filters,
      };
      delete newParams?.first_assigned_agent_name;
      delete newParams?.second_assigned_agent_name;
      delete newParams?.third_assigned_agent_name;
      delete newParams?.last_assigned_agent_name;
      delete newParams?.first_caller_name;
      delete newParams?.second_caller_name;
      delete newParams?.third_caller_name;
      delete newParams?.frd_owner_name;

      if (newParams?.online?.length > 1) {
        delete newParams?.online;
      }
      if (newParams?.online?.length === 1 && filters?.online[0] === "true") {
        newParams.online = "true";
      }
      if (newParams?.online?.length === 1 && filters?.online[0] === "false") {
        newParams.online = "false";
      }

      if (
        filters?.first_assigned_agent_name &&
        filters?.first_assigned_agent_name?.length > 0
      ) {
        newParams.first_assigned_agent_id = filters?.first_assigned_agent_name;
      }
      if (
        filters?.second_assigned_agent_name &&
        filters?.second_assigned_agent_name?.length > 0
      ) {
        newParams.second_assigned_agent_id =
          filters?.second_assigned_agent_name;
      }
      if (
        filters?.third_assigned_agent_name &&
        filters?.third_assigned_agent_name?.length > 0
      ) {
        newParams.third_assigned_agent_id = filters?.third_assigned_agent_name;
      }
      if (
        filters?.last_assigned_agent_name &&
        filters?.last_assigned_agent_name?.length > 0
      ) {
        newParams.last_assigned_agent_id = filters?.last_assigned_agent_name;
      }
      if (
        filters?.first_caller_name &&
        filters?.first_caller_name?.length > 0
      ) {
        newParams.first_call_by = filters?.first_caller_name;
      }
      if (
        filters?.second_caller_name &&
        filters?.second_caller_name?.length > 0
      ) {
        newParams.second_call_by = filters?.second_caller_name;
      }
      if (
        filters?.third_caller_name &&
        filters?.third_caller_name?.length > 0
      ) {
        newParams.third_call_by = filters?.third_caller_name;
      }
      if (filters?.frd_owner_name && filters?.frd_owner_name?.length > 0) {
        newParams.frd_owner_id = filters?.frd_owner_name;
      }
      if (
        filters?.created_at_start?.length &&
        filters?.created_at_end?.length
      ) {
        newParams.created_at_start = filters?.created_at_start;
        newParams.created_at_end = filters?.created_at_end;
      }
      const customFiltersData = customFilters
        ?.filter(
          (filter) =>
            filter?.filter &&
            (filter?.filter?.query?.length || filter?.filter?.non_query?.length)
        )
        ?.map((filter) => filter?.filter);
      newParams["custom_field"] = customFiltersData;
      if (!selectAll) {
        newParams["client_ids"] = selected;
      }
      const checkRes = await customersApi.getCustomers(newParams);

      const totalClients = selectFirstPerPage ? selectFirstPerPage : checkRes?.total_count;

      let allData = [];
      
      if (selectFirstPerPage && selectFirstPerPage > 1000) {
        const numPages = Math.ceil(selectFirstPerPage / 1000);
        
        for (let page = 1; page <= numPages; page++) {
          const newRes = await customersApi.getCustomers({
            ...newParams,
            page,
            per_page: 1000,
          });
          
          const dataIds = allData?.map(d => d?.id);
          allData.push(
            ...newRes?.clients?.filter((client) => !dataIds?.includes(client?.id))
          );
        }
        
        const totalFetched = allData.length;
        if (totalFetched > selectFirstPerPage) {
          allData = allData.slice(0, selectFirstPerPage);
        }
      } else {
        const perPage = totalClients < 1000 ? totalClients : 1000;
        const numPages = !selectAll ? 1 : Math.ceil(totalClients / perPage);
        
        for (let page = 1; page <= numPages; page++) {
          const newRes = await customersApi.getCustomers({
            ...newParams,
            page,
            per_page: perPage,
          });
          
          const dataIds = allData?.map(d => d?.id);
          allData.push(
            ...newRes?.clients?.filter((client) => !dataIds?.includes(client?.id))
          );
        }
      }

      data.push(...allData);

      setExportLoading(false);
      clearInterval(timer);

      return { data, params: newParams };
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("error: ", error);
      clearInterval(timer);
      setExportLoading(false);
    }
  };

  const isDefaultSetting = useMemo(() => {
    const idDefaults = defaultColumn?.map((item, index) => ({
      id: item?.id,
      enabled: item?.enabled,
      order: index,
    }));
    const compareRule = rule?.map((item) => ({
      id: item?.id,
      enabled: item?.enabled,
      order: item?.order,
    }));

    const settingSubEnabled =
      rule && rule?.length > 0
        ? rule.find((item) => item?.id === "call_chat")?.subEnabled
        : {};
    const isDefault =
      (isEqual(idDefaults, compareRule) &&
        isEqual(defaultQuickIconRule, settingSubEnabled)) ||
      rule?.length === 0;
    return isDefault;
  }, [defaultColumn, rule]);

  return (
    <>
      <Stack alignItems="center" direction="row" spacing={2} sx={{ p: 2 }}>
        <Iconify icon="lucide:search" color="text.secondary" width={24} />
        <Box sx={{ flexGrow: 1 }}>
          <Input
            disableUnderline
            fullWidth
            value={text}
            onChange={(event) => {
              setText(event?.target?.value);
            }}
            placeholder="Enter a keyword"
          />
        </Box>
        <Stack direction='row' gap={1} alignItems='center'>
          {isLoading && (
            <Iconify
              icon='svg-spinners:8-dots-rotate'
              width={24}
              sx={{ color: 'white' }}
            />
          )}
          <Tooltip title="Reload Table">
            <IconButton
              onClick={() => onGetData()}
              sx={{ '&:hover': { color: 'primary.main', transform: 'rotate(180deg)', }, transition: 'transform 0.3s' }}
            >
              <Iconify icon="ion:reload-sharp" width={24} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset Sort">
            <IconButton
              onClick={() => handleSortReset()}
              sx={{ '&:hover': { color: 'primary.main', transform: 'rotate(180deg)', }, transition: 'transform 0.3s' }}
            >
              <Iconify icon="hugeicons:arrow-reload-vertical" width={24} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Search Setting">
            <IconButton
              onClick={() => setFilterModal(true)}
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              {!((hasFilter(currentFilters) || hasCustomFilter(customFilters)) && currentFilters?.is_ib_approved?.[0] !== 'false') ? (
                <SvgIcon>
                  <FilterIcon />
                </SvgIcon>
              ) : (
                <Badge variant="dot" color="error">
                  <SvgIcon>
                    <FilterIcon />
                  </SvgIcon>
                </Badge>
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Table Setting">
            <IconButton onClick={() => setTableModal(true)} sx={{ '&:hover': { color: 'primary.main' } }}>
              {isDefaultSetting ? (
                <SvgIcon>
                  <SettingIcon />
                </SvgIcon>
              ) : (
                <Badge variant="dot" color="error">
                  <SvgIcon>
                    <SettingIcon />
                  </SvgIcon>
                </Badge>
              )}
            </IconButton>
          </Tooltip>
          {exportLoading ? (
            <CircularProgressWithLabel value={progress} />
          ) : enableBulkActions &&
            (user?.acc?.acc_v_customer_download === undefined ||
              user?.acc?.acc_v_customer_download) ? (
            <Tooltip title="Export selected">
              <IconButton
                onClick={() => {
                  handleExport();
                }}
                sx={{ '&:hover': { color: 'primary.main' } }}
              >
                <Iconify icon="line-md:downloading-loop" width={24} />
              </IconButton>
            </Tooltip>
          ) : null}
        </Stack>
      </Stack>
      <Divider />

      <TableModal
        open={tableModal}
        variant="customer"
        onClose={() => setTableModal(false)}
        tableColumn={tableColumn}
        defaultColumn={[...defaultColumn]}
        updateRule={updateRule}
        sorting={sortingState}
        pinnedFields={pinnedFields}
        onPinnedFieldsSet={onPinnedFieldsSet}
        syncCustomerFieldsDerived={syncCustomerFields}
        onInitCustomFields={onInitCustomFields}
      />

      <FilterModal
        variant="customer"
        open={filterModal}
        isFilter={(hasFilter(currentFilters) || hasCustomFilter(customFilters))}
        filterList={searchSetting.customer}
        currentValue={selectedFilterValue}
        onClose={() => setFilterModal(false)}
        filters={filters}
        customFields={customFilters}
        searchSetting={searchSetting}
        setSelectedValue={setSelectedFilterValue}
        accountId={accountId}
        getUserInfo={getUserInfo}
      />
    </>
  );
};

export const CustomerTableToolbar = memo(_CustomerTableToolbar);