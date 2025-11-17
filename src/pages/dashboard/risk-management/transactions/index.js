import { useEffect, useState, useMemo, useCallback } from "react";
import { format } from "date-fns";

import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import isEqual from "lodash.isequal";
import { useTranslation } from "react-i18next";
import { InfoOutlined } from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import FilterIcon from "src/icons/untitled-ui/duocolor/filter";
import { Iconify } from 'src/components/iconify';
import SettingIcon from "src/icons/untitled-ui/duocolor/setting";
import { ChipSet } from "src/components/customize/chipset";
import { CircularProgressWithLabel } from "src/components/loader-with-percentage";
import { DeleteModal } from "src/components/customize/delete-modal";
import { EditTransactionModal } from "src/sections/dashboard/customer/customer-transaction-edit";
import { FilterDateTime } from "src/components/customize/filter-date-time";
import { FilterInput } from "src/components/customize/filter-input";
import { FilterModal } from "src/components/filter-settings-modal";
import { FilterMultiSelect } from "src/components/customize/filter-multi-select";
import { FilterSelect } from "src/components/customize/filter-select";
import { MultiSelect } from "src/components/multi-select";
import { PageNumberSelect } from "src/components/pagination/page-selector";
import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { RouterLink } from "src/components/router-link";
import { Scrollbar } from "src/components/scrollbar";
import { Seo } from "src/components/seo";
import { SeverityPill } from "src/components/severity-pill";
import { TableModal } from "src/components/table-settings-modal";
import { TableNoData } from "src/components/table-empty";
import { TableSkeleton } from "src/components/table-skeleton";
import { authApi } from "src/api/auth";
import { countries, currencyFlagMap, currencyOption } from "src/utils/constant";
import { customersApi } from "src/api/customers";
import { exportToExcel } from "src/utils/export-excel";
import { paths } from "src/paths";
import { settingsApi } from "src/api/settings";
import { toast } from "react-hot-toast";
import { useAuth } from "src/hooks/use-auth";
import { useDebounce } from "src/hooks/use-debounce";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { useSelection } from "src/hooks/use-selection";
import { useGetCustomerDesks } from "src/api-swr/customer";
import { ClientFilterInput } from "src/components/customize/client-filter-input";
import { isValidJSON } from "src/utils/function";
import { brandsApi } from "src/api/lead-management/brand";
import { TransactionRequestModal } from "src/sections/dashboard/customer/customer-transaction-request-modal";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { customerFieldsApi } from "src/api/customer-fields";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { CustomFilterText } from "src/components/customize/custom-filter-text";
import { CustomFilterNumber } from "src/components/customize/custom-filter-number";
import { CustomFilterBoolean } from "src/components/customize/custom-filter-boolean";
import { CustomFilterMultiRadio } from "src/components/customize/custom-filter-multi-radio";
import { copyToClipboard } from "src/utils/copy-to-clipboard";
import { CreateTaskDialog } from "src/sections/dashboard/todo/todo-create-dialog";
import { useTimezone } from "src/hooks/use-timezone";

const statuses = {
  1: "Approved",
  2: "Pending",
  3: "Rejected",
  4: "Canceled",
};

export const statusList = [
  { label: "Approved", value: "1" },
  { label: "Pending", value: "2" },
  { label: "Rejected", value: "3" },
  { label: "Canceled", value: "4" },
];

const methodOption = [
  {
    label: "Deposit",
    value: "true",
  },
  {
    label: "Withdraw",
    value: "false",
  },
  {
    label: "Bonus",
    value: "bonus",
  },
  {
    label: "Credit In",
    value: "credit_in",
  },
  {
    label: "Credit Out",
    value: "credit_out",
  },
];

export const useInternalBrands = () => {
  const [internalBrandsList, setInternalBrandsList] = useState([]);
  const [internalBrandsInfo, setInternalBrandsInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const getBrands = async () => {
    try {
      setIsLoading(true);
      const res = await brandsApi.getInternalBrands();
      const brandsInfo = res?.internal_brands?.map((brand) => ({
        label: brand?.company_name,
        value: brand?.id,
      }));
      setInternalBrandsList(brandsInfo);
      setInternalBrandsInfo(res?.internal_brands);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  return { internalBrandsList, internalBrandsInfo, isLoading, getBrands };
};

export const useCustomerCustomFields = () => {
  const { user } = useAuth();
  const [customFields, setCustomFields] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const renderCustomHeader = (field) => {
    switch (field?.field_type) {
      case "text":
        return (
          <CustomFilterText
            label={field?.friendly_name}
            placeholder={field?.friendly_name}
            field={field}
            onSetField={(val) => {
              setCustomFields(val);
            }}
            fields={customFields}
          />
        );
      case "number":
        return (
          <CustomFilterNumber
            label={field?.friendly_name}
            placeholder={field?.friendly_name}
            field={field}
            onSetField={(val) => {
              setCustomFields(val);
            }}
          />
        );
      case "boolean":
        return (
          <CustomFilterBoolean
            label={field?.friendly_name}
            placeholder={field?.friendly_name}
            field={field}
            onSetField={(val) => {
              setCustomFields(val);
            }}
          />
        );
      case "multi_choice_radio":
        return (
          <CustomFilterMultiRadio
            label={field?.friendly_name}
            placeholder={field?.friendly_name}
            setting={field?.setting}
            field={field}
            onSetField={(val) => {
              setCustomFields(val);
            }}
          />
        );
      case "multi_choice":
        return (
          <CustomFilterMultiRadio
            label={field?.friendly_name}
            placeholder={field?.friendly_name}
            setting={field?.setting}
            field={field}
          onSetField={(val) => {
            setCustomFields(val);
          }}
          />
        );
      default:
        return (
          <CustomFilterText
            label={field?.friendly_name}
            placeholder={field?.friendly_name}
            field={field}
            onSetField={(val) => {
              setCustomFields(val);
            }}
          />
        );
    }
  };

  const handleGetcustomFileds = async () => {
    try {
      setIsLoading(true);
      const res = await customerFieldsApi.getCustomerFields();
      if (res?.client_fields?.length > 0) {

        const convertedCustomfields = res?.client_fields?.map((field, index) => {
          const accessKey = `acc_custom_v_${field?.value}`;
          const accessEditkey = `acc_custom_e_${field?.value}`;
          const viewAccess = user?.acc && user?.acc[accessKey];
          const editAccess = user?.acc && user?.acc[accessEditkey];

          if (viewAccess === undefined || viewAccess) {
            return {
              id: field?.value,
              label: field?.friendly_name,
              enabled: false,
              editAccess: (editAccess === undefined || editAccess),
              custom: true,
              custom_id: field?.id,
              setting: field?.setting,
              filter: null,
              field_type: field?.field_type,
              render: (row) => {
                if (field?.field_type === "boolean") {
                  if (row?.client_fields[field?.id] === "true") {
                    return (
                      <Stack direction='row' alignItems='center' gap={1}>
                        <CheckCircleOutlineIcon
                          fontSize="small"
                          color="success"
                          className="custom-field-value"
                          sx={{verticalAlign: 'sub'}}
                        />
                      </Stack>
                    )
                  } 
                } else if (field?.field_type === "multi_choice" || field?.field_type === "multi_choice_radio") {
                  const setting = field?.setting
                    ? JSON.parse(field?.setting)
                    : [];
                  const val = row?.client_fields[field?.id];
                  const color = setting.find((s) => s?.option?.trim() === val?.trim())?.color ?? 'primary.main';

                  return (
                    <Stack direction='row' alignItems='center' gap={1}>
                      <Stack 
                        key={index} 
                        direction="row" 
                        alignItems="center" 
                        spacing={1} 
                        className="custom-field-value"
                      >
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
                        {val?.length > 15 ? (
                          <Tooltip title={val}>
                            <Typography>{val?.substring(0, 15) + ".."}</Typography>
                          </Tooltip>
                        ) : (
                          <Typography sx={{ whiteSpace: "nowrap" }}>
                            {val}
                          </Typography>
                        )}
                      </Stack>
                    </Stack>
                  );
                }

                if (row?.client_fields[field?.id]?.length > 15) {
                  return (
                    <Stack direction="row" alignItems="center" gap={1}>
                      {row?.client_fields[field?.id] && (
                        <Link
                          color="text.primary"
                          component={RouterLink}
                          href={`${paths.dashboard.customers.index}/${row?.id}`}
                          sx={{
                            alignItems: "center",
                            display: "inline-flex",
                          }}
                          underline="hover"
                          gap={1}
                        >
                          <Tooltip
                            key={index}
                            title={row?.client_fields[field?.id]}
                            className="custom-field-value"
                          >
                            <Typography>
                              {row?.client_fields[field?.id]?.substring(0, 15) +
                                "..." ?? ""}
                            </Typography>
                          </Tooltip>
                        </Link>
                      )}
                    </Stack>
                  );
                } else {
                  return (
                    <Stack direction="row" alignItems="center" gap={1}>
                      {row?.client_fields[field?.id] && (
                        <Link
                          color="text.primary"
                          component={RouterLink}
                          href={`${paths.dashboard.customers.index}/${row?.id}`}
                          sx={{
                            alignItems: "center",
                            display: "inline-flex",
                          }}
                          underline="hover"
                          gap={1}
                        >
                          {row?.client_fields[field?.id] ?? ""}
                        </Link>
                      )}
                    </Stack>
                  );
                }
              },
              headerRender: () => renderCustomHeader(field),
            };
          }
        })
        setCustomFields(convertedCustomfields ?? []);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    handleGetcustomFileds();
  }, []);


  return {
    customFields,
    setCustomFields,
    isLoading,
  }
}

const Page = () => {
  usePageView();

  const { i18n } = useTranslation();
  const currentLang = i18n?.resolvedLanguage;

  const { internalBrandsInfo: brandsInfo, internalBrandsList: brandList } = useInternalBrands();
  const { customFields, setCustomFields } = useCustomerCustomFields();

  const [isLoading, setIsLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);
  const [createTicketDialogOpen, setCreateTicketDialogOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [deleteTransaction, setDeleteTransaction] = useState(null);

  const [totalCount, setTotalCount] = useState();
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [method, setMethod] = useState("");
  const { user, company } = useAuth();
  const { toLocalTime } = useTimezone();
  const [transactions, setTransactions] = useState([]);
  const [labelList, setLabelList] = useState([]);

  const transactionMethodOptions = useMemo(() => {
    if (!company?.trx_settings) return [];
    
    try {
      const parsedSettings = JSON.parse(company.trx_settings);
      return parsedSettings?.options?.map(method => ({
        label: method,
        value: method
      }));
    } catch (error) {
      console.error('Error parsing trx_settings:', error);
      return [];
    }
  }, [company?.trx_settings]);

  const [agentList, setAgentList] = useState([]);
  const [clientList, setClientList] = useState([]);
  const [tableModal, setTableModal] = useState(false);
  const [rule, setRule] = useState([]);
  const [searchSetting, setSearchSetting] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [requestInfo, setRequestInfo] = useState(undefined);
  const [docInfo, setDocInfo] = useState([]);
  const [webhookData, setWebhookData] = useState(undefined);
  const [webhookDialogOpen, setWebhookDialogOpen] = useState(false);

  const currentEnabledBrandCurrencies = useMemo(() => {
    const currentBrand = brandsInfo?.find((brand)=> brand.id == editTransaction?.internal_brand_id);

    if (!currentBrand?.available_currencies) {
      return [];
    }

    const availableCurrencies = Object.values(currentBrand?.available_currencies);
    const enabledCurrencies = currentBrand?.enabled_currencies
      ? JSON.parse(currentBrand?.enabled_currencies)
      : null;
  
    if (enabledCurrencies) {
      return availableCurrencies?.filter(currency => enabledCurrencies.includes(currency.key));
    }
  
    return availableCurrencies?.filter(currency => currency.default);
  }, [brandsInfo, editTransaction])

  const bankDetailList = useMemo(() => {
    const currentBrandBankDetail = brandsInfo?.find((brand)=> brand.id == editTransaction?.internal_brand_id)?.bank_details;
    if(currentBrandBankDetail) {
      const parsedDetail  = JSON.parse(currentBrandBankDetail);
      return parsedDetail;
    }
    return []
  }, [brandsInfo, editTransaction])

  const router = useRouter();
  useEffect(() => {
    if (user?.acc?.acc_v_risk_transactions === false) {
      router?.push(paths.notFound);
    }
  }, [user]);

  useEffect(() => {
    const riskTransactionsPerPage = localStorage.getItem("riskTransactionsPerPage");

    if (riskTransactionsPerPage) {
      setPerPage(riskTransactionsPerPage);
    }
  }, []);

  const [selectedFilterValue, setSelectedFilterValue] = useState("none");

  const localTableSetting = localStorage.getItem("tableSetting");
  const tableSetting = JSON.parse(localTableSetting);
  const accountId = localStorage.getItem("account_id");

  const [filterModal, setFilterModal] = useState(false);

  const [exportLoading, setExportLoading] = useState(false);
  const [progress, setProgress] = useState(10);

  const [text, setText] = useState("");
  const q = useDebounce(text, 300);
  const [filters, setFilters] = useState({});

  const updateFilters = (val) => setFilters((prev) => ({ ...prev, ...val }));

  const [transactionIds, setTransactionIds] = useState([]);
  const tableIds =
    useMemo(() => transactions?.map((item) => item?.id), [transactions]) ?? [];

  const transactionSelection = useSelection(transactionIds ?? [], (message) => {
    toast.error(message);
  });
  const enableBulkActions = transactionSelection.selected?.length > 0;

  const { deskList } = useGetCustomerDesks({}, user);

  const selectedPage = useMemo(
    () =>
      tableIds?.every((item) => transactionSelection.selected?.includes(item)),
    [tableIds, transactionSelection.selected]
  );

  const selectedSome = useMemo(
    () =>
      tableIds?.some((item) => transactionSelection.selected?.includes(item)) &&
      !tableIds?.every((item) => transactionSelection.selected?.includes(item)),
    [tableIds, tableIds, transactionSelection.selected]
  );

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

  const handleRemoveChip = (value, target) => {
    if (target === "credit") {
      const newCredit = [...filters?.credit].filter((item) => item !== value);
      updateFilters({ credit: newCredit });
    }
    if (target === "client_id") {
      const newArrays = [...filters?.client_ids].filter(
        (item) => item !== value
      );
      updateFilters({ client_ids: newArrays });
    }
    if (target === "label") {
      const newArrays = [...filters?.label_ids].filter(
        (item) => item !== value
      );
      updateFilters({
        label_ids: newArrays,
      });
    }
    if (target === "non_label") {
      const newArrays = [...filters?.non_label_ids].filter(
        (item) => item !== value
      );
      updateFilters({
        non_label_ids: newArrays,
      });
    }
    if (target === "desk") {
      const newArrays = [...filters?.desk_ids].filter(
        (item) => item !== value
      );
      updateFilters({
        desk_ids: newArrays,
      });
    }
    if (target === "non_desk") {
      const newArrays = [...filters?.non_desk_ids].filter(
        (item) => item !== value
      );
      updateFilters({
        non_desk_ids: newArrays,
      });
    }
    if (target === "owner") {
      const newOwner = [...filters?.account_ids].filter(
        (item) => item !== value
      );
      updateFilters({ account_ids: newOwner, currentPage: 0 });
    }
    if (target === "non_owner") {
      const newNonOwner = [...filters?.non_account_ids].filter(
        (item) => item !== value
      );
      updateFilters({ non_account_ids: newNonOwner, currentPage: 0 });
    }
  };

  const handleRemoveCustomFilterChip = useCallback((value) => {
      const newCustomFields = customFields?.map((field) => {
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
                    setCustomFields(val);
                  }}
                />
              );
            },
          };
        } else {
          return field;
        }
      });
      setCustomFields(newCustomFields);
  }, [customFields, setCustomFields]);

  const customFilterChip = useMemo(
    () =>
      customFields
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
    [customFields]
  );

  const transactionChip = useMemo(() => {
    const newChips =
      filters?.transaction_type && filters?.transaction_type !== "_empty"
        ? [
          {
            displayValue: transactionMethodOptions?.find((item) => item?.value === filters?.transaction_type)
              ?.label,
            value: filters?.transaction_type,
            label: "Transaction Method",
          },
        ]
        : [];
    return newChips;
  }, [filters?.transaction_type]);

  const internalBrandChip = useMemo(() => {
    return filters?.internal_brand_id ? [{
      displayValue: brandList?.find((item) => item?.value == filters?.internal_brand_id)?.label,
      value: filters?.internal_brand_id,
      label: "Internal Brand Name",
    }] : [];
  }, [filters?.internal_brand_id, brandList]);

  const ftdChip = useMemo(() => {
    return filters?.ftd ? [{
      displayValue: filters?.ftd === "true" ? "FTD" : "Non FTD",
      value: filters?.ftd,
      label: "FTD",
    }] : [];
  }, [filters?.ftd]);

  const statusChip = useMemo(() => {
    const newChips =
      filters?.status && filters?.status !== "_empty"
        ? [
          {
            displayValue: statusList?.find(
              (item) => item?.value === filters?.status
            )?.label,
            value: filters?.status,
            label: "Status",
          },
        ]
        : [];
    return newChips;
  }, [filters?.status, statusList]);



  const currencyChip = useMemo(() => {
    const newChips =
      filters?.currency && filters?.currency !== "_empty"
        ? [
          {
            displayValue: currencyOption?.find(
              (item) => item?.value === filters?.currency
            )?.name,
            value: filters?.currency,
            label: "Currency",
          },
        ]
        : [];
    return newChips;
  }, [filters?.currency, currencyOption]);

  const clientIdChip = useMemo(
    () =>
      filters?.client_ids?.map((value) => ({
        displayValue: clientList?.find((item) => item?.value == value)?.label,
        value: value,
        label: "Client Id",
      })),
    [filters?.client_ids, clientList]
  );

  const labelChip = useMemo(() => {
    return filters?.label_ids?.map((value) => ({
      displayValue: labelList?.find((item) => {
        return value == item?.value;
      })?.label,
      value: value,
      label: "Label",
    }));
  }, [filters?.label_ids, labelList]);

  const nonLabelChip = useMemo(
    () =>
      filters?.non_label_ids?.map((value) => ({
        displayValue: labelList?.find((item) => value === item?.value)?.label,
        value: value,
        label: "Exclude Label",
      })),
    [filters?.non_label_ids, labelList]
  );

  const deskChip = useMemo(() => {
    return filters?.desk_ids?.map((value) => ({
      displayValue: deskList?.find((item) => {
        return value == item?.value;
      })?.label,
      value: value,
      label: "Desk",
    }));
  }, [filters?.desk_ids, deskList]);

  const nonDeskChip = useMemo(
    () =>
      filters?.non_desk_ids?.map((value) => ({
        displayValue: deskList?.find((item) => value === item?.value)?.label,
        value: value,
        label: "Exclude Desk",
      })),
    [filters?.non_desk_ids, deskList]
  );

  const maxAmountChip = useMemo(() => {
    const newChips = filters?.amount
      ? [
        {
          displayValue: filters?.amount,
          value: filters?.amount,
          label: "Max Margin",
        },
      ]
      : [];
    return newChips;
  }, [filters?.amount]);

  const minAmountChip = useMemo(() => {
    const newChips = filters?.lte_amount
      ? [
        {
          displayValue: filters?.lte_amount,
          value: filters?.lte_amount,
          label: "Min Margin",
        },
      ]
      : [];
    return newChips;
  }, [filters?.lte_amount]);

  const createdStartChip = useMemo(() => {
    return dateChipVal(filters?.created_at_start, "Created At Start");
  }, [filters?.created_at_start]);

  const createdEndChip = useMemo(() => {
    return dateChipVal(filters?.created_at_end, "Created At End");
  }, [filters?.created_at_end]);

  const ownerChip = useMemo(
    () =>
      filters?.account_ids?.map((value) => ({
        displayValue: agentList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Owner",
      })),
    [filters?.account_ids, agentList]
  );

  const nonOwnerChip = useMemo(
    () =>
      filters?.non_account_ids?.map((value) => ({
        displayValue: agentList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Exclude Owner",
      })),
    [filters?.non_account_ids, agentList]
  );

  const creditChip = useMemo(() => {
    const newChips = filters?.credit?.map((item) => ({
      displayValue: item === "true" ? "Credit In" : "Credit Out",
      value: item,
      label: "Credit",
    }));
    return newChips;
  }, [filters?.credit]);

  const approvedAtStartChip = useMemo(() => {
    return dateChipVal(filters?.approved_at_start, "Approved At Start");
  }, [filters?.approved_at_start]);

  const approvedAtEndChip = useMemo(() => {
    return dateChipVal(filters?.approved_at_end, "Approved At End");
  }, [filters?.approved_at_end]);

  const idsChip = useMemo(() => {
    const newChips = filters?.ids
      ? [
        {
          displayValue: filters?.ids,
          value: filters?.ids,
          label: "ID",
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
          label: "Exclude ID",
        },
      ]
      : [];
    return newChips;
  }, [filters?.non_ids]);

  const actionTypeChip = useMemo(() => {
    if (!method) return [];

    const methodLabel = methodOption.find(opt => opt.value === method)?.label;
    
    return [{
      displayValue: methodLabel,
      value: method,
      label: "Action Type"
    }];
  }, [method]);

  const [descriptionDialogOpen, setDescriptionDialogOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");

  const [showInternal, setShowInternal] = useState(false);

  const DEFAULT_COLUMN = [
    {
      id: "id",
      label: "ID",
      enabled: true,
      render: (row) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Link
            color="text.primary"
            component={RouterLink}
            href={paths.dashboard.risk.transaction.replace(':transactionId', row?.id)}
            sx={{
              alignItems: "center",
              display: "inline-flex",
            }}
            underline="hover"
          >
            <Typography variant="subtitle2">{row?.id}</Typography>
          </Link>
          {row?.hidden ? (
            <SeverityPill color="info">hidden</SeverityPill>
          ) : null}
          <Tooltip title="View History">
            <IconButton
              onClick={() => {
                router.push(paths.dashboard.risk.history.replace(":target", "transaction").replace(":id", row?.id));
              }}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
              size="small"
            >
              <Iconify
                icon={`ic:baseline-history-toggle-off`}
                width={24}
              />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
      headerRender: () => (
        <FilterInput
          labelFont={14}
          label="ID"
          placeholder="ID..."
          filter={filters?.ids}
          setFilter={(val) => {
            updateFilters({ ids: val, currentPage: 0 });
          }}
          isExclude
          setExcludeFilter={(val) => {
            updateFilters({ non_ids: val, currentPage: 0 });
          }}
        />
      ),
      
    },
    {
      id: "client_id",
      label: "Client ID",
      enabled: false,
      render: (row) => (
        <Stack direction="row" gap={1} alignItems="center">
          <Link
            color="text.primary"
            component={RouterLink}
            href={`${paths.dashboard.customers.index}/${row?.client_id}`}
            sx={{
              alignItems: "center",
              display: "inline-flex",
            }}
            underline="hover"
            gap={1}
          >
            <Typography>{row?.client_id}</Typography>
          </Link>
        </Stack>
      ),
    },
    {
      id: "client",
      label: "Client",
      enabled: true,
      headerRender: () => (
        <ClientFilterInput 
          updateFilters={updateFilters}
        />
      ),
      render: (row) => (
        <Stack direction="row" gap={1} alignItems="center">
          <Iconify icon={`circle-flags:${row?.client_country?.toLowerCase()}`} width={24} />
          <Link
            color="text.primary"
            component={RouterLink}
            href={`${paths.dashboard.customers.index}/${row?.client_id}`}
            sx={{
              alignItems: "center",
              display: "inline-flex",
            }}
            underline="hover"
            gap={1}
          >
            <Typography>{row?.full_name}</Typography>
          </Link>
        </Stack>
      ),
    },
    {
      id: "client_country",
      label: "Client Country",
      enabled: true,
      render: (row) => (
        <Stack direction="row" gap={1} alignItems="center">
          <Iconify icon={`circle-flags:${row?.client_country?.toLowerCase()}`} width={24} />
          <Typography variant="subtitle2">
            {countries.find((c) => c.code === row?.client_country)?.label}
          </Typography>
        </Stack>
      ),
    },
    {
      id: "email",
      label: "Email",
      width: 200,
      enabled: true,
      render: (row) => (
        <Stack direction="row" gap={1} alignItems="center">
          <Typography variant="subtitle2">
            {row?.emails?.length > 0 ? row?.emails?.slice(0, 2)?.map((item) => item)
              ?.join(", ") : ""}
          </Typography>
        </Stack>
      ),
    },
    {
      id: "desk_id",
      label: "Desk",
      enabled: true,
      headerRender: () => (
        <FilterMultiSelect
          label="DESK"
          withSearch
          placeholder="Desk..."
          options={deskList ?? []}
          onChange={(val) => {
            updateFilters({ desk_ids: val });
          }}
          value={filters?.desk_ids}
          isExclude
          onChangeNon={(val) => {
            updateFilters({ non_desk_ids: val });
          }}
          valueNon={filters?.non_desk_ids}
        />
      ),
      render: (row) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          {row?.desk_color ? (
            <Box
              sx={{
                backgroundColor: row?.desk_color,
                maxWidth: 1,
                height: 1,
                padding: 1,
                borderRadius: 20,
              }}
            ></Box>
          ) : null}
          <Typography>{row?.desk_name}</Typography>
        </Stack>
      ),
    },
    {
      id: "status",
      label: "Status",
      enabled: true,
      headerRender: () => (
        <FilterSelect
          label="STATUS"
          options={statusList ?? []}
          setValue={(val) => {
            updateFilters({ status: val });
          }}
          value={filters?.status}
        />
      ),
      render: (row) => (
        <SeverityPill
          color={
            row?.status === 1
              ? "success"
              : row?.status === 2
                ? "warning"
                : row?.status === 3
                  ? "error"
                  : "info"
          }
        >
          {statuses[row?.status]}
        </SeverityPill>
      ),
    },
    {
      id: "transaction_type",
      label: "Transaction Method",
      enabled: true,
      headerRender: () => (
        <FilterSelect
          label="TRANSACTION METHOD"
          options={transactionMethodOptions ?? []}
          setValue={(val) => {
            updateFilters({ transaction_type: val, currentPage: 0 });
          }}
          value={filters?.transaction_type}
        />
      ),
    },
    {
      id: "owners",
      label: "Owners",
      enabled: true,
      headerRender: () => (
        <FilterMultiSelect
          label="OWNERS"
          withSearch
          placeholder="Owners..."
          options={agentList ?? []}
          onChange={(val) => {
            updateFilters({ account_ids: val, currentPage: 0 });
          }}
          value={filters?.account_ids}
          isExclude
          onChangeNon={(val) => {
            updateFilters({ non_account_ids: val, currentPage: 0 });
          }}
          valueNon={filters?.non_account_ids}
        />
      ),
      render: (row) =>
        row?.t_transaction_account_names?.map((name, index) => (
        <Link
          key={name + index}
          color="text.primary"
          component={RouterLink}
          target="_blank"
          href={paths.dashboard.members.access.replace(
            ":memberId",
            row?.t_transaction_account_ids?.[index]
          )}
          sx={{
            alignItems: "center",
            display: "inline-flex",
            ml: 1,
          }}
          underline="hover"
        >
          <Typography variant="subtitle2">{name}</Typography>
        </Link>
      )),
    },
    {
      id: "currency",
      label: "Currency",
      enabled: true,
      headerRender: () => (
        <FilterSelect
          label="CURRENCY"
          options={currencyOption?.map((item)=> ({
            label: item?.name,
            value: item?.value,
          })) ?? []}
          setValue={(val) => {
            updateFilters({ currency: val });
          }}
          value={filters?.currency}
        />
      ),
      render: (row) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon={row?.currency ? currencyFlagMap[row?.currency] : currencyFlagMap[1]} width={24}/>
          <Typography variant="subtitle2">
            {row?.currency ? currencyOption?.find((currency) => currency?.value === row?.currency)?.name : "USD"}
          </Typography>
        </Stack>
      ),
    },
    {
      id: "provider",
      label: "Provider",
      enabled: true,
      render: (row) => {
        let provider = { };

        if (isValidJSON(row?.provider)) {
          const parsedForm = JSON.parse(row?.provider);
          provider = {...parsedForm};
        } else {
          provider.en = row?.provider;
        }

        return (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle2">
              {provider?.[currentLang]?.length > 0 ? provider?.[currentLang] : provider?.en ?? ""}
            </Typography>
          </Stack>
        );
      },
    },
    {
      id: "amount",
      label: "Margin",
      enabled: true,
      headerRender: () => (
        <FilterInput
          label="Margin"
          type="number"
          placeholder="Max Margin..."
          filter={filters?.amount}
          setFilter={(val) => {
            updateFilters({ amount: val });
          }}
          isRange
          placeholder2="Min Margin..."
          filter2={filters?.lte_amount}
          setFilter2={(val) => {
            updateFilters({ lte_amount: val });
          }}
        />
      ),
      render: (row) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle2">{row?.converted_amount ?? row?.amount ?? ""}</Typography>
        </Stack>
      )
    },
    {
      id: "labels",
      label: "Labels",
      enabled: true,
      headerRender: () => (
        <FilterMultiSelect
          label="LABELS"
          withSearch
          placeholder="Label..."
          options={labelList ?? []}
          value={filters.label_ids}
          onChange={(val) => {
            updateFilters({ label_ids: val });
          }}
          isExclude
          valueNon={filters.non_label_ids}
          onChangeNon={(val) => {
            updateFilters({ non_label_ids: val });
          }}
        />
      ),
      render: (row) => {
        return (
          <Stack gap={1} direction="row">
            {row?.t_transaction_status_status?.map((status) => (
              <Chip key={status} label={status} size="small" color="primary" />
            ))}
          </Stack>
        );
      },
    },
    {
      id: "action_type",
      label: "Action Type",
      enabled: true,
      headerRender: () => (
        <FilterSelect
          label="ACTION TYPE"
          options={methodOption ?? []}
          setValue={(val) => {
            setMethod(val);
            setCurrentPage(0);
          }}
          value={method}
        />
      ),
      render: (row) =>
        row?.bonus ? "Bonus" : row?.deposit && row?.credit ? "Credit In" : !row?.deposit && row?.credit ? "Credit Out" : row?.deposit && !row?.credit ? "Deposit" : "Withdraw",
    },
    {
      id: "request_data",
      label: "Request Data",
      enabled: true,
      render: (row) => {
        const requestData = row?.request_data
          ? JSON.parse(row.request_data)
          : null;
        if (requestData) {
          return (
            <Stack direction="row" alignItems="center" spacing={1}>
              {requestData ? (
                <Stack direction="row" alignItems="center" gap={1}>
                  <InfoOutlined fontSize="medium" />
                  <Typography
                    onClick={() => {
                      setRequestInfo(requestData);
                      setDocInfo(row?.transaction_docs_with_names??[]);
                      setShowModal(true);
                    }}
                    variant="subtitle2"
                    sx={{
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      ":hover": { textDecoration: "underline" },
                    }}
                  >
                    See Detail
                  </Typography>
                </Stack>
              ) : null}
            </Stack>
          );
        }
      },
    },
    {
      id: "description",
      label: "Description",
      enabled: true,
      render: (row) =>
        row?.description ? (
          <Tooltip title={(
            <Stack>
              <Typography variant="subtitle2">{row?.description}</Typography>
            </Stack>
          )}>
            <Stack direction="row" alignItems="center" gap={1}>
              <InfoOutlined fontSize="medium" />
              <Typography
                variant="subtitle2"
                sx={{
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  ":hover": { textDecoration: "underline" },
                }}
                onClick={() => {
                  setSelectedDescription(row?.description);
                  setDescriptionDialogOpen(true);
                }}
              >
                See Description
              </Typography>
            </Stack>
          </Tooltip>
        ) : null,
    },
    {
      id: "credit",
      label: "Credit",
      enabled: true,
      headerRender: () => (
        <MultiSelect
          noPadding
          label="CREDIT"
          options={[
            { label: "Credit In", value: "true" },
            { label: "Credit Out", value: "false" },
          ]}
          onChange={(val) => {
            updateFilters({ credit: val, currentPage: 0 });
          }}
          value={filters?.credit}
        />
      ),
      render: (row) =>
        row?.credit && row?.deposit ? (
          <SeverityPill color="success">Credit</SeverityPill>
        ) : row?.credit && !row?.deposit ? (
          <SeverityPill color="error">Credit</SeverityPill>
        ) : null,
    },
    {
      id: "approved_at",
      label: "Approved At",
      enabled: true,
      headerRender: () => (
        <FilterDateTime
          label="APPROVED AT"
          isRange
          subLabel1="Start"
          subLabel2="End"
          filter={filters?.approved_at_start}
          setFilter={(val) => {
            updateFilters({ approved_at_start: val });
          }}
          filter2={filters?.approved_at_end}
          setFilter2={(val) => {
            updateFilters({ approved_at_end: val });
          }}
        />
      ),
      render: (row) => (
        <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
          {toLocalTime(row?.approved_at)}
        </Typography>
      ),
    },
    {
      id: "created_at",
      label: "Created Date",
      enabled: true,
      headerRender: () => (
        <FilterDateTime
          label="CREATED TIME"
          isRange
          subLabel1="Start"
          subLabel2="End"
          filter={filters?.created_at_start}
          setFilter={(val) => {
            updateFilters({ created_at_start: val });
          }}
          filter2={filters?.created_at_end}
          setFilter2={(val) => {
            updateFilters({ created_at_end: val });
          }}
        />  
      ),
      render: (row) => (
        <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
          {toLocalTime(row?.created_at)}
        </Typography>
      ),
    },
    {
      id: "error_code",
      label: "Error Code",
      enabled: true,
      render: (row) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            {row?.error_code ? `${row?.error_code?.slice(0,20)}...` : ""}
          </Typography>
          {row?.error_code && (
            <Tooltip title="Copy error code">
              <IconButton edge="end" onClick={() => copyToClipboard(row?.error_code)}>
                <Iconify icon="mdi:content-copy" color="primary.main" width={20}/>
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      ),
    },
    {
      id: "m_id ",
      label: "M ID",
      enabled: false,
      render: (row) => (row?.m_id ? row?.m_id : ""),
    },
    {
      id: "usd_converted ",
      label: "USD Converted",
      enabled: false,
      render: (row) => (row?.usd_converted ? row?.usd_converted : ""),
    },
    {
      id: "internal_brand_id",
      label: "Internal Brand Name",
      enabled: true,
      headerRender: () => (
        <FilterSelect
          label="INTERNAL BRAND NAME"
          options={brandList ?? []}
          setValue={(val) => {
            updateFilters({ internal_brand_id: val });
          }}
          value={filters?.internal_brand_id}
        />
      ),
      render: (row) => {
        const brand = brandList?.find((brand) => brand?.value == row?.internal_brand_id);
        return (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle2">{brand?.label ?? ""}</Typography>
          </Stack>
        );
      }
    },
    {
      id: "ftd",
      label: "FTD",
      enabled: true,
      headerRender: () => (
        <FilterSelect
          label="FTD"
          options={[
            {
              label: "FTD",
              value: "true",
            },
            {
              label: "Non FTD",
              value: "false",
            }
          ]}
          setValue={(val) => {
            updateFilters({ ftd: val });
          }}
          value={filters?.ftd}
        />
      ),
      render: (row) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon={row?.ftd ? "mdi:check-circle-outline" : "mdi:close-circle-outline"} color={row?.ftd ? "success.main" : "error.main"} width={24} />
        </Stack>
      )
    },
    ...(user?.acc?.acc_v_external_transaction_id === undefined || user?.acc?.acc_v_external_transaction_id ? [{
      id: "external_transaction_id",
      label: "External Transaction ID",
      enabled: false,
      render: (row) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle2">
            {row?.external_transaction_id || ""}
          </Typography>
          {row?.external_transaction_id && (
            <Tooltip title="Copy external transaction ID">
              <IconButton edge="end" onClick={() => copyToClipboard(row?.external_transaction_id)}>
                <Iconify icon="mdi:content-copy" color="primary.main" width={20}/>
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      ),
    }] : []),
    ...(user?.acc?.acc_v_external_brand !== false ? [{
      id: "external_brand",
      label: "External Brand",
      enabled: false,
      render: (row) => (
        <Typography variant="subtitle2">
          {row?.external_brand || ""}
        </Typography>
      ),
    }] : []),
    ...(user?.acc?.acc_v_external_user_id !== false ? [{
      id: "external_user_id",
      label: "External User ID",
      enabled: false,
      render: (row) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle2">
            {row?.external_user_id || ""}
          </Typography>
          {row?.external_user_id && (
            <Tooltip title="Copy external user ID">
              <IconButton edge="end" onClick={() => copyToClipboard(row?.external_user_id)}>
                <Iconify icon="mdi:content-copy" color="primary.main" width={20}/>
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      ),
    }] : []),
    ...(user?.acc?.acc_v_payment_method !== false ? [{
      id: "payment_method",
      label: "Payment Method",
      enabled: false,
      render: (row) => (
        <Typography variant="subtitle2">
          {row?.payment_method || ""}
        </Typography>
      ),
    }] : []),
    ...(user?.acc?.acc_v_payment_method_code !== false ? [{
      id: "payment_method_code",
      label: "Payment Method Code",
      enabled: false,
      render: (row) => (
        <Typography variant="subtitle2">
          {row?.payment_method_code || ""}
        </Typography>
      ),
    }] : []),
    ...(user?.acc?.acc_v_processing_status !== false ? [{
      id: "processing_status",
      label: "Processing Status",
      enabled: false,
      render: (row) => (
        <Typography variant="subtitle2">
          {row?.processing_status || ""}
        </Typography>
      ),
    }] : []),
    ...(user?.acc?.acc_v_failure_reason !== false ? [{
      id: "failure_reason",
      label: "Failure Reason",
      enabled: false,
      render: (row) => (
        <Typography variant="subtitle2">
          {row?.failure_reason || ""}
        </Typography>
      ),
    }] : []),
    ...(user?.acc?.acc_v_real_balance_before !== false ? [{
      id: "real_balance_before",
      label: "Real Balance Before",
      enabled: false,
      render: (row) => (
        <Typography variant="subtitle2">
          {row?.real_balance_before || ""}
        </Typography>
      ),
    }] : []),
    ...(user?.acc?.acc_v_real_balance_after !== false ? [{
      id: "real_balance_after",
      label: "Real Balance After",
      enabled: false,
      render: (row) => (
        <Typography variant="subtitle2">
          {row?.real_balance_after || ""}
        </Typography>
      ),
    }] : []),
    ...(user?.acc?.acc_v_bonus_balance_before !== false ? [{
      id: "bonus_balance_before",
      label: "Bonus Balance Before",
      enabled: false,
      render: (row) => (
        <Typography variant="subtitle2">
          {row?.bonus_balance_before || ""}
        </Typography>
      ),
    }] : []),
    ...(user?.acc?.acc_v_bonus_balance_after !== false ? [{
      id: "bonus_balance_after",
      label: "Bonus Balance After",
      enabled: false,
      render: (row) => (
        <Typography variant="subtitle2">
          {row?.bonus_balance_after || ""}
        </Typography>
      ),
    }] : []),
    ...(user?.acc?.acc_v_bonus_code !== false ? [{
      id: "bonus_code",
      label: "Bonus Code",
      enabled: false,
      render: (row) => (
        <Typography variant="subtitle2">
          {row?.bonus_code || ""}
        </Typography>
      ),
    }] : []),
    ...(user?.acc?.acc_v_bonus_type !== false ? [{
      id: "bonus_type",
      label: "Bonus Type",
      enabled: false,
      render: (row) => (
        <Typography variant="subtitle2">
          {row?.bonus_type || ""}
        </Typography>
      ),
    }] : []),
    ...(user?.acc?.acc_v_bonus_release_amount !== false ? [{
      id: "bonus_release_amount",
      label: "Bonus Release Amount",
      enabled: false,
      render: (row) => (
        <Typography variant="subtitle2">
          {row?.bonus_release_amount || ""}
        </Typography>
      ),
    }] : []),
    ...(user?.acc?.acc_v_bonus_cancel_reason !== false ? [{
      id: "bonus_cancel_reason",
      label: "Bonus Cancel Reason",
      enabled: false,
      render: (row) => (
        <Typography variant="subtitle2">
          {row?.bonus_cancel_reason || ""}
        </Typography>
      ),
    }] : []),
    ...(user?.acc?.acc_v_total_pending_withdrawals_count !== false ? [{
      id: "total_pending_withdrawals_count",
      label: "Total Pending Withdrawals Count",
      enabled: false,
      render: (row) => (
        <Typography variant="subtitle2">
          {row?.total_pending_withdrawals_count || ""}
        </Typography>
      ),
    }] : []),
    ...(user?.acc?.acc_v_total_pending_withdrawals_amount !== false ? [{
      id: "total_pending_withdrawals_amount",
      label: "Total Pending Withdrawals Amount",
      enabled: false,
      render: (row) => (
        <Typography variant="subtitle2">
          {row?.total_pending_withdrawals_amount || ""}
        </Typography>
      ),
    }] : []),
    ...(user?.acc?.acc_v_user_net_deposits !== false ? [{
      id: "user_net_deposits",
      label: "User Net Deposits",
      enabled: false,
      render: (row) => (
        <Typography variant="subtitle2">
          {row?.user_net_deposits || ""}
        </Typography>
      ),
    }] : []),
    ...(user?.acc?.acc_v_is_first_deposit !== false ? [{
      id: "is_first_deposit",
      label: "Is First Deposit",
      enabled: false,
      render: (row) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon={row?.is_first_deposit ? "mdi:check-circle-outline" : "mdi:close-circle-outline"} color={row?.is_first_deposit ? "success.main" : "error.main"} width={24} />
        </Stack>
      ),
    }] : []),
    ...(user?.acc?.acc_v_webhook_data !== false ? [{
      id: "webhook_data",
      label: "Webhook Data",
      enabled: false,
      render: (row) => {
        if (!row?.webhook_data) return null;
        const webhookData = typeof row.webhook_data === 'string' ? JSON.parse(row.webhook_data) : row.webhook_data;
        return (
          <Stack direction="row" alignItems="center" spacing={1}>
            <InfoOutlined fontSize="medium" />
            <Typography
              onClick={() => {
                setWebhookData(webhookData);
                setWebhookDialogOpen(true);
              }}
              variant="subtitle2"
              sx={{
                cursor: "pointer",
                whiteSpace: "nowrap",
                ":hover": { textDecoration: "underline" },
              }}
            >
              See Detail
            </Typography>
          </Stack>
        );
      },
    }] : []),
    ...(user?.acc?.acc_v_event_date !== false ? [{
      id: "event_date",
      label: "Event Date",
      enabled: false,
      render: (row) => (
        <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
          {row?.event_date ? toLocalTime(row?.event_date) : ""} 
        </Typography>
      ),
    }] : []),
    ...(user?.acc?.acc_v_source_system !== false ? [{
      id: "source_system",
      label: "Source System",
      enabled: false,
      render: (row) => (
        <Typography variant="subtitle2">
          {row?.source_system || ""}
        </Typography>
      ),
    }] : []),
  ];

  const [defaultColumn, setDefaultColumn] = useState(DEFAULT_COLUMN);

  useEffect(() => {
    const actionColumn =  {
      id: "action",
      label: "Action",
      enabled: true,
      render: (row) =>
        <Stack direction="row" alignItems="center" gap={1}>
          <Tooltip title="Add task">
            <IconButton
              onClick={() => {
                setCreateTaskDialogOpen(true);
                setEditTransaction(row);
              }}
              size="small"
              sx={{ 
                color: 'info.main',
                transition: 'background-color 0.1s ease-in-out',
                '&:hover': { backgroundColor: 'action.hover' } 
              }}
            >
              <Iconify icon="material-symbols:add-task" width={24}/>
            </IconButton>
          </Tooltip>
          <Tooltip title="Add ticket">
            <IconButton
              onClick={() => {
                setCreateTicketDialogOpen(true);
                setEditTransaction(row);
              }}
              size="small"
              sx={{ 
                color: 'info.main',
                transition: 'background-color 0.1s ease-in-out',
                '&:hover': { backgroundColor: 'action.hover' } 
              }}
            >
              <Iconify icon="bx:task" width={24}/>
            </IconButton>
          </Tooltip>
          {user?.acc?.acc_e_transaction ? (
            <Tooltip title="Edit">
              <IconButton 
                onClick={() => {
                  setEditModalOpen(true);
                  setEditTransaction(row);
                }}
                size="small"
                sx={{ 
                  color: 'primary.main',
                  transition: 'background-color 0.1s ease-in-out',
                  '&:hover': { backgroundColor: 'action.hover' } 
                }}
              >
                <Iconify icon="mage:edit" width={24}/>
              </IconButton>
            </Tooltip>
          ) : null}
          {user?.acc?.acc_e_delete_transaction === undefined ||
          user?.acc?.acc_e_delete_transaction ? (
            <Tooltip title="Delete">
              <IconButton
                size="small"
                sx={{ 
                  color: 'error.main',
                  transition: 'background-color 0.1s ease-in-out',
                  '&:hover': { backgroundColor: 'action.hover' } 
                }}
                onClick={() => handleOpenDeleteTransaction(row)}
              >
                <Iconify icon="heroicons:trash" width={24}/>
              </IconButton>
            </Tooltip>
          ) : null}
        </Stack>
    };

    if (customFields?.length) {
      setDefaultColumn([...DEFAULT_COLUMN, ...customFields, actionColumn]);
    } else {
      setDefaultColumn([...DEFAULT_COLUMN, actionColumn]);
    }
  }, [
    rule,
    customFields,
    labelList,
    agentList,
    deskList,
    clientList,
    filters,
    brandsInfo,
    brandList,
    method,
  ]);

  // // TODO :  NEED TO RESEARCH WHAT IS THIS  // //

  // useEffect(() => {
  //   if (!columnSettings?.clientTable && customFilters?.length) {
  //     const updateSetting = {
  //       ...columnSettings,
  //       clientTable: [...DEFAULT_COLUMN, ...customFilters],
  //     };
  //     setRule(updateSetting?.clientTable);
  //   } else if (!columnSettings?.clientTable) {
  //     const updateSetting = {
  //       ...columnSettings,
  //       clientTable: [...DEFAULT_COLUMN],
  //     };
  //     setRule(updateSetting?.clientTable);
  //   }
  // }, [customFilters, columnSettings, filters]);

  const getTransaction = async () => {
    try {
      const params = {
        q: q?.length > 0 ? q : null,
        page: currentPage + 1,
        per_page: perPage ?? 10,
        ...filters,
      };
      if (method?.length) {
        if (method === 'credit_in') {
          params.credit = true;
        } else if (method === 'credit_out') {
          params.credit = false;
        } else {
          params.deposit = method;
        }
      }
      if (filters?.credit?.length === 1) {
        params.credit = filters?.credit?.includes("true") ? "true" : "false";
      }
      if (filters?.ids?.length) {
        params.ids = [filters?.ids];
      }
      if (filters?.non_ids?.length) {
        params.non_ids = [filters?.non_ids];
      }
      if (showInternal) {
        params.internal = true;
      }

      const customFiltersData = customFields
      ?.filter(
        (filter) =>
          filter?.filter &&
          (
            (filter?.filter?.field_type === "text" && filter?.filter?.query) ||
            (filter?.filter?.field_type === "multi_choice_radio" && (filter?.filter?.non_query?.length > 0 || filter?.filter?.query?.length > 0)) ||
            (filter?.filter?.field_type === "multi_choice" && (filter?.filter?.non_query?.length > 0 || filter?.filter?.query?.length > 0)) ||
            (filter?.filter?.field_type === "boolean" && filter?.filter?.query) ||
            (filter?.filter?.field_type === "number" && (filter?.filter?.query?.gt || filter?.filter?.query?.lt))
          )
      )
      ?.map((filter) => filter?.filter);
      params["custom_field"] = customFiltersData;

      const res = await customersApi.getTransaction(params);
      setTotalCount(res?.total_count);
      setTransactions(res?.transactions ?? []);
      setTransactionIds([
        ...new Set([
          ...transactionIds,
          ...res?.transactions?.map((item) => item?.id),
        ]),
      ]);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const handleUpdateTransaction = useCallback(async (id, data) => {
    try {
      await customersApi.updateTransaction(id, data);
      setEditTransaction(null);
      setEditModalOpen(false);
      toast.success("Transaction successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, []);

  const handleOpenDeleteTransaction = useCallback((transaction) => {
    setDeleteTransaction(transaction?.id);
    setDeleteModalOpen(true);
  }, []);

  const handleTransactionDelete = async () => {
    try {
      await customersApi.deleteTransaction(deleteTransaction);
      toast.success("Transaction successfully deleted!");
      setDeleteModalOpen(false);
      setTimeout(() => {
        getTransaction();
      }, 1000);
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleMakeExcelData = async () => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 800);

    try {
      setExportLoading(true);
      const data = [];

      // First, get the total count to determine pagination
      const checkParams = {
        per_page: 1000,
        page: currentPage + 1,
        q: q?.length ? q : null,
      };
      if (method?.length) {
        if (method === 'credit_in') {
          checkParams.credit = true;
        } else if (method === 'credit_out') {
          checkParams.credit = false;
        } else {
          checkParams.deposit = method;
        }
      }
      if (showInternal) {
        checkParams.internal = true;
      }
      if (!transactionSelection?.selectAll) {
        checkParams["ids"] = transactionSelection?.selected;
      }

      const customFiltersData = customFields
        ?.filter(
          (filter) =>
            filter?.filter &&
            (
              (filter?.filter?.field_type === "text" && filter?.filter?.query) ||
              (filter?.filter?.field_type === "multi_choice_radio" && (filter?.filter?.non_query?.length > 0 || filter?.filter?.query?.length > 0)) ||
              (filter?.filter?.field_type === "multi_choice" && (filter?.filter?.non_query?.length > 0 || filter?.filter?.query?.length > 0)) ||
              (filter?.filter?.field_type === "boolean" && filter?.filter?.query) ||
              (filter?.filter?.field_type === "number" && (filter?.filter?.query?.gt || filter?.filter?.query?.lt))
            )
        )
        ?.map((filter) => filter?.filter);
      checkParams["custom_field"] = customFiltersData;

      const checkRes = await customersApi.getTransaction(checkParams);
      const totalTransactions = checkRes?.total_count;
      const perPage = 1000;
      const numPages = Math.ceil(totalTransactions / perPage);

      // Fetch data in batches of 1000
      for (let page = 1; page <= numPages; page++) {
        const newParams = {
          page,
          per_page: perPage,
          q: q?.length ? q : null,
        };
        if (method?.length) {
          if (method === 'credit_in') {
            newParams.credit = true;
          } else if (method === 'credit_out') {
            newParams.credit = false;
          } else {
            newParams.deposit = method;
          }
        }
        if (showInternal) {
          newParams.internal = true;
        }
        if (!transactionSelection?.selectAll) {
          newParams["ids"] = transactionSelection?.selected;
        }

        const customFiltersData = customFields
          ?.filter(
            (filter) =>
              filter?.filter &&
              (
                (filter?.filter?.field_type === "text" && filter?.filter?.query) ||
                (filter?.filter?.field_type === "multi_choice_radio" && (filter?.filter?.non_query?.length > 0 || filter?.filter?.query?.length > 0)) ||
                (filter?.filter?.field_type === "multi_choice" && (filter?.filter?.non_query?.length > 0 || filter?.filter?.query?.length > 0)) ||
                (filter?.filter?.field_type === "boolean" && filter?.filter?.query) ||
                (filter?.filter?.field_type === "number" && (filter?.filter?.query?.gt || filter?.filter?.query?.lt))
              )
          )
          ?.map((filter) => filter?.filter);
        newParams["custom_field"] = customFiltersData;

        const newRes = await customersApi.getTransaction(newParams);
        
        // Filter out duplicates by ID
        const dataIds = data?.map(d => d?.id);
        data.push(
          ...newRes?.transactions?.filter((transaction) => !dataIds?.includes(transaction?.id))
        );
      }

      setExportLoading(false);
      clearInterval(timer);

      return { excelData: data, params: { ...checkParams, ...filters } };
    } catch (error) {
      toast.error(error?.response?.data?.message);
      clearInterval(timer);
      setExportLoading(false);
      return { excelData: [], params: {} };
    }
  };

  const handleExport = useCallback(async () => {
    const dateNow = new Date();
    const exportDate = format(dateNow, "dd.mm.yyyy");
    const result = await handleMakeExcelData();
    
    if (!result || !result.excelData) {
      toast.error("Failed to export data. Please try again.");
      return;
    }
    
    const { excelData, params } = result;

    if (rule?.length) {
      const filteredAndSortedFields = rule
        .filter((setting) => setting.enabled)
        .sort((a, b) => a.order - b.order)
        .map((setting) => setting.id);

      const customFieldsNames = customFields?.map((field) => field?.id);

      const modifiedArray = excelData?.map((obj) => {
        const modifiedObj = {};
        filteredAndSortedFields.forEach((field) => {
          if (field === "id") {
            modifiedObj["id"] = obj?.id;
          } else if (field === "client") {
            modifiedObj["client"] = obj?.full_name;
          } else if (field === "client_country") {
            modifiedObj["client country"] = countries?.find((country) => country?.code === obj?.client_country)?.label ?? "";
          } else if (field === "desk_id") {
            modifiedObj["desk"] = obj?.desk_name;
          } else if (field === "status") {
            modifiedObj["status"] = statuses[obj?.status];
          } else if (field === "transaction_type") {
            modifiedObj["transaction method"] = obj?.transaction_type;
          } else if (field === "owners") {
            modifiedObj["owners"] = obj?.t_transaction_account_names?.join(", ");
          } else if (field === "currency") {
            modifiedObj["currency"] = obj?.currency ? currencyOption?.find((currency) => currency?.value === obj?.currency)?.name : "USD";
          } else if (field === "provider") {
            let provider = {};
            if (isValidJSON(obj?.provider)) {
              const parsedForm = JSON.parse(obj?.provider);
              provider = { ...parsedForm };
            } else {
              provider.en = obj?.provider;
            }
            modifiedObj["provider"] = provider?.en ?? "";
          } else if (field === "amount") {
            modifiedObj["margin"] = obj?.converted_amount ?? obj?.amount ?? "";
          } else if (field === "labels") {
            modifiedObj["labels"] = obj?.t_transaction_status_status?.join(", ");
          } else if (field === "action_type") {
            modifiedObj["action type"] = obj?.bonus
              ? "Bonus"
              : obj?.deposit && obj?.credit
                ? "Credit In"
                : !obj?.deposit && obj?.credit
                  ? "Credit Out"
                  : obj?.deposit && !obj?.credit
                    ? "Deposit"
                    : "Withdraw";
          } else if (field === "request_data") {
            modifiedObj["request data"] = obj?.request_data ? "See Detail" : "";
          } else if (field === "description") {
            modifiedObj["description"] = obj?.description ? "See Description" : "";
          } else if (field === "credit") {
            modifiedObj["credit"] = obj?.credit && obj?.deposit
              ? "Credit In"
              : obj?.credit && !obj?.deposit
                ? "Credit Out"
                : "";
            modifiedObj["credit "] = obj?.credit;
          } else if (field === "approved_at") {
            modifiedObj["approved at"] = obj?.approved_at ? toLocalTime(obj?.approved_at) : "";
          } else if (field === "created_at") {
            modifiedObj["created date"] = obj?.created_at ? toLocalTime(obj?.created_at) : "";
          } else if (field === "error_code") {
            modifiedObj["error code"] = obj?.error_code ? `${obj?.error_code?.slice(0, 20)}...` : "";
          } else if (field === "m_id ") {
            modifiedObj["m id"] = obj?.m_id ? obj?.m_id : "";
          } else if (field === "usd_converted ") {
            modifiedObj["usd converted"] = obj?.usd_converted ? obj?.usd_converted : "";
          } else if (field === "internal_brand_id") {
            modifiedObj["internal brand name"] = brandList?.find((brand) => brand?.value == obj?.internal_brand_id)?.label ?? "";
          } else if (field === "ftd") {
            modifiedObj["ftd"] = obj?.ftd ? "Yes" : "No";
          } else if (field === "external_transaction_id") {
            if (user?.acc?.acc_v_external_transaction_id !== false) {
              modifiedObj["external transaction id"] = obj?.external_transaction_id || "";
            }
          } else if (field === "external_brand") {
            if (user?.acc?.acc_v_external_brand !== false) {
              modifiedObj["external brand"] = obj?.external_brand || "";
            }
          } else if (field === "external_user_id") {
            if (user?.acc?.acc_v_external_user_id !== false) {
              modifiedObj["external user id"] = obj?.external_user_id || "";
            }
          } else if (field === "payment_method") {
            if (user?.acc?.acc_v_payment_method !== false) {
              modifiedObj["payment method"] = obj?.payment_method || "";
            }
          } else if (field === "payment_method_code") {
            if (user?.acc?.acc_v_payment_method_code !== false) {
              modifiedObj["payment method code"] = obj?.payment_method_code || "";
            }
          } else if (field === "processing_status") {
            if (user?.acc?.acc_v_processing_status !== false) {
              modifiedObj["processing status"] = obj?.processing_status || "";
            }
          } else if (field === "failure_reason") {
            if (user?.acc?.acc_v_failure_reason !== false) {
              modifiedObj["failure reason"] = obj?.failure_reason || "";
            }
          } else if (field === "real_balance_before") {
            if (user?.acc?.acc_v_real_balance_before !== false) {
              modifiedObj["real balance before"] = obj?.real_balance_before || "";
            }
          } else if (field === "real_balance_after") {
            if (user?.acc?.acc_v_real_balance_after !== false) {
              modifiedObj["real balance after"] = obj?.real_balance_after || "";
            }
          } else if (field === "bonus_balance_before") {
            if (user?.acc?.acc_v_bonus_balance_before !== false) {
              modifiedObj["bonus balance before"] = obj?.bonus_balance_before || "";
            }
          } else if (field === "bonus_balance_after") {
            if (user?.acc?.acc_v_bonus_balance_after !== false) {
              modifiedObj["bonus balance after"] = obj?.bonus_balance_after || "";
            }
          } else if (field === "bonus_code") {
            if (user?.acc?.acc_v_bonus_code !== false) {
              modifiedObj["bonus code"] = obj?.bonus_code || "";
            }
          } else if (field === "bonus_type") {
            if (user?.acc?.acc_v_bonus_type !== false) {
              modifiedObj["bonus type"] = obj?.bonus_type || "";
            }
          } else if (field === "bonus_release_amount") {
            if (user?.acc?.acc_v_bonus_release_amount !== false) {
              modifiedObj["bonus release amount"] = obj?.bonus_release_amount || "";
            }
          } else if (field === "bonus_cancel_reason") {
            if (user?.acc?.acc_v_bonus_cancel_reason !== false) {
              modifiedObj["bonus cancel reason"] = obj?.bonus_cancel_reason || "";
            }
          } else if (field === "total_pending_withdrawals_count") {
            if (user?.acc?.acc_v_total_pending_withdrawals_count !== false) {
              modifiedObj["total pending withdrawals count"] = obj?.total_pending_withdrawals_count || "";
            }
          } else if (field === "total_pending_withdrawals_amount") {
            if (user?.acc?.acc_v_total_pending_withdrawals_amount !== false) {
              modifiedObj["total pending withdrawals amount"] = obj?.total_pending_withdrawals_amount || "";
            }
          } else if (field === "user_net_deposits") {
            if (user?.acc?.acc_v_user_net_deposits !== false) {
              modifiedObj["user net deposits"] = obj?.user_net_deposits || "";
            }
          } else if (field === "is_first_deposit") {
            if (user?.acc?.acc_v_is_first_deposit !== false) {
              modifiedObj["is first deposit"] = obj?.is_first_deposit ? "Yes" : "No";
            }
          } else if (field === "webhook_data") {
            if (user?.acc?.acc_v_webhook_data !== false) {
              modifiedObj["webhook data"] = obj?.webhook_data ? "See Detail" : "";
            }
          } else if (field === "event_date") {
            if (user?.acc?.acc_v_event_date !== false) {
              modifiedObj["event date"] = obj?.event_date ? toLocalTime(obj?.event_date) : "";
            }
          } else if (field === "source_system") {
            if (user?.acc?.acc_v_source_system !== false) {
              modifiedObj["source system"] = obj?.source_system || "";
            }
          } else if (field === "email") {
            modifiedObj["email"] = obj?.emails?.length > 0 ? obj?.emails?.slice(0, 2)?.map((item) => item)
              ?.join(", ") : "";
          } else if (
            customFieldsNames.includes(field) &&
            customFields?.length &&
            obj?.client_fields
          ) {
            const customFieldObj = customFields?.find((f) => f?.id === field);
            modifiedObj[field?.replace("_", " ")] = obj?.client_fields[customFieldObj?.custom_id] ?? "";
          } else {
            modifiedObj[field] = obj[field];
          }
        });
        return modifiedObj;
      });

      exportToExcel(modifiedArray, `transactions-import-${exportDate}`);

      localStorage.setItem("last_beat_time", new Date().getTime());
      await settingsApi.updateMember(accountId, {
        last_beat: true,
        trigger: "export",
        export_filter_data: JSON.stringify(params),
        export_count: transactionSelection?.selectAll ? excelData?.length + "" : transactionSelection?.selected?.length ? transactionSelection?.selected?.length + "" : 0,
        export_table: "Transaction"
      });
    } else {
      const customFieldsNames = customFields?.map((field) => field?.id);

      const modifiedArray = excelData?.map((obj) => {
        const modifiedObj = {};
        defaultColumn?.map(setting => setting?.id)?.forEach((field) => {
          if (field === "id") {
            modifiedObj["id"] = obj?.id;
          } else if (field === "client") {
            modifiedObj["client"] = obj?.full_name;
          } else if (field === "client_country") {
            modifiedObj["client country"] = countries?.find((country) => country?.code === obj?.client_country)?.label ?? "";
          } else if (field === "desk_id") {
            modifiedObj["desk"] = obj?.desk_name;
          } else if (field === "status") {
            modifiedObj["status"] = statuses[obj?.status];
          } else if (field === "transaction_type") {
            modifiedObj["transaction method"] = obj?.transaction_type;
          } else if (field === "owners") {
            modifiedObj["owners"] = obj?.t_transaction_account_names?.join(", ");
          } else if (field === "currency") {
            modifiedObj["currency"] = obj?.currency ? currencyOption?.find((currency) => currency?.value === obj?.currency)?.name : "USD";
          } else if (field === "provider") {
            let provider = {};
            if (isValidJSON(obj?.provider)) {
              const parsedForm = JSON.parse(obj?.provider);
              provider = { ...parsedForm };
            } else {
              provider.en = obj?.provider;
            }
            modifiedObj["provider"] = provider?.en ?? "";
          } else if (field === "amount") {
            modifiedObj["margin"] = obj?.converted_amount ?? obj?.amount ?? "";
          } else if (field === "labels") {
            modifiedObj["labels"] = obj?.t_transaction_status_status?.join(", ");
          } else if (field === "action_type") {
            modifiedObj["action type"] = obj?.bonus
              ? "Bonus"
              : obj?.deposit && obj?.credit
                ? "Credit In"
                : !obj?.deposit && obj?.credit
                  ? "Credit Out"
                  : obj?.deposit && !obj?.credit
                    ? "Deposit"
                    : "Withdraw";
          } else if (field === "request_data") {
            modifiedObj["request data"] = obj?.request_data ? "See Detail" : "";
          } else if (field === "description") {
            modifiedObj["description"] = obj?.description ? "See Description" : "";
          } else if (field === "credit") {
            modifiedObj["credit"] = obj?.credit && obj?.deposit
              ? "Credit In"
              : obj?.credit && !obj?.deposit
                ? "Credit Out"
                : "";
            modifiedObj["credit "] = obj?.credit;
          } else if (field === "approved_at") {
            modifiedObj["approved at"] = obj?.approved_at ? toLocalTime(obj?.approved_at) : "";
          } else if (field === "created_at") {
            modifiedObj["created date"] = obj?.created_at ? toLocalTime(obj?.created_at) : "";
          } else if (field === "error_code") {
            modifiedObj["error code"] = obj?.error_code ? `${obj?.error_code?.slice(0, 20)}...` : "";
          } else if (field === "m_id ") {
            modifiedObj["m id"] = obj?.m_id ? obj?.m_id : "";
          } else if (field === "usd_converted ") {
            modifiedObj["usd converted"] = obj?.usd_converted ? obj?.usd_converted : "";
          } else if (field === "internal_brand_id") {
            modifiedObj["internal brand name"] = brandList?.find((brand) => brand?.value == obj?.internal_brand_id)?.label ?? "";
          } else if (field === "ftd") {
            modifiedObj["ftd"] = obj?.ftd ? "Yes" : "No";
          } else if (field === "external_transaction_id") {
            if (user?.acc?.acc_v_external_transaction_id !== false) {
              modifiedObj["external transaction id"] = obj?.external_transaction_id || "";
            }
          } else if (field === "external_brand") {
            if (user?.acc?.acc_v_external_brand !== false) {
              modifiedObj["external brand"] = obj?.external_brand || "";
            }
          } else if (field === "external_user_id") {
            if (user?.acc?.acc_v_external_user_id !== false) {
              modifiedObj["external user id"] = obj?.external_user_id || "";
            }
          } else if (field === "payment_method") {
            if (user?.acc?.acc_v_payment_method !== false) {
              modifiedObj["payment method"] = obj?.payment_method || "";
            }
          } else if (field === "payment_method_code") {
            if (user?.acc?.acc_v_payment_method_code !== false) {
              modifiedObj["payment method code"] = obj?.payment_method_code || "";
            }
          } else if (field === "processing_status") {
            if (user?.acc?.acc_v_processing_status !== false) {
              modifiedObj["processing status"] = obj?.processing_status || "";
            }
          } else if (field === "failure_reason") {
            if (user?.acc?.acc_v_failure_reason !== false) {
              modifiedObj["failure reason"] = obj?.failure_reason || "";
            }
          } else if (field === "real_balance_before") {
            if (user?.acc?.acc_v_real_balance_before !== false) {
              modifiedObj["real balance before"] = obj?.real_balance_before || "";
            }
          } else if (field === "real_balance_after") {
            if (user?.acc?.acc_v_real_balance_after !== false) {
              modifiedObj["real balance after"] = obj?.real_balance_after || "";
            }
          } else if (field === "bonus_balance_before") {
            if (user?.acc?.acc_v_bonus_balance_before !== false) {
              modifiedObj["bonus balance before"] = obj?.bonus_balance_before || "";
            }
          } else if (field === "bonus_balance_after") {
            if (user?.acc?.acc_v_bonus_balance_after !== false) {
              modifiedObj["bonus balance after"] = obj?.bonus_balance_after || "";
            }
          } else if (field === "bonus_code") {
            if (user?.acc?.acc_v_bonus_code !== false) {
              modifiedObj["bonus code"] = obj?.bonus_code || "";
            }
          } else if (field === "bonus_type") {
            if (user?.acc?.acc_v_bonus_type !== false) {
              modifiedObj["bonus type"] = obj?.bonus_type || "";
            }
          } else if (field === "bonus_release_amount") {
            if (user?.acc?.acc_v_bonus_release_amount !== false) {
              modifiedObj["bonus release amount"] = obj?.bonus_release_amount || "";
            }
          } else if (field === "bonus_cancel_reason") {
            if (user?.acc?.acc_v_bonus_cancel_reason !== false) {
              modifiedObj["bonus cancel reason"] = obj?.bonus_cancel_reason || "";
            }
          } else if (field === "total_pending_withdrawals_count") {
            if (user?.acc?.acc_v_total_pending_withdrawals_count !== false) {
              modifiedObj["total pending withdrawals count"] = obj?.total_pending_withdrawals_count || "";
            }
          } else if (field === "total_pending_withdrawals_amount") {
            if (user?.acc?.acc_v_total_pending_withdrawals_amount !== false) {
              modifiedObj["total pending withdrawals amount"] = obj?.total_pending_withdrawals_amount || "";
            }
          } else if (field === "user_net_deposits") {
            if (user?.acc?.acc_v_user_net_deposits !== false) {
              modifiedObj["user net deposits"] = obj?.user_net_deposits || "";
            }
          } else if (field === "is_first_deposit") {
            if (user?.acc?.acc_v_is_first_deposit !== false) {
              modifiedObj["is first deposit"] = obj?.is_first_deposit ? "Yes" : "No";
            }
          } else if (field === "webhook_data") {
            if (user?.acc?.acc_v_webhook_data !== false) {
              modifiedObj["webhook data"] = obj?.webhook_data ? "See Detail" : "";
            }
          } else if (field === "event_date") {
            if (user?.acc?.acc_v_event_date !== false) {
              modifiedObj["event date"] = obj?.event_date ? toLocalTime(obj?.event_date) : "";
            }
          } else if (field === "source_system") {
            if (user?.acc?.acc_v_source_system !== false) {
              modifiedObj["source system"] = obj?.source_system || "";
            }
          } else if (field === "email") {
            modifiedObj["email"] = obj?.emails?.length > 0 ? obj?.emails?.slice(0, 2)?.map((item) => item)
              ?.join(", ") : "";
          } else if (
            customFieldsNames.includes(field) &&
            customFields?.length &&
            obj?.client_fields
          ) {
            const customFieldObj = customFields?.find((f) => f?.id === field);
            modifiedObj[field?.replace("_", " ")] = obj?.client_fields[customFieldObj?.custom_id] ?? "";
          } else {
            modifiedObj[field] = obj[field];
          }
        });
        return modifiedObj;
      });


      if (modifiedArray) exportToExcel(modifiedArray, `transactions-import-${exportDate}`);

      localStorage.setItem("last_beat_time", new Date().getTime());
      await settingsApi.updateMember(accountId, {
        last_beat: true,
        trigger: "export",
        export_filter_data: JSON.stringify(params),
        export_count: transactionSelection?.selectAll ? excelData?.length + "" : transactionSelection?.selected?.length ? transactionSelection?.selected?.length + "" : 0,
        export_table: "Transaction"
      });
    }
  }, [perPage, currentPage, q, transactionSelection, rule, showInternal, brandList, customFields, user?.timezone, defaultColumn]);

  const getStatuses = async () => {
    try {
      const res = await customersApi.getTransactionStatuses();
      if (res?.status)
        setLabelList(
          res?.status?.map((s) => ({
            label: s?.status,
            value: s?.id,
          }))
        );
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const getAgents = async () => {
    try {
      const params = {
        desk_ids: user?.desk_ids,
        // per_page: 500,
      };
      const res = await settingsApi.getMembers([], "*", params);
      const agentList = res?.accounts
        ?.filter((account) => !account?.admin_hide)
        ?.map((account) => ({
          label: `${account?.first_name} ${account?.last_name}`,
          value: account?.id?.toString(),
          avatar: account?.avatar,
        }))
        ?.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.label === item?.label)
        );
      setAgentList(agentList);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getClients = async () => {
    try {
      const params = {
        per_page: 5,
      };
      const res = await customersApi.getCustomers(params);
      const clientsList = res?.clients
        ?.map((account) => ({
          label: `${account?.first_name} ${account?.last_name}`,
          value: account?.id?.toString(),
          avatar: account?.avatar,
        }))
        ?.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.label === item?.label)
        );
      setClientList(clientsList);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getTrx = async () => {
    setIsLoading(true);
    try {
      await getTransaction();
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  const getUserInfo = async () => {
    try {
      const { account } = await authApi.me({ accountId });
      setSearchSetting(account?.search_setting);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    if (!filterModal) {
      getUserInfo();
    }
  }, [filterModal]);

  const currentFilter = useMemo(() => {
    if (searchSetting?.transaction?.length && selectedFilterValue !== "none") {
      const result = searchSetting?.transaction?.find(
        (item) => item?.id === selectedFilterValue?.id
      )?.filter;
      const name = selectedFilterValue.name;
      return { filter: result, name };
    }
  }, [searchSetting, selectedFilterValue]);

  const currentSavedFilterName = useMemo(() => {
    if (currentFilter) {
      const currentFilters = currentFilter?.filter;
      if (isEqual(currentFilters, filters)) {
        return currentFilter?.name;
      } else {
        return undefined;
      }
    }
  }, [currentFilter, filters]);

  useEffect(() => {
    if (currentFilter) {
      setFilters(currentFilter?.filter);
    }
  }, [currentFilter]);

  useEffect(() => {
    if (!isLoading) {
      const intervalId = setInterval(() => {
        getTransaction();
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [isLoading]);

  useEffect(() => {
    getTrx();
  }, [method, perPage, currentPage, q, filters, showInternal, customFields]);

  useEffect(() => {
    getStatuses();
    getAgents();
    getClients();
  }, []);

  const updateRule = (rule) => {
    setRule(rule);

    if (tableSetting) {
      const updateSetting = {
        ...tableSetting,
        transactionTable: rule,
      };
      localStorage.setItem("tableSetting", JSON.stringify(updateSetting));
    } else {
      const tableSettings = {
        transactionTable: rule,
      };
      localStorage.setItem("tableSetting", JSON.stringify(tableSettings));
    }
  };

  useEffect(() => {
    setRule(tableSetting?.transactionTable ?? []);
  }, []);

  const tableColumn = useMemo(() => {
    if (rule?.length) {
      const updateColumn = defaultColumn?.map((item) => ({
        ...item,
        enabled: rule?.find((ruleItem) => item?.id === ruleItem?.id)?.enabled,
        order: rule?.find((ruleItem) => item?.id === ruleItem?.id)?.order,
      }))?.sort((a, b) => a.order - b.order);
      return updateColumn;
    } else {
      return defaultColumn?.map((item, index) => ({ ...item, order: index }));
    }
  }, [rule, labelList, agentList, deskList, clientList, filters, brandsInfo, brandList, defaultColumn, method]);

  const isDefaultSetting =
    JSON.stringify(
      defaultColumn?.map((item, index) => ({
        id: item?.id,
        enabled: item?.enabled,
        order: index,
      }))
    ) === 
    JSON.stringify(rule?.map((item, index) => ({
      id: item?.id,
      enabled: item?.enabled,
      order: index,
    }))) || 
    rule?.length === 0;

  const isFilter =
    customFilterChip?.length ||
    transactionChip?.length ||
    internalBrandChip?.length ||
    ftdChip?.length ||
    clientIdChip?.length ||
    statusChip.length ||
    maxAmountChip?.length ||
    minAmountChip?.length ||
    createdStartChip?.length ||
    createdEndChip?.length ||
    labelChip?.length ||
    nonLabelChip?.length ||
    ownerChip?.length ||
    nonOwnerChip?.length ||
    creditChip?.length ||
    approvedAtStartChip?.length ||
    approvedAtEndChip?.length ||
    idsChip?.length ||
    nonIdsChip?.length ||
    deskChip?.length ||
    nonDeskChip?.length ||
    currencyChip.length ||
    actionTypeChip?.length;

  return (
    <>
      <Seo title={`Dashboard: Transactions`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}
      >
        <Container maxWidth="xxl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Transactions</Typography>
              </Stack>
            </Stack>
            <PayWallLayout>
              <Card>
                <Stack
                  alignItems="center"
                  direction="row"
                  sx={{ p: 2 }}
                  spacing={1}
                >
                  <Iconify icon="lucide:search" color="text.secondary" width={24} />
                  <Box sx={{ flexGrow: 1, pl: 2 }}>
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
                  {isLoading && (
                    <Iconify
                      icon='svg-spinners:8-dots-rotate'
                      width={24}
                      sx={{ color: 'white' }}
                    />
                  )}
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showInternal}
                        onChange={(e) => setShowInternal(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Show Internal"
                    sx={{ mr: 1 }}
                  />
                  <Tooltip title="Reload Table">
                    <IconButton
                      onClick={() => getTrx()}
                      sx={{ '&:hover': { color: 'primary.main', transform: 'rotate(180deg)', }, transition: 'transform 0.3s' }}
                    >
                      <Iconify icon="ion:reload-sharp" width={24}/>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Search Setting">
                    <IconButton 
                      onClick={() => setFilterModal(true)}
                      sx={{ '&:hover': { color: 'primary.main' }}}
                    >
                      {!isFilter ? (
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
                    <IconButton onClick={() => setTableModal(true)} sx={{ '&:hover': { color: 'primary.main' }}}>
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
                    (user?.acc?.acc_v_export_transactions === undefined ||
                      user?.acc?.acc_v_export_transactions) ? (
                    <Tooltip title="Export selected">
                      <IconButton
                        onClick={() => {
                          handleExport();
                        }}
                        sx={{ '&:hover': { color: 'primary.main' }}}
                      >
                        <Iconify icon="line-md:downloading-loop" width={24}/>
                      </IconButton>
                    </Tooltip>
                  ) : null}
                </Stack>
                {isFilter ? (
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

                      <ChipSet
                        chips={customFilterChip}
                        handleRemoveChip={handleRemoveCustomFilterChip}
                      />

                      <ChipSet
                        chips={transactionChip}
                        handleRemoveChip={() => updateFilters({ transaction_type: undefined })}
                      />
                      <ChipSet
                        chips={internalBrandChip}
                        handleRemoveChip={() =>
                          updateFilters({ internal_brand_id: undefined })
                        }
                      />
                      <ChipSet
                        chips={ftdChip}
                        handleRemoveChip={() =>
                          updateFilters({ ftd: undefined })
                        }
                      />
                      <ChipSet
                        chips={statusChip}
                        handleRemoveChip={() =>
                          updateFilters({ status: undefined })
                        }
                      />
                      <ChipSet
                        chips={currencyChip}
                        handleRemoveChip={() =>
                          updateFilters({ currency: undefined })
                        }
                      />
                      <ChipSet
                        chips={clientIdChip}
                        handleRemoveChip={(value) =>
                          handleRemoveChip(value, "client_id")
                        }
                      />
                      <ChipSet
                        chips={approvedAtStartChip}
                        handleRemoveChip={() =>
                          updateFilters({ approved_at_start: "" })
                        }
                      />
                      <ChipSet
                        chips={approvedAtEndChip}
                        handleRemoveChip={() =>
                          updateFilters({ approved_at_end: "" })
                        }
                      />
                      <ChipSet
                        chips={minAmountChip}
                        handleRemoveChip={() =>
                          updateFilters({ lte_amount: undefined })
                        }
                      />
                      <ChipSet
                        chips={maxAmountChip}
                        handleRemoveChip={() =>
                          updateFilters({ amount: undefined })
                        }
                      />
                      <ChipSet
                        chips={labelChip}
                        handleRemoveChip={(value) => {
                          const target = "label";
                          return handleRemoveChip(value, target);
                        }}
                      />
                      <ChipSet
                        chips={nonLabelChip}
                        handleRemoveChip={(value) => {
                          const target = "non_label";
                          return handleRemoveChip(value, target);
                        }}
                      />
                      <ChipSet
                        chips={deskChip}
                        handleRemoveChip={(value) => {
                          const target = "desk";
                          return handleRemoveChip(value, target);
                        }}
                      />
                      <ChipSet
                        chips={nonDeskChip}
                        handleRemoveChip={(value) => {
                          const target = "non_desk";
                          return handleRemoveChip(value, target);
                        }}
                      />
                      <ChipSet
                        chips={ownerChip}
                        handleRemoveChip={(value) => {
                          const target = "owner";
                          return handleRemoveChip(value, target);
                        }}
                      />
                      <ChipSet
                        chips={nonOwnerChip}
                        handleRemoveChip={(value) => {
                          const target = "non_owner";
                          return handleRemoveChip(value, target);
                        }}
                      />
                      <ChipSet
                        chips={creditChip}
                        handleRemoveChip={(value) =>
                          handleRemoveChip(value, "credit")
                        }
                      />
                      <ChipSet
                        chips={createdStartChip}
                        handleRemoveChip={() =>
                          updateFilters({ created_at_start: undefined })
                        }
                      />
                      <ChipSet
                        chips={createdEndChip}
                        handleRemoveChip={() =>
                          updateFilters({ created_at_end: undefined })
                        }
                      />
                      <ChipSet
                        chips={idsChip}
                        handleRemoveChip={() => updateFilters({ ids: "" })}
                      />
                      <ChipSet
                        chips={nonIdsChip}
                        handleRemoveChip={() => updateFilters({ non_ids: "" })}
                      />
                      <ChipSet
                        chips={actionTypeChip}
                        handleRemoveChip={() =>
                          setMethod(undefined)
                        }
                      />
                    </Stack>
                  </>
                ) : null}
                <Box sx={{ position: "relative" }}>
                  {enableBulkActions ? (
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        alignItems: "center",
                        backgroundColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "neutral.800"
                            : "neutral.50",
                        display: enableBulkActions ? "flex" : "none",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        px: 2,
                        py: 0.5,
                        zIndex: 50,
                      }}
                    >
                      <Checkbox
                        sx={{ p: 0 }}
                        checked={selectedPage}
                        indeterminate={selectedSome}
                        onChange={(event) => {
                          if (event.target.checked) {
                            if (selectedSome) {
                              transactionSelection.handleDeSelectPage(tableIds);
                            } else {
                              transactionSelection.handleSelectPage(tableIds);
                            }
                          } else {
                            transactionSelection.handleDeSelectPage(tableIds);
                          }
                        }}
                      />
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        pl={2}
                      >
                        {transactionSelection.selectAll ? (
                          <Typography sx={{ whiteSpace: "nowrap" }}>
                            Selected all <strong>{totalCount}</strong> items
                          </Typography>
                        ) : (
                          <Typography sx={{ whiteSpace: "nowrap" }}>
                            Selected{" "}
                            <strong>
                              {transactionSelection.selected?.length}
                            </strong>{" "}
                            of <strong>{totalCount}</strong>
                          </Typography>
                        )}
                      </Stack>
                      {!transactionSelection.selectAll && (
                        <Button onClick={() => transactionSelection.handleSelectAll()}>
                          <Typography sx={{ whiteSpace: "nowrap" }}>Selected All</Typography>
                        </Button>
                      )}
                      <Button onClick={() => transactionSelection.handleDeselectAll()}>
                        <Typography sx={{ whiteSpace: "nowrap" }}>Clear Selection</Typography>
                      </Button>
                    </Stack>
                  ) : null}
                  <Scrollbar>
                    <Table sx={{ minWidth: 700 }}>
                      <TableHead>
                        <TableRow sx={{ whiteSpace: "nowrap" }}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              sx={{ p: 0 }}
                              checked={false}
                              indeterminate={selectedSome}
                              onChange={(event) => {
                                if (event.target.checked) {
                                  transactionSelection.handleSelectPage(
                                    tableIds
                                  );
                                } else {
                                  transactionSelection.handleSelectPage(
                                    tableIds
                                  );
                                }
                              }}
                            />
                          </TableCell>
                          {tableColumn
                            ?.filter((item) => item.enabled)
                            ?.map((item) => (
                              <TableCell key={item.key}>
                                {item.headerRender ? (
                                  item.headerRender()
                                ) : (
                                  <Typography
                                    sx={{
                                      fontSize: 14,
                                      fontWeight: "600",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {item.label}
                                  </Typography>
                                )}
                              </TableCell>
                            ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {isLoading && transactions.length == 0 ? (
                          <TableSkeleton
                            cellCount={tableColumn?.filter((item) => item.enabled)?.length + 1}
                            rowCount={perPage > 15 ? 15 : 10}
                          />
                        ) : (
                          transactions?.map((transaction) => {
                            const isSelected =
                              transactionSelection.selected.includes(
                                transaction?.id
                              );
                            return (
                              <TableRow key={transaction?.id}>
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    sx={{ p: 0 }}
                                    checked={isSelected}
                                    onChange={(event) => {
                                      if (event.target.checked) {
                                        transactionSelection.handleSelectOne?.(
                                          transaction?.id
                                        );
                                      } else {
                                        transactionSelection.handleDeselectOne?.(
                                          transaction?.id
                                        );
                                      }
                                    }}
                                    value={isSelected}
                                  />
                                </TableCell>
                                {tableColumn
                                  ?.filter((item) => item.enabled)
                                  ?.map((column, index) => (
                                    <TableCell
                                      sx={{ whiteSpace: "nowrap" }}
                                      key={transaction.id + index}
                                    >
                                      {column?.render
                                        ? column?.render(transaction)
                                        : transaction[column?.id]}
                                    </TableCell>
                                  ))}
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                    {!isLoading && transactions.length === 0 && (
                      <TableNoData label="No transaction." />
                    )}
                    <Divider />
                  </Scrollbar>
                </Box>

                <Stack sx={{  flexDirection: { md: 'row', xs: 'column' }, gap: 0, justifyContent: 'flex-end', alignItems: { md: 'center', xs: 'start' } }}>
                  <PageNumberSelect 
                    currentPage={currentPage} 
                    totalPage={totalCount? Math.ceil(totalCount/perPage) : 0}
                    onUpdate={setCurrentPage}
                  />
                  <TablePagination
                    component="div"
                    labelRowsPerPage="Per page"
                    count={totalCount ?? 0}
                    onPageChange={(event, index) => setCurrentPage(index)}
                    onRowsPerPageChange={(event) => {
                      setPerPage(event?.target?.value);
                      localStorage.setItem("riskTransactionsPerPage", event?.target?.value);
                    }}
                    page={currentPage ?? 0}
                    rowsPerPage={perPage ?? 0}
                    rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
                  />
                </Stack>
              </Card>
            </PayWallLayout>
          </Stack>
        </Container>
      </Box>

      {editTransaction ? (
        <EditTransactionModal
          open={editModalOpen}
          onClose={() => {
            setEditTransaction(null);
            setEditModalOpen(false);
          }}
          transaction={editTransaction}
          handleUpdateTransaction={handleUpdateTransaction}
          onGetTransactions={getTransaction}
          customerId={editTransaction?.client_id}
          currentEnabledBrandCurrencies={currentEnabledBrandCurrencies}
        />
      ) : null}

      {(createTaskDialogOpen || createTicketDialogOpen) && (
        <CreateTaskDialog
          open={createTaskDialogOpen || createTicketDialogOpen}
          onClose={() => {
            setCreateTaskDialogOpen(false);
            setCreateTicketDialogOpen(false);
            setEditTransaction(null);
          }}
          isTicket={createTicketDialogOpen}
          transaction={editTransaction}
        />
      )}

      <TransactionRequestModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setRequestInfo(undefined);
          setDocInfo([]);
        }}
        requestInfo={requestInfo}
        docInfo={docInfo}
        bankDetailList={bankDetailList}
      />

      <FilterModal
        variant="transaction"
        open={filterModal}
        isFilter={isFilter}
        onClose={() => setFilterModal(false)}
        filters={filters}
        searchSetting={searchSetting}
        currentValue={selectedFilterValue}
        setSelectedValue={setSelectedFilterValue}
        accountId={accountId}
      />

      <TableModal
        open={tableModal}
        onClose={() => setTableModal(false)}
        tableColumn={tableColumn}
        defaultColumn={defaultColumn}
        updateRule={updateRule}
      />

      <Dialog 
        open={descriptionDialogOpen} 
        onClose={() => setDescriptionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Description</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {selectedDescription}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDescriptionDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={webhookDialogOpen} 
        onClose={() => {
          setWebhookDialogOpen(false);
          setWebhookData(undefined);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Webhook Data</DialogTitle>
        <DialogContent>
          {webhookData && (
            <Stack spacing={2}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">Real Balance</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    ${webhookData.acc_real_balance?.toFixed(2) || '0.00'}
                  </Typography>
                </Box>
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">Bonus Balance</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    ${webhookData.acc_bonus_balance?.toFixed(2) || '0.00'}
                  </Typography>
                </Box>
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">Last Bonus Code</Typography>
                  <Typography variant="body1">
                    {webhookData.acc_last_bonus_code || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">Last Bonus Type</Typography>
                  <Typography variant="body1">
                    {webhookData.acc_last_bonus_type || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">Last Transaction ID</Typography>
                  <Typography variant="body1">
                    {webhookData.acc_last_transaction_id || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">Last Bonus Complete Date</Typography>
                  <Typography variant="body1">
                    {webhookData.acc_last_bonus_complete_date ? 
                      new Date(webhookData.acc_last_bonus_complete_date).toLocaleString() : 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">Last Bonus Release Amount</Typography>
                  <Typography variant="body1">
                    ${webhookData.acc_last_bonus_release_amount?.toFixed(2) || '0.00'}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setWebhookDialogOpen(false);
            setWebhookData(undefined);
          }}>Close</Button>
        </DialogActions>
      </Dialog>

      {deleteTransaction ? (
        <DeleteModal
          isOpen={deleteModalOpen}
          title="Delete transaction"
          description="Are you sure you want to delete this transaction?"
          setIsOpen={setDeleteModalOpen}
          onDelete={handleTransactionDelete}
        />
      ) : null}
    </>
  );
};

export default Page;
