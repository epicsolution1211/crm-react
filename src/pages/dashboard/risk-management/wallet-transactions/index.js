import { useEffect, useState, useMemo } from "react";

import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import DoNotDisturbAltOutlinedIcon from "@mui/icons-material/DoNotDisturbAltOutlined";
import IconButton from "@mui/material/IconButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
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

import FilterIcon from "src/icons/untitled-ui/duocolor/filter";
import { Iconify } from 'src/components/iconify';
import SettingIcon from "src/icons/untitled-ui/duocolor/setting";
import { ChipSet } from "src/components/customize/chipset";
import { FilterBoolean } from "src/components/customize/filter-boolean";
import { FilterDateTime } from "src/components/customize/filter-date-time";
import { FilterInput } from "src/components/customize/filter-input";
import { FilterModal } from "src/components/filter-settings-modal";
import { FilterSelect } from "src/components/customize/filter-select";
import { PageNumberSelect } from "src/components/pagination/page-selector";
import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { RouterLink } from "src/components/router-link";
import { Scrollbar } from "src/components/scrollbar";
import { Seo } from "src/components/seo";
import { SeverityPill } from "src/components/severity-pill";
import { TableModal } from "src/components/table-settings-modal";
import { TableNoData } from "src/components/table-empty";
import { TableSkeleton } from "src/components/table-skeleton";
import { WalletTransactionModal } from "src/sections/dashboard/dealing/wallet-transaction-detail";
import { authApi } from "src/api/auth";
import { paths } from "src/paths";
import { riskApi } from "src/api/risk";
import { useAuth } from "src/hooks/use-auth";
import { useDebounce } from "src/hooks/use-debounce";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { useTimezone } from "src/hooks/use-timezone";

const statuses = {
  1: "Pending",
  2: "Approved",
  3: "Rejected",
  4: "Canceled",
};

export const statusList = [
  { label: "Pending", value: "1" },
  { label: "Approved", value: "2" },
  { label: "Rejected", value: "3" },
  { label: "Canceled", value: "4" },
];

export const chainList = [
  { label: "Tron", value: "Tron" },
  { label: "Ethereum", value: "Ethereum" },
  { label: "Bitcoin", value: "Bitcoin" },
];

export const contractList = [
  { label: "trx", value: "trx" },
  { label: "trc20", value: "trc20" },
  { label: "eth", value: "eth" },
  { label: "erc20", value: "erc20" },
  { label: "btc", value: "btc" },
];

const Page = () => {
  usePageView();
  const { user } = useAuth();
  const { toLocalTime } = useTimezone();

  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState();
  const [perPage, setPerPage] = useState(100);
  const [currentPage, setCurrentPage] = useState(0);
  const [tableModal, setTableModal] = useState(false);
  const [rule, setRule] = useState([]);
  const [searchSetting, setSearchSetting] = useState({});

  const router = useRouter();

  useEffect(() => {
    if (
      user?.acc?.acc_v_risk_wallet_transactions === false ||
      user?.acc?.acc_v_risk_wallet_transactions === undefined
    ) {
      router?.push(paths.notFound);
    }
  }, [user]);
  const [walletTransactions, setWalletTransactions] = useState([]);

  const [transactionInfo, setTransactionInfo] = useState(undefined);
  const [showModal, setShowModal] = useState(false);

  const [selectedFilterValue, setSelectedFilterValue] = useState("none");

  const localTableSetting = localStorage.getItem("tableSetting");
  const tableSetting = JSON.parse(localTableSetting);
  const accountId = localStorage.getItem("account_id");

  const [filterModal, setFilterModal] = useState(false);

  const [text, setText] = useState("");
  const q = useDebounce(text, 300);
  const [filters, setFilters] = useState({});

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

  const updateFilters = (val) => setFilters((prev) => ({ ...prev, ...val }));

  const idChip = useMemo(() => {
    const newChips =
      filters?.id > 0
        ? [
          {
            displayValue: filters?.id,
            value: filters?.id,
            label: "Id",
          },
        ]
        : [];
    return newChips;
  }, [filters?.id]);

  const clientIdChip = useMemo(() => {
    const newChips =
      filters?.client_id > 0
        ? [
          {
            displayValue: filters?.client_id,
            value: filters?.client_id,
            label: "Client Id",
          },
        ]
        : [];
    return newChips;
  }, [filters?.client_id]);

  const companyIdChip = useMemo(() => {
    const newChips =
      filters?.company_id > 0
        ? [
          {
            displayValue: filters?.company_id,
            value: filters?.company_id,
            label: "Company Id",
          },
        ]
        : [];
    return newChips;
  }, [filters?.company_id]);

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

  const chainChip = useMemo(() => {
    const newChips = filters?.wallet_chain
      ? [
        {
          displayValue: filters?.wallet_chain,
          value: filters?.wallet_chain,
          label: "Wallet Chain",
        },
      ]
      : [];
    return newChips;
  }, [filters?.wallet_chain]);

  const contractChip = useMemo(() => {
    const newChips = filters?.contract
      ? [
        {
          displayValue: filters?.contract,
          value: filters?.contract,
          label: "Contract",
        },
      ]
      : [];
    return newChips;
  }, [filters?.contract]);

  const amountChip = useMemo(() => {
    const newChips =
      filters?.amount > 0
        ? [
          {
            displayValue: filters?.amount,
            value: filters?.amount,
            label: "Margin",
          },
        ]
        : [];
    return newChips;
  }, [filters?.amount]);

  const sourceIdChip = useMemo(() => {
    const newChips =
      filters?.source_id > 0
        ? [
          {
            displayValue: filters?.source_id,
            value: filters?.source_id,
            label: "Source Id",
          },
        ]
        : [];
    return newChips;
  }, [filters?.source_id]);

  const sourceAddressChip = useMemo(() => {
    const newChips = filters?.source_address
      ? [
        {
          displayValue: filters?.source_address,
          value: filters?.source_address,
          label: "Source Address",
        },
      ]
      : [];
    return newChips;
  }, [filters?.source_address]);

  const destinationIdChip = useMemo(() => {
    const newChips =
      filters?.destination_id > 0
        ? [
          {
            displayValue: filters?.destination_id,
            value: filters?.destination_id,
            label: "Destination Id",
          },
        ]
        : [];
    return newChips;
  }, [filters?.destination_id]);

  const destinationAddressChip = useMemo(() => {
    const newChips = filters?.destination_address
      ? [
        {
          displayValue: filters?.destination_address,
          value: filters?.destination_address,
          label: "Destination Address",
        },
      ]
      : [];
    return newChips;
  }, [filters?.destination_address]);

  const transactionHashChip = useMemo(() => {
    const newChips = filters?.transaction_hash
      ? [
        {
          displayValue: filters?.transaction_hash,
          value: filters?.transaction_hash,
          label: "Transaction Hash",
        },
      ]
      : [];
    return newChips;
  }, [filters?.transaction_hash]);

  const gasFeeChip = useMemo(() => {
    const newChips =
      filters?.gas_fee !== undefined
        ? [
          {
            displayValue: filters?.gas_fee ? "Yes" : "No",
            value: filters?.gas_fee,
            label: "Gas Fee",
          },
        ]
        : [];
    return newChips;
  }, [filters?.gas_fee]);

  const reTryChip = useMemo(() => {
    const newChips =
      filters?.t_retry !== undefined
        ? [
          {
            displayValue: filters?.t_retry ? "Yes" : "No",
            value: filters?.t_retry,
            label: "Retry",
          },
        ]
        : [];
    return newChips;
  }, [filters?.t_retry]);

  const submittedChip = useMemo(() => {
    const newChips =
      filters?.submited !== undefined
        ? [
          {
            displayValue: filters?.submited ? "Yes" : "No",
            value: filters?.submited,
            label: "Submitted",
          },
        ]
        : [];
    return newChips;
  }, [filters?.submited]);

  const createdStartChip = useMemo(() => {
    return dateChipVal(filters?.created_at_start, "Created At Start");
  }, [filters?.created_at_start]);

  const createdEndChip = useMemo(() => {
    return dateChipVal(filters?.created_at_end, "Created At End");
  }, [filters?.created_at_end]);

  const DefaultColumn = [
    {
      id: "id",
      label: "ID",
      enabled: true,
      render: (row) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle2">{row?.id}</Typography>
        </Stack>
      ),
      headerRender: () => (
        <FilterInput
          labelFont={14}
          label="ID"
          type="number"
          placeholder="ID..."
          filter={filters?.id}
          setFilter={(val) => {
            updateFilters({ id: val, currentPage: 0 });
          }}
        />
      ),
    },
    {
      id: "client_id",
      label: "Client",
      enabled: true,
      headerRender: () => (
        <FilterInput
          labelFont={14}
          label="CLIENT ID"
          type="number"
          placeholder="Client Id..."
          filter={filters?.client_id}
          setFilter={(val) => {
            updateFilters({ client_id: val, currentPage: 0 });
          }}
        />
      ),
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
      id: "client_name",
      label: "Client Name",
      enabled: true,
      render: (row) => (
        <Stack direction="row" gap={1} alignItems="center">
          <Iconify icon={`circle-flags:${row?.country?.toLowerCase()}`} width={24} />
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
      id: "company_id",
      label: "Company Id",
      enabled: true,
      render: (row) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle2">{row?.company_id}</Typography>
        </Stack>
      ),
      headerRender: () => (
        <FilterInput
          type="number"
          labelFont={14}
          label="COMPANY ID"
          placeholder="Company Id..."
          filter={filters?.company_id}
          setFilter={(val) => {
            updateFilters({ company_id: val, currentPage: 0 });
          }}
        />
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
              ? "warning"
              : row?.status === 2
                ? "success"
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
      id: "wallet_chain",
      label: "Wallet Chain",
      enabled: true,
      headerRender: () => (
        <FilterSelect
          label="WALLET CHAIN"
          options={chainList ?? []}
          setValue={(val) => {
            updateFilters({ wallet_chain: val, currentPage: 0 });
          }}
          value={filters?.wallet_chain}
        />
      ),
    },
    {
      id: "contract",
      label: "Contract",
      enabled: true,
      headerRender: () => (
        <FilterSelect
          label="CONTRACT"
          options={contractList ?? []}
          setValue={(val) => {
            updateFilters({ contract: val, currentPage: 0 });
          }}
          value={filters?.wallet_chain}
        />
      ),
    },
    {
      id: "amount",
      label: "Margin",
      enabled: true,
      headerRender: () => (
        <FilterInput
          type="number"
          labelFont={14}
          label="Margin"
          placeholder="Margin..."
          filter={filters?.amount}
          setFilter={(val) => {
            updateFilters({ amount: val, currentPage: 0 });
          }}
        />
      ),
    },
    {
      id: "source_id",
      label: "Source ID",
      enabled: true,
      headerRender: () => (
        <FilterInput
          type="number"
          labelFont={14}
          label="SOURCE ID"
          placeholder="Source Id..."
          filter={filters?.source_id}
          setFilter={(val) => {
            updateFilters({ source_id: val, currentPage: 0 });
          }}
        />
      ),
    },
    {
      id: "source_address",
      label: "Source Address",
      enabled: true,
      headerRender: () => (
        <FilterInput
          labelFont={14}
          label="SOURCE ADDRESS"
          placeholder="Source Address..."
          filter={filters?.source_address}
          setFilter={(val) => {
            updateFilters({ source_address: val, currentPage: 0 });
          }}
        />
      ),
    },
    {
      id: "destination_id",
      label: "Destination ID",
      enabled: true,
      headerRender: () => (
        <FilterInput
          type="number"
          labelFont={14}
          label="DESTINATION ID"
          placeholder="Destination Id..."
          filter={filters?.destination_id}
          setFilter={(val) => {
            updateFilters({ destination_id: val, currentPage: 0 });
          }}
        />
      ),
    },
    {
      id: "destination_address",
      label: "Destination Address",
      enabled: true,
      headerRender: () => (
        <FilterInput
          labelFont={14}
          label="DESTINATION ADDRESS"
          placeholder="Destination Address..."
          filter={filters?.destination_address}
          setFilter={(val) => {
            updateFilters({ destination_address: val, currentPage: 0 });
          }}
        />
      ),
    },
    {
      id: "transaction_hash",
      label: "Transaction Hash",
      enabled: true,
      headerRender: () => (
        <FilterInput
          labelFont={14}
          label="TRANSACTION HASH"
          placeholder="Transaction Hash..."
          filter={filters?.transaction_hash}
          setFilter={(val) => {
            updateFilters({ transaction_hash: val, currentPage: 0 });
          }}
        />
      ),
    },
    {
      id: "transaction_info",
      label: "Transaction Info",
      enabled: true,
      render: (row) => (
        <Stack direction="row" alignItems="center" gap={1}>
          <InfoOutlinedIcon fontSize="medium" />
          <Typography
            onClick={() => {
              setTransactionInfo({
                ...row?.transaction_info?.hash?.transaction,
                amount: row?.amount,
              });
              setShowModal(true);
            }}
            variant="subtitle2"
            sx={{
              cursor: "pointer",
              ":hover": { textDecoration: "underline" },
            }}
          >
            See Detail
          </Typography>
        </Stack>
      ),
    },
    {
      id: "gas_fee",
      label: "Gas fee",
      enabled: true,
      headerRender: () => (
        <FilterBoolean
          label="GAS FEE"
          value={filters?.gas_fee}
          setValue={(val) => {
            updateFilters({ gas_fee: val, currentPage: 0 });
          }}
        />
      ),
      render: (row) => {
        return (
          <Stack direction="row">
            {row?.gas_fee ? (
              <CheckCircleOutlineIcon fontSize="small" color="success" />
            ) : (
              <DoNotDisturbAltOutlinedIcon fontSize="small" color="info" />
            )}
          </Stack>
        );
      },
    },
    {
      id: "t_retry",
      label: "Retry",
      enabled: true,
      headerRender: () => (
        <FilterBoolean
          label="RETRY"
          value={filters?.t_retry}
          setValue={(val) => {
            updateFilters({ t_retry: val, currentPage: 0 });
          }}
        />
      ),
      render: (row) => {
        return (
          <Stack direction="row">
            {row?.t_retry ? (
              <CheckCircleOutlineIcon fontSize="small" color="success" />
            ) : (
              <DoNotDisturbAltOutlinedIcon fontSize="small" color="info" />
            )}
          </Stack>
        );
      },
    },
    {
      id: "submited",
      label: "Submitted",
      enabled: true,
      headerRender: () => (
        <FilterBoolean
          label="SUBMITTED"
          value={filters?.submited}
          setValue={(val) => {
            updateFilters({ submited: val, currentPage: 0 });
          }}
        />
      ),
      render: (row) => {
        return (
          <Stack direction="row">
            {row?.submited ? (
              <CheckCircleOutlineIcon fontSize="small" color="success" />
            ) : (
              <DoNotDisturbAltOutlinedIcon fontSize="small" color="info" />
            )}
          </Stack>
        );
      },
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
  ];

  const getWalletTransaction = async () => {
    try {
      const params = {
        page: currentPage + 1,
        per_page: perPage ?? 100,
        ...filters,
      };
      const res = await riskApi.getWalletTransactions(params);
      setWalletTransactions(res?.transactions ?? []);
      setTotalCount(res?.total_count);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getWalletTransaction();
  }, []);

  const getTrx = async () => {
    setIsLoading(true);
    try {
      await getWalletTransaction();
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
    if (
      searchSetting?.["wallet-transaction"]?.length &&
      selectedFilterValue !== "none"
    ) {
      const result = searchSetting["wallet-transaction"]?.find(
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
        getWalletTransaction();
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isLoading]);

  useEffect(() => {
    getTrx();
  }, [perPage, currentPage, q, filters]);

  const updateRule = (rule) => {
    setRule(rule);

    if (tableSetting) {
      const updateSetting = {
        ...tableSetting,
        walletTransactionTable: rule,
      };
      localStorage.setItem("tableSetting", JSON.stringify(updateSetting));
    } else {
      const tableSettings = {
        walletTransactionTable: rule,
      };
      localStorage.setItem("tableSetting", JSON.stringify(tableSettings));
    }
  };

  useEffect(() => {
    setRule(tableSetting?.walletTransactionTable ?? []);
  }, []);

  const tableColumn = useMemo(() => {
    if (rule?.length) {
      const updateColumn = DefaultColumn?.map((item) => ({
        ...item,
        enabled: rule?.find((ruleItem) => item?.id === ruleItem?.id)?.enabled,
        order: rule?.find((ruleItem) => item?.id === ruleItem?.id)?.order,
      }))?.sort((a, b) => a.order - b.order);
      return updateColumn;
    } else {
      return DefaultColumn?.map((item, index) => ({ ...item, order: index }));
    }
  }, [rule, filters]);

  const isDefaultSetting =
    JSON.stringify(
      DefaultColumn?.map((item, index) => ({
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
    !!statusChip?.length ||
    !!idChip?.length ||
    !!companyIdChip?.length ||
    !!contractChip?.length ||
    !!amountChip?.length ||
    !!sourceIdChip?.length ||
    !!sourceAddressChip?.length ||
    !!destinationIdChip?.length ||
    !!destinationAddressChip?.length ||
    !!transactionHashChip?.length ||
    !!gasFeeChip?.length ||
    !!clientIdChip?.length ||
    !!reTryChip?.length ||
    !!createdStartChip?.length ||
    !!createdEndChip?.length ||
    !!submittedChip?.length;

  return (
    <>
      <Seo title={`Dashboard: Wallet Transactions`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}
      >
        <Container maxWidth="xxl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Wallet Transactions</Typography>
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
                      sx={{ color: 'white', mr: 1 }}
                    />
                  )}
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
                        chips={idChip}
                        handleRemoveChip={() =>
                          updateFilters({ id: undefined })
                        }
                      />
                      <ChipSet
                        chips={clientIdChip}
                        handleRemoveChip={() =>
                          updateFilters({ client_id: undefined })
                        }
                      />
                      <ChipSet
                        chips={companyIdChip}
                        handleRemoveChip={() =>
                          updateFilters({ company_id: undefined })
                        }
                      />
                      <ChipSet
                        chips={statusChip}
                        handleRemoveChip={() =>
                          updateFilters({ status: undefined })
                        }
                      />
                      <ChipSet
                        chips={chainChip}
                        handleRemoveChip={() =>
                          updateFilters({ wallet_chain: undefined })
                        }
                      />
                      <ChipSet
                        chips={contractChip}
                        handleRemoveChip={() =>
                          updateFilters({ contract: undefined })
                        }
                      />
                      <ChipSet
                        chips={amountChip}
                        handleRemoveChip={() =>
                          updateFilters({ amount: undefined })
                        }
                      />
                      <ChipSet
                        chips={sourceIdChip}
                        handleRemoveChip={() =>
                          updateFilters({ source_id: undefined })
                        }
                      />
                      <ChipSet
                        chips={sourceAddressChip}
                        handleRemoveChip={() =>
                          updateFilters({ source_address: undefined })
                        }
                      />
                      <ChipSet
                        chips={destinationIdChip}
                        handleRemoveChip={() =>
                          updateFilters({ destination_id: undefined })
                        }
                      />
                      <ChipSet
                        chips={destinationAddressChip}
                        handleRemoveChip={() =>
                          updateFilters({ destination_address: undefined })
                        }
                      />
                      <ChipSet
                        chips={transactionHashChip}
                        handleRemoveChip={() =>
                          updateFilters({ transaction_hash: undefined })
                        }
                      />
                      <ChipSet
                        chips={gasFeeChip}
                        handleRemoveChip={() =>
                          updateFilters({ gas_fee: undefined })
                        }
                      />
                      <ChipSet
                        chips={reTryChip}
                        handleRemoveChip={() =>
                          updateFilters({ t_retry: undefined })
                        }
                      />
                      <ChipSet
                        chips={submittedChip}
                        handleRemoveChip={() =>
                          updateFilters({ submited: undefined })
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
                    </Stack>
                  </>
                ) : null}
                <Box sx={{ position: "relative" }}>
                  <Scrollbar>
                    <Table sx={{ minWidth: 700 }}>
                      <TableHead>
                        <TableRow sx={{ whiteSpace: "nowrap" }}>
                          {tableColumn
                            ?.filter((item) => item.enabled)
                            ?.map((item, index) => (
                              <TableCell key={index}>
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
                        {isLoading && walletTransactions.length == 0 ? (
                          <TableSkeleton cellCount={18} rowCount={10} />
                        ) : (
                          walletTransactions?.map((transaction) => {
                            return (
                              <TableRow key={transaction?.id}>
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
                    {!isLoading && walletTransactions.length === 0 && (
                      <TableNoData label="No transaction." />
                    )}
                  </Scrollbar>
                </Box>
              <Divider />
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
                  onRowsPerPageChange={(event) =>
                    setPerPage(event?.target?.value)
                  }
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

      <FilterModal
        variant="wallet-transaction"
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
        defaultColumn={DefaultColumn}
        updateRule={updateRule}
      />
      <WalletTransactionModal
        open={showModal}
        onClose={() => {
          setTransactionInfo(undefined);
          setShowModal(false);
        }}
        transactionInfo={transactionInfo}
      />
    </>
  );
};

export default Page;
