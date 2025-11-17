import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Badge from "@mui/material/Badge";
import Table from "@mui/material/Table";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import SvgIcon from "@mui/material/SvgIcon";
import Tooltip from "@mui/material/Tooltip";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import TablePagination from "@mui/material/TablePagination";
import { alpha } from '@mui/material/styles';

import { paths } from "src/paths";
import { userApi } from "src/api/user";
import { riskApi } from "src/api/risk";
import { authApi } from "src/api/auth";
import { Iconify } from 'src/components/iconify';
import { useRouter } from "src/hooks/use-router";
import { useAuth } from "src/hooks/use-auth";
import { thunks } from "src/thunks/customers";
import { settingsApi } from "src/api/settings";
import CustomerBalance from "./customer-balance";
import { Scrollbar } from "src/components/scrollbar";
import { TableNoData } from "src/components/table-empty";
import { MultiSelect } from "src/components/multi-select";
import { ChipSet } from "src/components/customize/chipset";
import { SeverityPill } from "src/components/severity-pill";
import { TableSkeleton } from "src/components/table-skeleton";
import { useTraderAccounts } from "./customer-trader-accounts";
import { TableModal } from "src/components/table-settings-modal";
import SettingIcon from "src/icons/untitled-ui/duocolor/setting";
import { FilterInput } from "src/components/customize/filter-input";
import { DeleteModal } from "src/components/customize/delete-modal";
import { FilterSelect } from "src/components/customize/filter-select";
import { PositionLabelsDialog } from "src/components/position-labels-dialog";
import { FilterDateTime } from "src/components/customize/filter-date-time";
import { FilterMultiSelect } from "src/components/customize/filter-multi-select";
import { PageNumberSelect } from "src/components/pagination/page-selector";
import { useTimezone } from "src/hooks/use-timezone";

const directions = {
  0: "OWNED",
  1: "BUY",
  2: "SELL",
};

const statuses = {
  0: "Pending",
  1: "Active",
  2: "Closed",
};

const currencies = {
  1: "$",
  2: "€",
  3: "£",
  4: "CA$",
  5: "A$",
  6: "د.إ",
  7: "₹",
};

const market = {
  fx: "Forex",
  commodities: "Commodities",
  crypto: "Crypto",
  stocks: "Stocks",
  cfd: "CFD",
};

const statusOptions = [
  {
    label: "Active",
    value: "1",
  },
  {
    label: "Pending",
    value: "0",
  },
  {
    label: "Closed",
    value: "2",
  },
];

const directionOptions = [
  {
    label: "Buy",
    value: "0",
  },
  {
    label: "Sell",
    value: "1",
  },
];

const marketOptions = [
  {
    label: "Forex",
    value: "fx",
  },
  {
    label: "Commodities",
    value: "commodities",
  },
  {
    label: "Crypto",
    value: "crypto",
  },
  {
    label: "Stocks",
    value: "stocks",
  },
  {
    label: "CFD",
    value: "cfd",
  },
];

const useTeams = () => {
  const [teamList, setTeamList] = useState([]);

  const getTeamsInfo = async () => {
    try {
      const res = await settingsApi.getSkillTeams("*");
      const teamInfo = res?.map(({ team }) => ({
        label: team?.name,
        value: team?.id,
      }));
      setTeamList([...teamInfo]);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getTeamsInfo();
  }, []);

  return teamList;
};

const useTickers = () => {
  const [tickerList, setTickerList] = useState([]);

  const getTickersInfo = async () => {
    try {
      const res = await settingsApi.getTickers();
      setTickerList(
        res?.tickers?.map((ticker) => ({
          label: ticker?.base_currency_symbol + " - " + ticker?.currency_symbol,
          value: ticker?.id,
        }))
      );
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getTickersInfo();
  }, []);

  return tickerList;
};

export const CustomerPosition = ({ customerId, currency, isIB = false }) => {
  const accountId = localStorage.getItem("account_id");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toLocalTime } = useTimezone();
  const { accounts } = useTraderAccounts(customerId);

  const router = useRouter();
  const teams = useTeams();
  const tickers = useTickers();
  const dispatch = useDispatch();

  const [rule, setRule] = useState([]);
  const [labelList, setLabelList] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [tableModal, setTableModal] = useState(false);
  const [tableSetting, setTableSetting] = useState({});
  const [positionToClose, setPositionToClose] = useState();
  const [positionToDelete, setPositionToDelete] = useState();
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const customerState = useSelector((state) => state.customers);
  const filters = useSelector((state) => state.customers.positionFilters);
  const updateFilters = (data) => dispatch(thunks.setPositionFilters(data));

  useEffect(() => {
    const customerPositionPerPage = localStorage.getItem("customerPositionPerPage");

    if (customerPositionPerPage) {
      updateFilters({ perPage: customerPositionPerPage });
    }
  }, []);

  const getLabels = async () => {
    try {
      const res = await riskApi.getPositionLabels();
      const labelList = res?.labels
        ?.map(({ label }) => ({
          label: label?.name,
          value: label?.id?.toString(),
        }))
        ?.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.label === item?.label)
        );
      setLabelList(labelList);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getTableSetting = async () => {
    setIsLoading(true);
    try {
      const localTableSetting = localStorage.getItem("tableSetting");
      const { account } = await authApi.me({ accountId });
      if (account?.column_setting) {
        setTableSetting(JSON.parse(account?.column_setting));
        setRule(JSON.parse(account?.column_setting)?.positionTable ?? []);
      } else if (localTableSetting) {
        const { account: _account } = await userApi.updateUser(accountId, {
          column_setting: localTableSetting,
        });
        setTableSetting(JSON.parse(_account?.column_setting));
        setRule(JSON.parse(_account?.column_setting)?.positionTable ?? []);
      }
    } catch (error) {
      console.error("error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPositions = async () => {
    try {
      let request = {
        page: filters?.currentPage + 1,
        per_page: filters?.perPage,
        market: filters?.market,
        label_ids: filters?.labels,
        non_label_ids: filters?.nonLabels,
        ...filters,
      };
      delete request.marketValue;
      delete request.labels;
      delete request.non_labels;
      delete request.currentPage;
      delete request.perPage;
      if (filters?.status?.includes("0")) {
        request.pending = 1;
      }
      if (filters?.status?.includes("1")) {
        request.active = 1;
      }
      if (filters?.status?.includes("2")) {
        request.closed = 1;
      }
      delete request.status;
      if (filters?.direction?.includes("0")) {
        request.buy = 1;
      }
      if (filters?.direction?.includes("1")) {
        request.sell = 1;
      }
      delete request.direction;
      request["client_id"] = customerId;
      if (isIB) request["ib_account"] = true;
      await dispatch(thunks.getCustomerDealing(request));
    } catch (error) {
      console.error("error: ", error);
    } finally {
    }
  };

  const getPositionInfo = async () => {
    setIsLoading(true);
    await getPositions();
    setIsLoading(false);
  };

  useEffect(() => {
    getPositionInfo();
  }, [customerId, filters]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getPositions();
    }, 3000);
    return () => clearInterval(intervalId);
  }, [customerId, filters]);

  useEffect(() => {
    getLabels();
  }, []);

  const handleEditPageOpen = (id) => {
    navigate(
      `${paths.dashboard.risk.positions}/${id}?backlink=customer&customerId=${customerId}`,
      { state: { customerId } }
    );
  };

  const handleCreatePageOpen = () => {
    navigate(
      `${paths.dashboard.risk.positions}/create?backlink=customer&customerId=${customerId}`,
      { state: { customerId } }
    );
  };

  useEffect(() => {
    getTableSetting();
  }, []);

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

  const currentChip = useMemo(() => {
    const newChips = filters?.status?.map((item) => ({
      displayValue: item === "0" ? "Pending" : "1" ? "Active" : "Closed",
      value: item,
      label: "Status",
    }));
    return newChips;
  }, [filters?.status]);

  const currentDirection = useMemo(() => {
    const newChips = filters?.direction?.map((item) => ({
      displayValue: item === "0" ? "Buy" : "Sell",
      value: item,
      label: "Direction",
    }));
    return newChips;
  }, [filters?.direction]);

  const labelChip = useMemo(
    () =>
      filters?.labels?.map((value) => ({
        displayValue: labelList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Label",
      })),
    [filters?.labels, labelList]
  );

  const nonLabelChip = useMemo(
    () =>
      filters?.nonLabels?.map((value) => ({
        displayValue: labelList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Exclude Label",
      })),
    [filters?.nonLabels, labelList]
  );

  const marketChip = useMemo(() => {
    const newChips =
      filters?.market && filters?.market !== "_empty"
        ? [
          {
            displayValue: market[filters?.market],
            value: filters?.market,
            label: "Market",
          },
        ]
        : [];
    return newChips;
  }, [filters?.market]);

  const traderAccountChip = useMemo(() => {
    const newChips =
      filters?.trading_account_id && filters?.trading_account_id !== "_empty"
        ? [
          {
            displayValue: accounts?.find(acc => acc?.id == filters?.trading_account_id)?.name,
            value: filters?.trading_account_id,
            label: "Trader Account",
          },
        ]
        : [];
    return newChips;
  }, [filters?.trading_account_id, accounts]);

  const alertChip = useMemo(() => {
    const newChips =
      filters?.alart_status && filters?.alart_status !== "_empty"
        ? [
          {
            displayValue: [
              {
                label: "Margin Call",
                value: "1",
              },
            ].find((item) => item.value === filters?.alart_status)?.label,
            value: filters?.alart_status,
            label: "Alert",
          },
        ]
        : [];
    return newChips;
  }, [filters?.alart_status]);

  const idChip = useMemo(() => {
    const newChips = filters?.id
      ? [
        {
          displayValue: filters?.id,
          value: filters?.id,
          label: "ID",
        },
      ]
      : [];
    return newChips;
  }, [filters?.id]);

  const createdStartChip = useMemo(() => {
    return dateChipVal(filters?.created_at_start, "Created At Start");
  }, [filters?.created_at_start]);

  const createdEndChip = useMemo(() => {
    return dateChipVal(filters?.created_at_end, "Created At End");
  }, [filters?.created_at_end]);

  const closedStartChip = useMemo(() => {
    return dateChipVal(filters?.closed_at_start, "Closed At Start");
  }, [filters?.closed_at_start]);

  const closedEndChip = useMemo(() => {
    return dateChipVal(filters?.closed_at_end, "Closed At End");
  }, [filters?.closed_at_end]);

  const openedStartChip = useMemo(() => {
    return dateChipVal(filters?.opened_at_start, "Opened At Start");
  }, [filters?.opened_at_start]);

  const openedEndChip = useMemo(() => {
    return dateChipVal(filters?.opened_at_end, "Opened At End");
  }, [filters?.opened_at_end]);

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

  const maxSwapChip = useMemo(() => {
    const newChips = filters?.swap
      ? [
        {
          displayValue: filters?.swap,
          value: filters?.swap,
          label: "Max Swap",
        },
      ]
      : [];
    return newChips;
  }, [filters?.swap]);

  const minSwapChip = useMemo(() => {
    const newChips = filters?.lte_swap
      ? [
        {
          displayValue: filters?.lte_swap,
          value: filters?.lte_swap,
          label: "Min Swap",
        },
      ]
      : [];
    return newChips;
  }, [filters?.lte_swap]);

  const maxUnitChip = useMemo(() => {
    const newChips = filters?.unit
      ? [
        {
          displayValue: filters?.unit,
          value: filters?.unit,
          label: "Max Unit",
        },
      ]
      : [];
    return newChips;
  }, [filters?.unit]);

  const minUnitChip = useMemo(() => {
    const newChips = filters?.lte_unit
      ? [
        {
          displayValue: filters?.lte_unit,
          value: filters?.lte_unit,
          label: "Min Unit",
        },
      ]
      : [];
    return newChips;
  }, [filters?.lte_unit]);

  const leverageChip = useMemo(() => {
    const newChips = filters?.leverage
      ? [
        {
          displayValue: filters?.leverage,
          value: filters?.leverage,
          label: "Leverage",
        },
      ]
      : [];
    return newChips;
  }, [filters?.leverage]);

  const maxProfitChip = useMemo(() => {
    const newChips = filters?.profit
      ? [
        {
          displayValue: filters?.profit,
          value: filters?.profit,
          label: "Max Profit",
        },
      ]
      : [];
    return newChips;
  }, [filters?.profit]);

  const minProfitChip = useMemo(() => {
    const newChips = filters?.lte_profit
      ? [
        {
          displayValue: filters?.lte_profit,
          value: filters?.lte_profit,
          label: "Min Profit",
        },
      ]
      : [];
    return newChips;
  }, [filters?.lte_profit]);

  const maxBalanceChip = useMemo(() => {
    const newChips = filters?.balance
      ? [
        {
          displayValue: filters?.balance,
          value: filters?.balance,
          label: "Max Balance",
        },
      ]
      : [];
    return newChips;
  }, [filters?.balance]);

  const minBalanceChip = useMemo(() => {
    const newChips = filters?.lte_balance
      ? [
        {
          displayValue: filters?.lte_balance,
          value: filters?.lte_balance,
          label: "Min Balance",
        },
      ]
      : [];
    return newChips;
  }, [filters?.lte_balance]);

  const maxEquityChip = useMemo(() => {
    const newChips = filters?.equity
      ? [
        {
          displayValue: filters?.equity,
          value: filters?.equity,
          label: "Max Equity",
        },
      ]
      : [];
    return newChips;
  }, [filters?.equity]);

  const minEquityChip = useMemo(() => {
    const newChips = filters?.lte_equity
      ? [
        {
          displayValue: filters?.lte_equity,
          value: filters?.lte_equity,
          label: "Min Equity",
        },
      ]
      : [];
    return newChips;
  }, [filters?.lte_equity]);

  const maxTotalPLChip = useMemo(() => {
    const newChips = filters?.total_pl
      ? [
        {
          displayValue: filters?.total_pl,
          value: filters?.total_pl,
          label: "Max Total P/L",
        },
      ]
      : [];
    return newChips;
  }, [filters?.total_pl]);

  const tickerChip = useMemo(
    () => {
      const newChip = [{
        displayValue: tickers?.find(item => item?.value === filters?.ticker_id)?.label,
        value: filters?.ticker_id,
        label: "Ticker",
      }];
      if (filters?.ticker_id) return newChip;
      return [];
    },
    [filters?.ticker_id, tickers]
  );

  const minTotalPLChip = useMemo(() => {
    const newChips = filters?.lte_total_pl
      ? [
        {
          displayValue: filters?.lte_total_pl,
          value: filters?.lte_total_pl,
          label: "Min Total P/L",
        },
      ]
      : [];
    return newChips;
  }, [filters?.lte_total_pl]);

  const maxMarginChip = useMemo(() => {
    const newChips = filters?.margin_level
      ? [
        {
          displayValue: filters?.margin_level,
          value: filters?.margin_level,
          label: "Max Margin Level",
        },
      ]
      : [];
    return newChips;
  }, [filters?.margin_level]);

  const minMarginChip = useMemo(() => {
    const newChips = filters?.lte_margin_level
      ? [
        {
          displayValue: filters?.lte_margin_level,
          value: filters?.lte_margin_level,
          label: "Min Margin Level",
        },
      ]
      : [];
    return newChips;
  }, [filters?.lte_margin_level]);

  const maxFreeMarginChip = useMemo(() => {
    const newChips = filters?.free_margin
      ? [
        {
          displayValue: filters?.free_margin,
          value: filters?.free_margin,
          label: "Max Free Margin",
        },
      ]
      : [];
    return newChips;
  }, [filters?.free_margin]);

  const minFreeMarginChip = useMemo(() => {
    const newChips = filters?.lte_free_margin
      ? [
        {
          displayValue: filters?.lte_margin_level,
          value: filters?.lte_margin_level,
          label: "Min Free Margin",
        },
      ]
      : [];
    return newChips;
  }, [filters?.lte_free_margin]);

  const maxUsedMarginChip = useMemo(() => {
    const newChips = filters?.used_margin
      ? [
        {
          displayValue: filters?.used_margin,
          value: filters?.used_margin,
          label: "Max Free Margin",
        },
      ]
      : [];
    return newChips;
  }, [filters?.used_margin]);

  const minUsedMarginChip = useMemo(() => {
    const newChips = filters?.lte_used_margin
      ? [
        {
          displayValue: filters?.lte_used_margin,
          value: filters?.lte_used_margin,
          label: "Min Used Margin",
        },
      ]
      : [];
    return newChips;
  }, [filters?.lte_used_margin]);

  const defaultColumn = [
    {
      id: "id",
      label: "ID",
      enabled: true,
      headerRender: () => (
        <FilterInput
          labelFont={14}
          label="ID"
          placeholder="ID..."
          filter={filters?.id}
          setFilter={(val) => {
            updateFilters({ id: val });
          }}
        />
      ),
      render: (row) => (
        <Stack direction="row" alignItems="center" gap={1}>
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            {row?.id}
          </Typography>
          <Tooltip title="View History">
            <IconButton
              onClick={() => {
                router.push(paths.dashboard.risk.history.replace(":target", "position").replace(":id", row?.id));
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
    },
    {
      id: "alert",
      label: "Alert",
      enabled: true,
      headerRender: () => (
        <FilterSelect
          label="ALERT"
          options={
            [
              {
                label: "Margin Call",
                value: "1",
              },
            ] ?? []
          }
          setValue={(val) => {
            updateFilters({ alart_status: val });
          }}
          value={filters?.alart_status}
        />
      ),
      render: (row) => (
        <SeverityPill
          color={
            row?.client_status?.message === "danger"
              ? "error"
              : row?.client_status?.message === "warning"
                ? "warning"
                : "info"
          }
        >
          {row?.client_status?.code === 1 ? "Margin Call" : ""}
        </SeverityPill>
      ),
    },
    {
      id: "direction",
      label: "Direction",
      enabled: true,
      headerRender: () => (
        <MultiSelect
          noPadding
          label="DIRECTION"
          options={directionOptions}
          onChange={(val) => updateFilters({ direction: val })}
          value={filters?.direction}
        />
      ),
      render: (row) => (
        <Typography
          variant="subtitle2"
          sx={{
            color:
              row?.position_type === 0
                ? "#06AED4"
                : row?.position_type === 1
                  ? "#10B981"
                  : "#F04438",
          }}
        >
          {directions[row?.position_type]}
        </Typography>
      ),
    },
    {
      id: "trading_account_id",
      label: "Trader Account",
      enabled: true,
      headerRender: () => (
        <FilterSelect
          withSearch
          label="TRADER ACCOUNT"
          placeholder="Trader account..."
          options={accounts?.map(acc => ({ label: acc?.name, value: acc?.id })) ?? []}
          setValue={(val) => {
            updateFilters({ trading_account_id: val });
          }}
          value={filters?.trading_account_id}
        />
      ),
      render: (row) => (
        <Typography
          variant="subtitle2"
        >
          {row?.trading_account_id ? accounts?.find(acc => acc?.id == row?.trading_account_id)?.name : ""}
        </Typography>
      ),
    },
    {
      id: "created_time",
      label: "Created Time",
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
      id: "closed_at",
      label: "Closed Time",
      enabled: true,
      headerRender: () => (
        <FilterDateTime
          label="CLOSED TIME"
          isRange
          subLabel1="Start"
          subLabel2="End"
          filter={filters?.closed_at_start}
          setFilter={(val) => {
            updateFilters({ closed_at_start: val });
          }}
          filter2={filters?.closed_at_end}
          setFilter2={(val) => {
            updateFilters({ closed_at_end: val });
          }}
        />
      ),
      render: (row) => (
        <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
          {toLocalTime(row?.closed_at)}
        </Typography>
      ),
    },
    {
      id: "opened_time",
      label: "Opened Time",
      enabled: true,
      headerRender: () => (
        <FilterDateTime
          label="OPENED TIME"
          isRange
          subLabel1="Start"
          subLabel2="End"
          filter={filters?.opened_at_start}
          setFilter={(val) => {
            updateFilters({ opened_at_start: val });
          }}
          filter2={filters?.opened_at_end}
          setFilter2={(val) => {
            updateFilters({ opened_at_end: val });
          }}
        />
      ),
      render: (row) => (
        <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
          {toLocalTime(row?.opened_at)}
        </Typography>
      ),
    },
    {
      id: "symbol",
      label: "Symbol",
      enabled: true,
      headerRender: () => (
        <FilterSelect
          withSearch
          label="SYMBOL"
          placeholder="Ticker..."
          options={tickers ?? []}
          setValue={(val) => {
            updateFilters({ ticker_id: val });
          }}
          value={filters?.ticker_id}
        />
      ),
      render: (row) =>
        (row?.ticker?.base_currency_symbol === null || row?.ticker?.currency_symbol === null) 
          ? row?.ticker_sym 
          : 
        `${row?.ticker?.base_currency_symbol}-${row?.ticker?.currency_symbol}`,
    },
    {
      id: "status",
      label: "Status",
      enabled: true,
      headerRender: () => (
        <MultiSelect
          noPadding
          label="STATUS"
          options={statusOptions}
          onChange={(val) => updateFilters({ status: val })}
          value={filters?.status}
        />
      ),
      render: (row) => (
        <SeverityPill
          color={
            row?.status === 0
              ? "warning"
              : row?.status === 1
                ? "success"
                : "error"
          }
        >
          {statuses[row.status]}
        </SeverityPill>
      ),
    },
    {
      id: "market",
      label: "Market",
      enabled: true,
      headerRender: () => (
        <FilterSelect
          withSearch
          label="MARKET"
          placeholder="Market..."
          options={marketOptions ?? []}
          setValue={(val) => {
            updateFilters({ market: val });
          }}
          value={filters?.market}
        />
      ),
      render: (row) => market[row?.market],
    },
    {
      id: "labels",
      label: "Labels",
      enabled: true,
      headerRender: () => (
        <FilterMultiSelect
          label="LABELS"
          withSearch
          isLabel
          placeholder="Label..."
          handleModalOpen={() => setModalOpen(true)}
          options={labelList ?? []}
          onChangeNon={(val) => {
            updateFilters({ nonLabels: val });
          }}
          onChange={(val) => {
            updateFilters({ labels: val });
          }}
          value={filters?.labels}
          valueNon={filters?.nonLabels}
        />
      ),
      render: (row) => (
        <Stack direction="row">
          {row?.labels?.map((item) => (
            <Chip
              key={item.name}
              label={item.name}
              size="small"
              color="primary"
              sx={{ backgroundColor: item?.color ?? "", mr: 1 }}
            />
          ))}
        </Stack>
      ),
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
      render: (row) =>
        `${row.currency ? currencies[row.currency] : "$"}${row?.amount ? parseFloat(Number(row?.amount).toFixed(5)) : "0.00"
        }`,
    },
    {
      id: "swap",
      label: "Swap",
      enabled: true,
      headerRender: () => (
        <FilterInput
          label="SWAP"
          type="number"
          placeholder="Max Swap..."
          filter={filters?.swap}
          setFilter={(val) => {
            updateFilters({ swap: val });
          }}
          isRange
          placeholder2="Min Swap..."
          filter2={filters?.lte_swap}
          setFilter2={(val) => {
            updateFilters({ lte_swap: val });
          }}
        />
      ),
      render: (row) =>
        row?.swap ? Math.floor(row?.swap * 100000) / 100000 : "0.00",
    },
    {
      id: "unit",
      label: "Unit",
      enabled: true,
      headerRender: () => (
        <FilterInput
          label="UNIT"
          type="number"
          placeholder="Max Unit..."
          filter={filters?.unit}
          setFilter={(val) => {
            updateFilters({ unit: val });
          }}
          isRange
          placeholder2="Min Unit..."
          filter2={filters?.lte_unit}
          setFilter2={(val) => {
            updateFilters({ lte_unit: val });
          }}
        />
      ),
      render: (row) =>
        row?.unit ? Math.floor(row?.unit * 100000) / 100000 : "0.00",
    },
    {
      id: "set_rate",
      label: "Set",
      enabled: true,
    },
    {
      id: "entry_price",
      label: "Entry Price",
      enabled: true,
      render: (row) => (row?.opened_amount ? row?.opened_amount : "0.00"),
    },
    {
      id: "market_price",
      label: "Market Price",
      enabled: true,
      render: (row) =>
        row.status === 2
          ? row.market_price
          : row.amount
            ? row.market_price
            : "N/A",
    },
    {
      id: "volume",
      label: "Volume",
      enabled: true,
      render: (row) =>
        row.status === 2
          ? parseFloat(
            Number(Number(row?.trade_amount) * Number(row?.unit)).toFixed(5)
          )
          : row?.amount
            ? parseFloat(
              Number(Number(row?.market_price) * Number(row?.unit)).toFixed(5)
            )
            : "N/A",
    },
    {
      id: "leverage",
      label: "Leverage",
      headerRender: () => (
        <FilterInput
          label="LEVERAGE"
          type="number"
          placeholder="Leverage..."
          filter={filters?.leverage}
          setFilter={(val) => {
            updateFilters({ leverage: val });
          }}
        />
      ),
      enabled: true,
      render: (row) => `${row?.leverage ? row?.leverage : "0"}x`,
    },
    {
      id: "t/p",
      label: "T/P",
      enabled: true,
      render: (row) => (row?.tp ? row?.tp : "0.00"),
    },
    {
      id: "s/l",
      label: "S/L",
      enabled: true,
      render: (row) => (row?.sl ? row?.sl : "0.00"),
    },
    {
      id: "profit/loss",
      label: "Profit/loss",
      enabled: true,
      headerRender: () => (
        <FilterInput
          label="PROFIT/LOSS"
          type="number"
          placeholder="Max Profit..."
          filter={filters?.profit}
          setFilter={(val) => {
            updateFilters({ profit: val });
          }}
          isRange
          placeholder2="Min Profit..."
          filter2={filters?.lte_profit}
          setFilter2={(val) => {
            updateFilters({ lte_profit: val });
          }}
        />
      ),
      render: (row) => (
        <Typography
          variant="subtitle2"
          color={row?.profit < 0 ? "#F04438" : "#10B981"}
        >
          {row?.profit ? parseFloat(Number(row?.profit).toFixed(5)) : "0"}
        </Typography>
      ),
    },
    {
      id: "balance",
      label: "Balance",
      enabled: true,
      headerRender: () => (
        <FilterInput
          label="BALANCE"
          type="number"
          placeholder="Max Balance..."
          filter={filters?.balance}
          setFilter={(val) => {
            updateFilters({ balance: val });
          }}
          isRange
          placeholder2="Min Balance..."
          filter2={filters?.lte_balance}
          setFilter2={(val) => {
            updateFilters({ lte_balance: val });
          }}
        />
      ),
      render: (row) => (row?.client_balance ? row?.client_balance : "0.00"),
    },
    {
      id: "equity",
      label: "Equity",
      enabled: true,
      headerRender: () => (
        <FilterInput
          label="EQUITY"
          type="number"
          placeholder="Max Equity..."
          filter={filters?.equity}
          setFilter={(val) => {
            updateFilters({ equity: val });
          }}
          isRange
          placeholder2="Min Equity..."
          filter2={filters?.lte_equity}
          setFilter2={(val) => {
            updateFilters({ lte_equity: val });
          }}
        />
      ),
      render: (row) => (
        <Typography
          variant="subtitle2"
          color={row?.client_equity < 0 ? "#F04438" : ""}
        >
          {row?.client_equity ? row?.client_equity?.toFixed(5) : "0.00"}
        </Typography>
      ),
    },
    {
      id: "total_p/l",
      label: "Total P/L",
      enabled: true,
      headerRender: () => (
        <FilterInput
          label="TOTAL P/L"
          type="number"
          placeholder="Max Total P/L..."
          filter={filters?.total_pl}
          setFilter={(val) => {
            updateFilters({ total_pl: val });
          }}
          isRange
          placeholder2="Min Total P/L..."
          filter2={filters?.lte_total_pl}
          setFilter2={(val) => {
            updateFilters({ lte_total_pl: val });
          }}
        />
      ),
      render: (row) => (
        <Typography
          variant="subtitle2"
          color={row?.client_pl < 0 ? "#F04438" : "#10B981"}
        >
          {row?.client_pl ? row?.client_pl.toFixed(5) : "0"}
        </Typography>
      ),
    },
    {
      id: "margin_level",
      label: "Margin Level",
      enabled: true,
      headerRender: () => (
        <FilterInput
          label="MARGIN LEVEL"
          type="number"
          placeholder="Max Margin Level..."
          filter={filters?.margin_level}
          setFilter={(val) => {
            updateFilters({ margin_level: val });
          }}
          isRange
          placeholder2="Min Margin Level..."
          filter2={filters?.lte_margin_level}
          setFilter2={(val) => {
            updateFilters({ lte_margin_level: val });
          }}
        />
      ),
      render: (row) => (
        <Typography
          variant="subtitle2"
          color={row?.client_margine_level < 0 ? "#F04438" : ""}
        >
          {row?.client_margine_level
            ? `${row?.client_margine_level?.toFixed(2)}%`
            : "0.00%"}
        </Typography>
      ),
    },
    {
      id: "free_margin",
      label: "Free Margin",
      enabled: true,
      headerRender: () => (
        <FilterInput
          label="FREE MARGIN"
          type="number"
          placeholder="Max Free Margin..."
          filter={filters?.free_margin}
          setFilter={(val) => {
            updateFilters({ free_margin: val });
          }}
          isRange
          placeholder2="Min Free Margin..."
          filter2={filters?.lte_free_margin}
          setFilter2={(val) => {
            updateFilters({ lte_free_margin: val });
          }}
        />
      ),
      render: (row) => (
        <Typography
          variant="subtitle2"
          color={row?.client_free_margin < 0 ? "#F04438" : ""}
        >
          {row?.client_free_margin
            ? row?.client_free_margin?.toFixed(5)
            : "0.00"}
        </Typography>
      ),
    },
    {
      id: "used_margin",
      label: "Used Margin",
      enabled: true,
      headerRender: () => (
        <FilterInput
          label="USED MARGIN"
          type="number"
          placeholder="Max USED Margin..."
          filter={filters?.used_margin}
          setFilter={(val) => {
            updateFilters({ used_margin: val });
          }}
          isRange
          placeholder2="Min USED Margin..."
          filter2={filters?.lte_used_margin}
          setFilter2={(val) => {
            updateFilters({ lte_used_margin: val });
          }}
        />
      ),
      render: (row) => (
        <Typography
          variant="subtitle2"
          color={row?.client_used_margin < 0 ? "#F04438" : ""}
        >
          {row?.client_used_margin ? row?.client_used_margin : "0.00"}
        </Typography>
      ),
    },
    {
      id: "action",
      label: "Actions",
      enabled: true,
      render: (row) =>
        user?.acc?.acc_e_client_position === undefined ||
          user?.acc?.acc_e_client_position ? (
          <Stack direction="row" alignItems="center" sx={{ maxHeight:28, overflow:'hidden'}}>
            <Tooltip title="Edit">
              <IconButton
                sx={{ '&:hover': { color: 'primary.main' }}}
                onClick={() => handleEditPageOpen(row?.id)}
              >
                <Iconify icon="mage:edit" width={22}/>
              </IconButton>
            </Tooltip>

            <Tooltip title="Close">
              <IconButton
                sx={{ '&:hover': { color: 'primary.main' }}}
                onClick={() => {
                  setPositionToClose(row?.id);
                  setCloseModalOpen(true);
                }}
              >
                <Iconify icon="solar:close-circle-outline" width={22}/>
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                sx={{ '&:hover': { color: 'error.main' }}}
                onClick={() => {
                  setPositionToDelete(row?.id);
                  setDeleteModalOpen(true);
                }}
              >
                <Iconify icon="heroicons:trash" width={22}/>
              </IconButton>
            </Tooltip>
          </Stack>
        ) : null,
    },
  ];

  const tableColumn = useMemo(() => {
    if (rule?.length) {
      const updateColumn = defaultColumn
        ?.map((item) => ({
          ...item,
          enabled: rule?.find((ruleItem) => item?.id === ruleItem?.id)?.enabled,
          order: rule?.find((ruleItem) => item?.id === ruleItem?.id)?.order,
        }))
        ?.sort((a, b) => a.order - b.order);
      return updateColumn;
    } else {
      return defaultColumn?.map((item, index) => ({ ...item, order: index }));
    }
  }, [rule, labelList, filters, accounts]);

  const updateRule = async (rule) => {
    setRule(rule);

    if (tableSetting) {
      const updateSetting = {
        ...tableSetting,
        positionTable: rule,
      };
      await userApi.updateUser(accountId, {
        column_setting: JSON.stringify(updateSetting),
      });
      setTableSetting(updateSetting);
    } else {
      const updateSetting = {
        positionTable: rule,
      };
      await userApi.updateUser(accountId, {
        column_setting: JSON.stringify(updateSetting),
      });
      setTableSetting(updateSetting);
    }
  };

  const onDelete = async () => {
    try {
      await riskApi.deletePosition(positionToDelete);
      toast("Position successfully deleted!");
      setTimeout(() => {
        getPositions();
      }, 1500);
      setPositionToDelete(null);
      setDeleteModalOpen(false);
    } catch (error) {
      setDeleteModalOpen(false);
      setPositionToDelete(null);
      toast.error(error?.response?.data?.message);
      console.error("error: ", error);
    }
  };

  const handleClosePosition = async () => {
    try {
      const request = {
        closed: true,
        client_id: customerId,
      };
      await riskApi.updateSingleDealing(positionToClose, request);
      toast.success("Position was successfully closed!");
      setPositionToClose(null);
      setCloseModalOpen(false);
      setTimeout(() => {
        getPositions();
      }, 3000);
    } catch (error) {
      setPositionToClose(null);
      setCloseModalOpen(false);
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const tableData = useMemo(() => {
    return customerState?.positions?.positions ?? [];
  }, [customerState]);

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
    currentChip?.length ||
    nonLabelChip?.length ||
    currentDirection?.length ||
    idChip?.length ||
    createdStartChip?.length ||
    createdEndChip?.length ||
    closedStartChip?.length ||
    closedEndChip?.length ||
    openedStartChip?.length ||
    openedEndChip?.length ||
    marketChip?.length ||
    traderAccountChip?.length ||
    maxAmountChip?.length ||
    minAmountChip?.length ||
    maxSwapChip?.length ||
    minSwapChip?.length ||
    maxUnitChip?.length ||
    minUnitChip?.length ||
    leverageChip?.length ||
    maxProfitChip?.length ||
    minProfitChip?.length ||
    maxBalanceChip?.length ||
    minBalanceChip?.length ||
    maxEquityChip?.length ||
    minEquityChip?.length ||
    maxTotalPLChip?.length ||
    minTotalPLChip?.length ||
    maxMarginChip?.length ||
    minMarginChip?.length ||
    maxFreeMarginChip?.length ||
    minFreeMarginChip?.length ||
    maxUsedMarginChip?.length ||
    minUsedMarginChip?.length ||
    tickerChip?.length ||
    alertChip?.length ||
    labelChip?.length;

  const totalPage = useMemo(()=> {
    if(customerState?.positions?.total_count) {
      const perPage = filters?.perPage ? parseInt(filters?.perPage) : 10 ;
      const totalPage =  Math.ceil(customerState?.positions?.total_count/perPage);
      return totalPage;
    }
    return 0;
  }, [customerState, filters?.perPage]);

  return (
    <>
      {!isIB && <CustomerBalance currency={currency} customerId={customerId} />}
      <Card sx={isIB ? { 
          backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.5), 
          border: '1px dashed', 
          borderColor: 'divider', 
          boxShadow: 3,
          borderRadius: 5
        }: { backgroundColor: 'background.paper' }}>
        <CardHeader
          title="Positions"
          action={
            <Stack direction="row" alignItems="center" spacing={2}>
              {user?.acc?.acc_e_client_create_position === true && !isIB ? (
                <Button variant="contained" onClick={handleCreatePageOpen}>
                  Create position
                </Button>
              ) : null}
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
          }
        />
        <Box position="relative">
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
                <ChipSet
                  chips={currentChip}
                  handleRemoveChip={() => {
                    updateFilters({ status: undefined });
                  }}
                />
                <ChipSet
                  chips={currentDirection}
                  handleRemoveChip={() => {
                    updateFilters({ direction: undefined });
                  }}
                />
                <ChipSet
                  chips={marketChip}
                  handleRemoveChip={() => updateFilters({ market: undefined })}
                />
                <ChipSet
                  chips={traderAccountChip}
                  handleRemoveChip={() => updateFilters({ trading_account_id: undefined })}
                />
                <ChipSet
                  chips={alertChip}
                  handleRemoveChip={() =>
                    updateFilters({ alart_status: undefined })
                  }
                />
                <ChipSet
                  chips={idChip}
                  handleRemoveChip={() => updateFilters({ id: undefined })}
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
                  chips={closedStartChip}
                  handleRemoveChip={() =>
                    updateFilters({ closed_at_start: undefined })
                  }
                />
                <ChipSet
                  chips={closedEndChip}
                  handleRemoveChip={() =>
                    updateFilters({ closed_at_end: undefined })
                  }
                />
                <ChipSet
                  chips={openedStartChip}
                  handleRemoveChip={() =>
                    updateFilters({ opened_at_start: undefined })
                  }
                />
                <ChipSet
                  chips={tickerChip}
                  handleRemoveChip={() =>
                    updateFilters({ ticker_id: undefined })
                  }
                />
                <ChipSet
                  chips={openedEndChip}
                  handleRemoveChip={() =>
                    updateFilters({ opened_at_end: undefined })
                  }
                />
                <ChipSet
                  chips={maxAmountChip}
                  handleRemoveChip={() => updateFilters({ amount: undefined })}
                />
                <ChipSet
                  chips={minAmountChip}
                  handleRemoveChip={() =>
                    updateFilters({ lte_amount: undefined })
                  }
                />
                <ChipSet
                  chips={maxSwapChip}
                  handleRemoveChip={() => updateFilters({ swap: undefined })}
                />
                <ChipSet
                  chips={minSwapChip}
                  handleRemoveChip={() =>
                    updateFilters({ lte_swap: undefined })
                  }
                />
                <ChipSet
                  chips={labelChip}
                  handleRemoveChip={() => {
                    updateFilters({ labels: undefined });
                  }}
                />
                <ChipSet
                  chips={nonLabelChip}
                  handleRemoveChip={() => {
                    updateFilters({ nonLabels: undefined });
                  }}
                />
                <ChipSet
                  chips={maxUnitChip}
                  handleRemoveChip={() => updateFilters({ unit: undefined })}
                />
                <ChipSet
                  chips={minUnitChip}
                  handleRemoveChip={() =>
                    updateFilters({ lte_unit: undefined })
                  }
                />
                <ChipSet
                  chips={leverageChip}
                  handleRemoveChip={() =>
                    updateFilters({ leverage: undefined })
                  }
                />
                <ChipSet
                  chips={maxProfitChip}
                  handleRemoveChip={() => updateFilters({ profit: undefined })}
                />
                <ChipSet
                  chips={minProfitChip}
                  handleRemoveChip={() =>
                    updateFilters({ lte_profit: undefined })
                  }
                />
                <ChipSet
                  chips={maxBalanceChip}
                  handleRemoveChip={() => updateFilters({ balance: undefined })}
                />
                <ChipSet
                  chips={minBalanceChip}
                  handleRemoveChip={() =>
                    updateFilters({ lte_balance: undefined })
                  }
                />
                <ChipSet
                  chips={maxEquityChip}
                  handleRemoveChip={() => updateFilters({ equity: undefined })}
                />
                <ChipSet
                  chips={minEquityChip}
                  handleRemoveChip={() =>
                    updateFilters({ lte_equity: undefined })
                  }
                />
                <ChipSet
                  chips={maxTotalPLChip}
                  handleRemoveChip={() =>
                    updateFilters({ total_pl: undefined })
                  }
                />
                <ChipSet
                  chips={minTotalPLChip}
                  handleRemoveChip={() =>
                    updateFilters({ lte_total_pl: undefined })
                  }
                />
                <ChipSet
                  chips={maxMarginChip}
                  handleRemoveChip={() =>
                    updateFilters({ margin_level: undefined })
                  }
                />
                <ChipSet
                  chips={minMarginChip}
                  handleRemoveChip={() =>
                    updateFilters({ lte_margin_level: undefined })
                  }
                />
                <ChipSet
                  chips={maxFreeMarginChip}
                  handleRemoveChip={() =>
                    updateFilters({ free_margin: undefined })
                  }
                />
                <ChipSet
                  chips={minFreeMarginChip}
                  handleRemoveChip={() =>
                    updateFilters({ lte_free_margin: undefined })
                  }
                />
                <ChipSet
                  chips={maxUsedMarginChip}
                  handleRemoveChip={() =>
                    updateFilters({ used_margin: undefined })
                  }
                />
                <ChipSet
                  chips={minUsedMarginChip}
                  handleRemoveChip={() =>
                    updateFilters({ lte_used_margin: undefined })
                  }
                />
              </Stack>
            </>
          ) : null}
          <Scrollbar>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow sx={{ whiteSpace: "nowrap" }}>
                  {tableColumn
                    ?.filter((item) => item.enabled)
                    ?.map((item) => (
                      <TableCell key={item.id}>
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
                {isLoading ? (
                  <TableSkeleton rowCount={5} cellCount={tableColumn?.filter((item) => item.enabled)?.length ?? 0} />
                ) : (
                  tableData?.map((position) => (
                    <TableRow key={position.id}>
                      {tableColumn
                        ?.filter((item) => item.enabled)
                        ?.map((header, index) => (
                          <TableCell
                            sx={{ whiteSpace: "nowrap" }}
                            key={position.id + index}
                          >
                            {header?.render
                              ? header?.render(position)
                              : position[header.id]}
                          </TableCell>
                        ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </Box>
        {!isLoading && tableData?.length === 0 && <TableNoData isSmall />}

        <Divider />
        <Stack sx={{  flexDirection: { md: 'row', xs: 'column' }, gap: 0, justifyContent: 'flex-end', alignItems: { md: 'center', xs: 'start' } }}>
          <PageNumberSelect 
            currentPage={filters?.currentPage ?? 0} 
            totalPage={totalPage}
            onUpdate={(pageNum) => updateFilters({ currentPage: pageNum })}
          />
          <TablePagination
            component="div"
            labelRowsPerPage="Per page"
            count={customerState?.positions?.total_count ?? 0}
            onPageChange={(event, index) => updateFilters({ currentPage: index })}
            onRowsPerPageChange={(event) => {
              updateFilters({ perPage: event?.target?.value });
              localStorage.setItem("customerPositionPerPage", event?.target?.value);
            }}
            page={filters?.currentPage ?? 0}
            rowsPerPage={filters?.perPage ?? 10}
            rowsPerPageOptions={[1, 5, 10, 25, 50, 100, 200]}
          />
        </Stack>
      </Card>
      
      <TableModal
        open={tableModal}
        updateRule={updateRule}
        tableColumn={tableColumn}
        defaultColumn={defaultColumn}
        onClose={() => setTableModal(false)}
      />

      <PositionLabelsDialog
        teams={teams}
        title="Edit Label"
        onGetLabels={getLabels}
        open={modalOpen ?? false}
        onClose={() => setModalOpen(false)}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onDelete={onDelete}
        title={"Delete position"}
        setIsOpen={setDeleteModalOpen}
        description={"Are you sure you want to delete this position?"}
      />

      <DeleteModal
        buttonTitle="Close"
        isOpen={closeModalOpen}
        title={"Close position"}
        setIsOpen={setCloseModalOpen}
        onDelete={handleClosePosition}
        description={"Are you sure you want to close this position?"}
      />
    </>
  );
};
