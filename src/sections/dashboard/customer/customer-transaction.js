import { useEffect, useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import LoadingButton from "@mui/lab/LoadingButton";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
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
import { isValidJSON } from "src/utils/function";
import { Iconify } from 'src/components/iconify';
import SettingIcon from "src/icons/untitled-ui/duocolor/setting";
import { ChipSet } from "src/components/customize/chipset";
import { CreateTransactionModal } from "./customer-transaction-add-modal";
import { DeleteModal } from "src/components/customize/delete-modal";
import { EditTransactionModal } from "./customer-transaction-edit";
import { FilterDateTime } from "src/components/customize/filter-date-time";
import { FilterInput } from "src/components/customize/filter-input";
import { FilterMultiSelect } from "src/components/customize/filter-multi-select";
import { FilterSelect } from "src/components/customize/filter-select";
import { MultiSelect } from "src/components/multi-select";
import { RouterLink } from "src/components/router-link";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { TableModal } from "src/components/table-settings-modal";
import { TableNoData } from "src/components/table-empty";
import { TableSkeleton } from "src/components/table-skeleton";
import { TransactionRequestModal } from "./customer-transaction-request-modal";
import { copyToClipboard } from "src/utils/copy-to-clipboard";
import { countries, currencyFlagMap, currencyOption } from "src/utils/constant";
import { statusList } from "src/pages/dashboard/risk-management/transactions";
import { customersApi } from "src/api/customers";
import { paths } from "src/paths";
import { settingsApi } from "src/api/settings";
import { toast } from "react-hot-toast";
import { useAuth } from "src/hooks/use-auth";
import { useTraderAccounts } from "./customer-trader-accounts";
import { InfoOutlined } from "@mui/icons-material";
import { PageNumberSelect } from "src/components/pagination/page-selector";
import { useGetCustomerDesks } from "src/api-swr/customer";
import { brandsApi } from "src/api/lead-management/brand";
import { CreateTransferFundModal } from "./customer-transfer-fund-modal";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { CustomFilterMultiRadio } from "src/components/customize/custom-filter-multi-radio";
import { CustomFilterText } from "src/components/customize/custom-filter-text";
import { CustomFilterNumber } from "src/components/customize/custom-filter-number";
import { CustomFilterBoolean } from "src/components/customize/custom-filter-boolean";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { customerFieldsApi } from "src/api/customer-fields";
import { alpha } from "@mui/system";
import { CustomerTransactionAISummary } from "./customer-transaction-ai-summary";
import { CreateTaskDialog } from "src/sections/dashboard/todo/todo-create-dialog";
import { useTimezone } from "src/hooks/use-timezone";
import { useRouter } from "src/hooks/use-router";

const statuses = {
  1: "Approved",
  2: "Pending",
  3: "Rejected",
  4: "Canceled",
};

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
                  const color = setting.find((s) => s?.option === val)?.color ?? 'primary.main';

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
                    <Stack direction='row' alignItems='center' gap={1}>
                      <Tooltip key={index} title={row?.client_fields[field?.id]} className="custom-field-value">
                        <Typography>{row?.client_fields[field?.id]?.substring(0, 15) + "..." ?? ""}</Typography>
                      </Tooltip>
                    </Stack>
                  )
                } else {
                  return (
                    <Stack direction='row' alignItems='center' gap={1}>
                      <Typography key={index} className="custom-field-value">{row?.client_fields[field?.id] ?? ""}</Typography>
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

export const CustomerTransaction = (props) => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const currentLang = i18n?.resolvedLanguage;

  const { customFields, setCustomFields } = useCustomerCustomFields();

  const { customerId, customerInfo, isIB = false, onGetClient } = props;
  const { internalBrandsInfo: brandsInfo, internalBrandsList: brandList } = useInternalBrands();

  const bankDetailList = useMemo(() => {
    const currentBrandBankDetail = brandsInfo?.find((brand)=> brand.id == customerInfo?.client?.internal_brand_id)?.bank_details;
    if(currentBrandBankDetail) {
      const parsedDetail  = JSON.parse(currentBrandBankDetail);
      return parsedDetail;
    }
    return []
  }, [brandsInfo, customerInfo])
  
  const currentEnabledBrandCurrencies = useMemo(() => {
    const currentBrand = brandsInfo?.find((brand)=> brand.id == customerInfo?.client?.internal_brand_id);

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
  }, [brandsInfo, customerInfo])

  const [transferFundModalOpen, setTransferFundModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);
  const [createTicketDialogOpen, setCreateTicketDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [deleteTransaction, setDeleteTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [totalCount, setTotalCount] = useState();
  const [perPage, setPerPage] = useState(100);
  const [currentPage, setCurrentPage] = useState(0);
  const [agentList, setAgentList] = useState([]);
  const [accountIds, setAccountIds] = useState([]);
  const [nonAccountIds, setNonAccountIds] = useState([]);
  const [currency, setCurrency] = useState("");
  const [credit, setCredit] = useState([]);
  const [approvedAtStart, setApprovedAtStart] = useState("");
  const [approvedAtEnd, setApprovedAtEnd] = useState("");
  const [labelList, setLabelList] = useState([]);
  const [labelIds, setLabelIds] = useState([]);
  const [nonLabelIds, setNonLabelIds] = useState([]);
  const [deskIds, setDeskIds] = useState([]);
  const [nonDeskIds, setNonDeskIds] = useState([]);
  const [amount, setAmount] = useState(undefined);
  const [lteAmount, setLteAmount] = useState(undefined);
  const [ids, setIds] = useState("");
  const [tradingAccountId, setTradingAccountId] = useState();
  const [rule, setRule] = useState([]);
  const [tableModal, setTableModal] = useState(false);

  const [ftd, setFtd] = useState(null);
  const [internalBrandId, setInternalBrandId] = useState(null);

  const [method, setMethod] = useState("");
  const [status, setStatus] = useState("");
  const [transactionMethod, setTransactionMethod] = useState("");

  const [isWalletLoading, setIsWalletLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [requestInfo, setRequestInfo] = useState(undefined);
  const [docInfo, setDocInfo] = useState([]);

  const { user, company } = useAuth();
  const { toLocalTime } = useTimezone();
  const { accounts, getAccounts, isLoading: isTraderAccountLoading } = useTraderAccounts(customerId);

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

  const localTableSetting = localStorage.getItem("tableSetting");
  const tableSetting = JSON.parse(localTableSetting);

  const { deskList } = useGetCustomerDesks({}, user);

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
          filter={ids}
          setFilter={(val) => {
            setIds(val);
            setCurrentPage(0);
          }}
        />
      ),
    },
    {
      id: "client_id",
      label: "Client ID",
      enabled: true,
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
      id: "client_country",
      label: "Client Country",
      enabled: true,
      render: (row) => (
        <Stack direction="row" gap={1} alignItems="center">
          <Iconify
            icon={`circle-flags:${row?.client_country?.toLowerCase()}`}
            width={24}
          />
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
            setDeskIds(val);
          }}
          value={deskIds}
          isExclude
          onChangeNon={(val) => {
            setNonDeskIds(val);
          }}
          valueNon={nonDeskIds}
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
          smallText
          options={statusList ?? []}
          setValue={(val) => {
            setStatus(val);
            setCurrentPage(0);
          }}
          value={status}
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
            setTransactionMethod(val);
            setCurrentPage(0);
          }}
          value={transactionMethod}
        />
      ),
    },
    {
      id: "transaction_owners",
      label: "Owners",
      enabled: true,
      headerRender: () => (
        <FilterMultiSelect
          label="OWNERS"
          withSearch
          placeholder="Owners..."
          options={agentList ?? []}
          onChange={(val) => {
            setAccountIds(val);
            setCurrentPage(0);
          }}
          value={accountIds}
          isExclude
          onChangeNon={(val) => {
            setNonAccountIds(val);
            setCurrentPage(0);
          }}
          valueNon={nonAccountIds}
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
      id: "trader_account",
      label: "Trader Account",
      enabled: true,
      headerRender: () => (
        <FilterSelect
          withSearch
          label="TRADER ACCOUNT"
          placeholder="Trader account..."
          options={
            accounts?.map((acc) => ({
              label: acc?.name,
              value: acc?.id,
            })) ?? []
          }
          setValue={(val) => {
            setTradingAccountId(val);
            setCurrentPage(0);
          }}
          value={tradingAccountId}
        />
      ),
      render: (row) => {
        return (
          <Typography variant="subtitle2">
            {row?.trading_account_id
              ? accounts?.find(
                  (acc) => acc?.id?.toString() === row?.trading_account_id?.toString()
                )?.name
              : ""}
          </Typography>
        );
      }
    },
    {
      id: "currency",
      label: "Currency",
      enabled: true,
      headerRender: () => (
        <FilterSelect
          label="CURRENCY"
          options={currentEnabledBrandCurrencies?.map((currency) => ({
            label: currency?.name,
            value: currency?.key,
            icon: currencyFlagMap[currency?.key],
          })) ?? []}
          setValue={(val) => {
            setCurrency(val);
          }}
          value={currency}
        />
      ),
      render: (row) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon={row?.currency ? currencyFlagMap[row?.currency] : currencyFlagMap[1]} />
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
      id: "payment_url",
      label: "Payment URL",
      enabled: true,
      render: (row) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle1">
            {row?.payment_url}
          </Typography>
          {row?.payment_url ? (
            <IconButton
              onClick={() => copyToClipboard(row?.payment_url)}
            >
              <ContentCopyIcon
                color="success"
                fontSize="small"
              />
            </IconButton>
          ) : null}
        </Stack>
      )
    },
    {
      id: "amount",
      label: "Margin",
      headerRender: () => (
        <FilterInput
          label="Margin"
          type="number"
          placeholder="Min Margin..."
          filter={amount}
          setFilter={(val) => {
            setAmount(val);
            setCurrentPage(0);
          }}
          isRange
          placeholder2="Max Margin..."
          filter2={lteAmount}
          setFilter2={(val) => {
            setLteAmount(val);
            setCurrentPage(0);
          }}
        />
      ),
      enabled: true,
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
          value={labelIds}
          onChange={(val) => {
            setLabelIds(val);
            setCurrentPage(0);
          }}
          isExclude
          valueNon={nonLabelIds}
          onChangeNon={(val) => {
            setNonLabelIds(val);
            setCurrentPage(0);
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
      id: "withdraw_request",
      label: "Withdraw Request",
      enabled: true,
      render: (row) => (
        <Stack>
          {
            !row?.deposit && (
              row?.requested ? (
                <SeverityPill color="error">Requested</SeverityPill>
              ) : row?.status === 4 ? (
                <SeverityPill color="success">Request canceled</SeverityPill>
              ) : null
            )
          }
        </Stack>
      )
    },
    {
      id: "acton_type",
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
            setCredit(val);
            setCurrentPage(0);
          }}
          value={credit}
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
          filter={approvedAtStart}
          setFilter={(val) => {
            if (val) {
              setApprovedAtStart(val);
            }
          }}
          filter2={approvedAtEnd}
          setFilter2={(val) => {
            if (val) {
              setApprovedAtEnd(val);
            }
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
            setInternalBrandId(val);
            setCurrentPage(0);
          }}
          value={internalBrandId}
        />
      ),
      render: (row) => {
        const brand = brandList?.find((brand) => brand?.value?.toString() === row?.internal_brand_id?.toString());
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
            setFtd(val);
            setCurrentPage(0);
          }}
          value={ftd}
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

  const traderAccountChip = useMemo(() => {
    const newChips =
      tradingAccountId && tradingAccountId !== "_empty"
        ? [
            {
              displayValue: accounts?.find((acc) => acc?.id == tradingAccountId)
                ?.name,
              value: tradingAccountId,
              label: "Trader Account",
            },
          ]
        : [];
    return newChips;
  }, [tradingAccountId, accounts]);

  const actionTypeChip = useMemo(() => {
    const newChips =
      method && method !== "_empty"
        ? [
            {
              displayValue: methodOption?.find((item) => item?.value === method)
                ?.label,
              value: method,
              label: "Action Type",
            },
          ]
        : [];
    return newChips;
  }, [method]);

  const internalBrandChip = useMemo(() => {
    const newChips = internalBrandId ? [{
      displayValue: brandList?.find((item) => item?.value == internalBrandId)?.label,
      value: internalBrandId,
      label: "Internal Brand Name",
    }] : [];
    return newChips;
  }, [internalBrandId, brandList]);

  const ftdChip = useMemo(() => {
    const newChips = ftd ? [{
      displayValue: ftd === "true" ? "FTD" : "Non FTD", 
      value: ftd,
      label: "FTD",
    }] : [];
    return newChips;
  }, [ftd]);

  const statusChip = useMemo(() => {
    const newChips =
      status && status !== "_empty"
        ? [
            {
              displayValue: statusList?.find((item) => item?.value === status)
                ?.label,
              value: status,
              label: "Status",
            },
          ]
        : [];
    return newChips;
  }, [status, statusList]);

  const transactionMethodChip = useMemo(() => {
    const newChips =
      transactionMethod && transactionMethod !== "_empty"
        ? [
            {
              displayValue: transactionMethodOptions?.find(
                (item) => item?.value === transactionMethod
              )?.label,
              value: transactionMethod,
              label: "Transaction Method",
            },
          ]
        : [];
    return newChips;
  }, [transactionMethod, transactionMethodOptions]);

  const currencyChip = useMemo(() => {
    const newChips =
      currency && currency !== "_empty"
        ? [
            {
              displayValue: currentEnabledBrandCurrencies?.find(
                (item) => item?.key === currency
              )?.name,
              value: currency,
              label: "Currency",
            },
          ]
        : [];
    return newChips;
  }, [currency, currentEnabledBrandCurrencies]);

  const creditChip = useMemo(() => {
    const newChips = credit?.map((item) => ({
      displayValue: item === "true" ? "Credit In" : "Credit Out",
      value: item,
      label: "Credit",
    }));
    return newChips;
  }, [credit]);

  const ownerChip = useMemo(
    () =>
      accountIds?.map((value) => ({
        displayValue: agentList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Owner",
      })),
    [accountIds, agentList]
  );

  const nonOwnerChip = useMemo(
    () =>
      nonAccountIds?.map((value) => ({
        displayValue: agentList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Exclude Owner",
      })),
    [nonAccountIds, agentList]
  );

  const labelChip = useMemo(
    () =>
      labelIds?.map((value) => ({
        displayValue: labelList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Label",
      })),
    [labelIds, labelList]
  );

  const nonLabelChip = useMemo(
    () =>
      nonLabelIds?.map((value) => ({
        displayValue: labelList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Exclude Label",
      })),
    [nonLabelIds, labelList]
  );

  const deskChip = useMemo(
    () =>
      deskIds?.map((value) => ({
        displayValue: deskList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Desk",
      })),
    [deskIds, deskList]
  );

  const nonDeskChip = useMemo(
    () =>
      nonDeskIds?.map((value) => ({
        displayValue: deskList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Exclude Desk",
      })),
    [nonDeskIds, deskList]
  );

  const approvedAtStartChip = useMemo(() => {
    return dateChipVal(approvedAtStart, "Approved At Start Date");
  }, [approvedAtStart]);

  const approvedAtEndChip = useMemo(() => {
    return dateChipVal(approvedAtEnd, "Approved At End Date");
  }, [approvedAtEnd]);

  const maxAmountChip = useMemo(() => {
    const newChips = amount
      ? [
          {
            displayValue: amount,
            value: amount,
            label: "Min Margin",
          },
        ]
      : [];
    return newChips;
  }, [amount]);

  const minAmountChip = useMemo(() => {
    const newChips = lteAmount
      ? [
          {
            displayValue: lteAmount,
            value: lteAmount,
            label: "Max Margin",
          },
        ]
      : [];
    return newChips;
  }, [lteAmount]);

  const idsChip = useMemo(() => {
    const newChips = ids
      ? [
          {
            displayValue: ids,
            value: ids,
            label: "ID",
          },
        ]
      : [];
    return newChips;
  }, [ids]);

  const getTransaction = async () => {
    setIsLoading(true);
    try {
      const params = {
        client_id: customerId,
        per_page: perPage,
        page: currentPage + 1,
      };
      if (isIB) params.ib_account = true;
      if (showInternal) params.internal = true;
      if (method?.length) {
        if (method === 'credit_in') {
          params.credit = true;
        } else if (method === 'credit_out') {
          params.credit = false;
        } else {
          params.deposit = method;
        }
      }
      if (currency) {
        params.currency = currency;
      }
      if (status?.length) {
        params.status = status;
      }
      if (accountIds?.length) {
        params.account_ids = accountIds;
      }
      if (nonAccountIds?.length) {
        params.non_account_ids = nonAccountIds;
      }
      if (labelIds?.length) {
        params.label_ids = labelIds;
      }
      if (nonLabelIds?.length) {
        params.non_label_ids = nonLabelIds;
      }
      if (deskIds?.length) {
        params.desk_ids = deskIds;
      }
      if (nonDeskIds?.length) {
        params.non_desk_ids = nonDeskIds;
      }
      if (ids?.length) {
        params.ids = [ids];
      }
      if (credit?.length === 1) {
        params.credit = credit?.includes("true") ? "true" : "false";
      }
      if (approvedAtStart?.length) {
        params.approved_at_start = approvedAtStart;
      }
      if (approvedAtEnd?.length) {
        params.approved_at_end = approvedAtEnd;
      }
      if (amount) {
        params.amount = amount;
      }
      if (lteAmount) {
        params.lte_amount = lteAmount;
      }
      if (tradingAccountId) {
        params.trading_account_id = tradingAccountId;
      }

      if (internalBrandId) {
        params.internal_brand_id = internalBrandId;
      }
      if (ftd) {
        params.ftd = ftd;
      }
      if (transactionMethod) {
        params.transaction_type = transactionMethod;
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
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  const getTransactionInfo = async () => {
    try {
      const params = {
        client_id: customerId,
        per_page: perPage,
        page: currentPage + 1,
      };
      if (isIB) params.ib_account = true;
      if (showInternal) params.internal = true;
      if (method?.length) {
        if (method === 'credit_in') {
          params.credit = true;
        } else if (method === 'credit_out') {
          params.credit = false;
        } else {
          params.deposit = method;
        }
      }
      if (currency) {
        params.currency = currency;
      }
      if (status?.length) {
        params.status = status;
      }
      if (accountIds?.length) {
        params.account_ids = accountIds;
      }
      if (nonAccountIds?.length) {
        params.non_account_ids = nonAccountIds;
      }
      if (labelIds?.length) {
        params.label_ids = labelIds;
      }
      if (nonLabelIds?.length) {
        params.non_label_ids = nonLabelIds;
      }
      if (deskIds?.length) {
        params.desk_ids = deskIds;
      }
      if (nonDeskIds?.length) {
        params.non_desk_ids = nonDeskIds;
      }
      if (ids?.length) {
        params.ids = [ids];
      }
      if (credit?.length === 1) {
        params.credit = credit?.includes("true") ? "true" : "false";
      }
      if (approvedAtStart?.length) {
        params.approved_at_start = approvedAtStart;
      }
      if (approvedAtEnd?.length) {
        params.approved_at_end = approvedAtEnd;
      }
      if (amount) {
        params.amount = amount;
      }
      if (lteAmount) {
        params.lte_amount = lteAmount;
      }
      if (tradingAccountId) {
        params.trading_account_id = tradingAccountId;
      }

      if (internalBrandId) {
        params.internal_brand_id = internalBrandId;
      }
      if (ftd) {
        params.ftd = ftd;
      }
      if (transactionMethod) {
        params.transaction_type = transactionMethod;
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
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getAgents = async () => {
    try {
      const params = {
        // desk_ids: user?.desk_ids,
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

  const handleCreateTransaction = async (data) => {
    try {
      setIsCreateLoading(true);
      const params = {
        ...data,
      };
      params["client_id"] = customerId;
      if (data?.deposit === "bonus") {
        params["bonus"] = true;
        params["deposit"] = false;
      }
      if (data?.deposit === "credit_out") {
        params["credit"] = true;
        params["deposit"] = false;
      }
      if (data?.deposit === "credit_in") {
        params["credit"] = true;
        params["deposit"] = true;
      }
      await customersApi.createTransaction(params);
      toast.success("Transaction created successfully!");
      // TODO: fix it
      setTimeout(() => {
        setIsCreateLoading(false);
        getTransaction();
        onGetClient();
      }, 1000);
    } catch (error) {
      setIsCreateLoading(false);
      console.error("error: ", error);
    }
    setModalOpen(false);
  };

  const handleUpdateTransaction = useCallback(async (id, data) => {
    try {
      await customersApi.updateTransaction(id, data);
      handleCloseEditModal();
      toast.success("Transaction successfully updated!");
      setTimeout(() => {
        onGetClient();
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, []);

  const handleOpenEditModal = useCallback((transaction) => {
    setEditTransaction(transaction);
    setEditModalOpen(true);
  }, []);

  const handleOpenDeleteTransaction = useCallback((transaction) => {
    setDeleteTransaction(transaction?.id);
    setDeleteModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditTransaction(null);
    setEditModalOpen(false);
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

  const handleWalletsRefresh = async () => {
    setIsWalletLoading(true);
    try {
      await customersApi.refreshWallets({
        client_id: customerId,
      });
      getTransaction();
      toast.success("Wallets successfully refreshed!");
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
    setIsWalletLoading(false);
  };
  
  useEffect(() => {
    getAccounts();
  }, [customerId]);

  useEffect(() => {
    getTransaction();
  }, [
    method,
    perPage,
    currentPage,
    status,
    accountIds,
    nonAccountIds,
    currency,
    credit,
    approvedAtEnd,
    approvedAtStart,
    labelIds,
    nonLabelIds,
    amount,
    lteAmount,
    ids,
    tradingAccountId,
    deskIds,
    nonDeskIds,
    showInternal,
    internalBrandId,
    ftd,
    transactionMethod,
    customFields,
    brandList,
    accounts
  ]);
  
  useEffect(() => {
    const actionColumn = {
      id: "edit",
      label: "Actions",
      enabled: true,
      render: (row) => (
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
            <IconButton
              size="small"
              sx={{ 
                color: 'primary.main',
                transition: 'background-color 0.1s ease-in-out',
                '&:hover': { backgroundColor: 'action.hover' } 
              }}
              onClick={() => handleOpenEditModal(row)}
            >
              <Iconify icon="mage:edit"/>
            </IconButton>
          ) : null}
          {user?.acc?.acc_e_delete_transaction === undefined ||
          user?.acc?.acc_e_delete_transaction ? (
            <IconButton
              size="small"
              sx={{ 
                color: 'error.main',
                transition: 'background-color 0.1s ease-in-out',
                '&:hover': { backgroundColor: 'action.hover' } 
              }}
              onClick={() => handleOpenDeleteTransaction(row)}
            >
              <Iconify icon="heroicons:trash"/>
            </IconButton>
          ) : null}
        </Stack>
      )
    };

    if (customFields?.length) {
        setDefaultColumn([...DEFAULT_COLUMN, ...customFields, actionColumn]);
    } else {
        setDefaultColumn([...DEFAULT_COLUMN, actionColumn]);
    }
  }, [
    rule,
    customFields,
    brandList,
    internalBrandId,
    ftd,
    credit,
    status,
    currency,
    method,
    labelList,
    agentList, 
    deskList,
    deskIds,
    nonDeskIds,
    labelIds,
    nonLabelIds,
    ids,
    accountIds,
    nonAccountIds,
    currentEnabledBrandCurrencies,
    accounts,
  ]);

  useEffect(() => {
    if (!isLoading) {
      const intervalId = setInterval(() => {
        getTransactionInfo();
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [
    method,
    perPage,
    currentPage,
    status,
    accountIds,
    nonAccountIds,
    currency,
    credit,
    approvedAtEnd,
    approvedAtStart,
    labelIds,
    nonLabelIds,
    amount,
    lteAmount,
    ids,
    tradingAccountId,
    deskIds,
    nonDeskIds,
    isLoading,
    showInternal,
    internalBrandId,
    ftd,
    transactionMethod,
    customFields,
    brandList,
    accounts
  ]);

  useEffect(() => {
    getAgents();
    getStatuses();
  }, []);

  const handleRemoveChip = (value, target) => {
    if (target === "owner") {
      const newOwner = [...accountIds].filter((item) => item !== value);
      setAccountIds(newOwner);
      setCurrentPage(0);
    }
    if (target === "non_owner") {
      const newNonOwner = [...nonAccountIds].filter((item) => item !== value);
      setNonAccountIds(newNonOwner);
      setCurrentPage(0);
    }
    if (target === "label") {
      const newLabel = [...labelIds].filter((item) => item !== value);
      setLabelIds(newLabel);
      setCurrentPage(0);
    }
    if (target === "non_label") {
      const newNonLabel = [...nonLabelIds].filter((item) => item !== value);
      setNonLabelIds(newNonLabel);
      setCurrentPage(0);
    }
    if (target === "desk") {
      const newDesk = [...deskIds].filter((item) => item !== value);
      setDeskIds(newDesk);
      setCurrentPage(0);
    }
    if (target === "non_desk") {
      const newNonDesk = [...nonDeskIds].filter((item) => item !== value);
      setNonDeskIds(newNonDesk);
      setCurrentPage(0);
    }
    if (target === "credit") {
      const newCredit = [...credit].filter((item) => item !== value);
      setCredit(newCredit);
      setCurrentPage(0);
    }
  };

  const updateRule = (rule) => {
    setRule(rule);

    if (tableSetting) {
      const updateSetting = {
        ...tableSetting,
        transactionCustomerTable: rule,
      };
      localStorage.setItem("tableSetting", JSON.stringify(updateSetting));
    } else {
      const tableSettings = {
        transactionCustomerTable: rule,
      };
      localStorage.setItem("tableSetting", JSON.stringify(tableSettings));
    }
  };

  useEffect(() => {
    setRule(tableSetting?.transactionCustomerTable ?? []);
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
      return defaultColumn?.map((item, index) => ({ 
        ...item, 
        order: index 
      }));
    }
  }, [
    rule,
    labelList,
    agentList, 
    deskList,
    deskIds,
    nonDeskIds,
    labelIds,
    nonLabelIds,
    ids,
    accountIds,
    nonAccountIds,
    currentEnabledBrandCurrencies,
    accounts,
    brandList,
    defaultColumn
  ]);

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

  return (
    <>
      <Stack gap={2}>
        <CustomerTransactionAISummary customerId={customerId} />
        <Card sx={isIB ? { 
            backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.5), 
            border: '1px dashed', 
            borderColor: 'divider', 
            boxShadow: 3,
            borderRadius: 5
          }: { backgroundColor: 'background.paper' }}>
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            justifyContent='space-between' 
            alignItems={{ xs: 'stretch', md: 'center' }}
            px={2} 
            py={2}
            gap={2}
          >
            <Stack direction='row' alignItems='center' gap={2} pl={1} flexWrap="wrap">
              <Typography variant="subtitle1" fontWeight={700}>Transaction</Typography>
              <Stack alignItems="center" direction="row" spacing={1}>
                <Chip label={`Net Deposit: ${customerInfo?.client?.net_deposit ?? "0.00"}`} size="small" />
              </Stack>
            </Stack>
            {!isIB && (
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              alignItems={{ xs: 'stretch', sm: 'center' }} 
              spacing={2}
              sx={{ 
                flexWrap: 'wrap',
                gap: { xs: 1, sm: 2 }
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={showInternal}
                    onChange={(e) => setShowInternal(e.target.checked)}
                    color="primary"
                  />
                }
                label="Show Internal"
                sx={{ 
                  mr: { xs: 0, sm: 2 },
                  alignSelf: { xs: 'flex-start', sm: 'center' }
                }}
              />
              <Button
                startIcon={(
                  <SvgIcon>
                    <Iconify icon="solar:transfer-horizontal-bold" />
                  </SvgIcon>
                )}
                variant="contained"
                onClick={() => setTransferFundModalOpen(true)}
                sx={{ 
                  minWidth: { xs: '100%', sm: 170 },
                  maxWidth: { xs: '100%', sm: 'none' }
                }}
              >
                Transfer Fund
              </Button>
              {user?.acc?.acc_v_client_refresh_wallets !== false && company?.company_wallet_system === true ? (
                <LoadingButton
                  loading={isWalletLoading}
                  disabled={isWalletLoading}
                  onClick={handleWalletsRefresh}
                  sx={{ 
                    width: { xs: '100%', sm: 170 },
                    maxWidth: { xs: '100%', sm: 'none' }
                  }}
                  startIcon={
                    isWalletLoading ? null : (
                      <Iconify
                        className="icon"
                        icon="ion:reload-sharp"
                        width={18}
                      />
                    )
                  }
                  type="submit"
                  variant="contained"
                >
                  Refresh Wallets
                </LoadingButton>
              ) : null}
              <Button
                onClick={() => setModalOpen(true)}
                startIcon={<Iconify icon="lucide:plus" width={24} />}
                variant="contained"
                sx={{ 
                  minWidth: { xs: '100%', sm: 'auto' },
                  maxWidth: { xs: '100%', sm: 'none' }
                }}
              >
                Add
              </Button>
              <Tooltip title="Table Setting">
              <IconButton 
                onClick={() => setTableModal(true)} 
                sx={{ 
                  '&:hover': { color: 'primary.main' },
                  alignSelf: { xs: 'flex-start', sm: 'center' }
                }}
              >
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
            </Stack>
            )}
          </Stack>
          {actionTypeChip?.length 
            || statusChip?.length
            || transactionMethodChip?.length
            || internalBrandChip?.length
            || ftdChip?.length
            || ownerChip?.length
            || currencyChip?.length
            || creditChip?.length
            || approvedAtEndChip?.length
            || approvedAtStartChip?.length
            || labelChip?.length
            || nonLabelChip?.length
            || maxAmountChip?.length
            || minAmountChip?.length
            || idsChip?.length
            || actionTypeChip?.length
            || traderAccountChip?.length
            || deskChip?.length
            || nonDeskChip?.length
            || customFilterChip?.length
            || nonOwnerChip?.length ? (
            <>
              <Divider />
              <Stack
                alignItems="center"
                direction="row"
                flexWrap="wrap"
                gap={1}
                sx={{ p: 2, px: 3 }}
              >
                <ChipSet
                  chips={actionTypeChip}
                  handleRemoveChip={() => setMethod("")}
                />
                <ChipSet
                  chips={internalBrandChip}
                  handleRemoveChip={() => setInternalBrandId(null)}
                />
                <ChipSet
                  chips={ftdChip}
                  handleRemoveChip={() => setFtd(null)}
                />
                <ChipSet
                  chips={statusChip}
                  handleRemoveChip={() => setStatus("")}
                />
                <ChipSet
                  chips={transactionMethodChip}
                  handleRemoveChip={() => setTransactionMethod("")}
                />
                <ChipSet
                  chips={currencyChip}
                  handleRemoveChip={() => setCurrency("")}
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
                  chips={creditChip}
                  handleRemoveChip={(value) => handleRemoveChip(value, "credit")}
                />
                <ChipSet
                  chips={traderAccountChip}
                  handleRemoveChip={() => setTradingAccountId(null)}
                />
                <ChipSet
                  chips={approvedAtStartChip}
                  handleRemoveChip={() => setApprovedAtStart("")}
                />
                <ChipSet
                  chips={approvedAtEndChip}
                  handleRemoveChip={() => setApprovedAtEnd("")}
                />
                <ChipSet
                  chips={maxAmountChip}
                  handleRemoveChip={() => setAmount(undefined)}
                />
                <ChipSet
                  chips={minAmountChip}
                  handleRemoveChip={() => setLteAmount(undefined)}
                />
                <ChipSet chips={idsChip} handleRemoveChip={() => setIds("")} />
                <ChipSet
                  chips={customFilterChip}
                  handleRemoveChip={handleRemoveCustomFilterChip}
                />
              </Stack>
            </>
          ) : null}
          <Scrollbar>
            <Table sx={{ 
              minWidth: { xs: 300, sm: 700 },
              '& .MuiTableCell-root': {
                padding: { xs: 1, sm: 2 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }
            }}>
              <TableHead>
                <TableRow sx={{ whiteSpace: { xs: "normal", sm: "nowrap" } }}>
                {tableColumn
                  ?.filter((item) => item.enabled)
                  ?.map((item) => (
                    <TableCell key={item.key}>
                      {item.headerRender ? (
                        item.headerRender()
                      ) : (
                        <Typography
                          sx={{
                            fontSize: { xs: 12, sm: 14 },
                            fontWeight: "600",
                            whiteSpace: { xs: "normal", sm: "nowrap" },
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
                {(isLoading || isTraderAccountLoading) ? (
                  <TableSkeleton cellCount={tableColumn?.filter((item) => item.enabled)?.length} rowCount={10} />
                ) : (
                  transactions?.map((transaction) => {
                    return (
                      <TableRow key={transaction?.id}>
                        {tableColumn
                          ?.filter((item) => item.enabled)
                          ?.map((column, index) => (
                            <TableCell
                              sx={{ 
                                whiteSpace: { xs: "normal", sm: "nowrap" },
                                wordBreak: { xs: "break-word", sm: "normal" }
                              }}
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
          </Scrollbar>
          {transactions?.length === 0 && !isLoading && !isTraderAccountLoading && <TableNoData />}
          <Divider />

          <Stack sx={{  
            flexDirection: { md: 'row', xs: 'column' }, 
            gap: { xs: 1, md: 0 }, 
            justifyContent: 'flex-end', 
            alignItems: { md: 'center', xs: 'stretch' },
            p: { xs: 1, sm: 2 }
          }}>
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
              onRowsPerPageChange={(event) => setPerPage(event?.target?.value)}
              page={currentPage ?? 0}
              rowsPerPage={perPage ?? 0}
              rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
              sx={{
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }
              }}
            />
          </Stack>

        </Card>
      </Stack>
      <CreateTransactionModal
        open={modalOpen}
        isLoading={isCreateLoading}
        onClose={() => setModalOpen(false)}
        handleCreateTransaction={handleCreateTransaction}
        customerId={customerId}
        currentEnabledBrandCurrencies={currentEnabledBrandCurrencies}
      />

      {(createTaskDialogOpen || createTicketDialogOpen) && (
        <CreateTaskDialog
          open={createTaskDialogOpen || createTicketDialogOpen}
          onClose={() => {
            setCreateTaskDialogOpen(false);
            setCreateTicketDialogOpen(false);
            setEditTransaction(null);
          }}
          transaction={editTransaction}
          isTicket={createTicketDialogOpen}
        />
      )}

      {editTransaction ? (
        <EditTransactionModal
          open={editModalOpen}
          onClose={handleCloseEditModal}
          transaction={editTransaction}
          handleUpdateTransaction={handleUpdateTransaction}
          onGetTransactions={getTransaction}
          customerId={customerId}
          currentEnabledBrandCurrencies={currentEnabledBrandCurrencies}
        />
      ) : null}
      {deleteTransaction ? (
        <DeleteModal
          isOpen={deleteModalOpen}
          title="Delete transaction"
          description="Are you sure you want to delete this transaction?"
          setIsOpen={setDeleteModalOpen}
          onDelete={handleTransactionDelete}
        />
      ) : null}
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

      <TableModal
        open={tableModal}
        onClose={() => setTableModal(false)}
        tableColumn={tableColumn}
        defaultColumn={defaultColumn}
        updateRule={updateRule}
      />

      <CreateTransferFundModal
        open={transferFundModalOpen}
        onClose={() => setTransferFundModalOpen(false)}
        customerId={customerId}
        currentEnabledBrandCurrencies={currentEnabledBrandCurrencies}
      />
    </>
  );
};
