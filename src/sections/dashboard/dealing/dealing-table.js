import { useMemo, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import isEqual from "lodash.isequal";
import { format } from "date-fns";
import { useSelector, useDispatch } from "react-redux";

import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
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
import OutlinedInput from "@mui/material/OutlinedInput";

import FilterIcon from "src/icons/untitled-ui/duocolor/filter";
import { Iconify } from "src/components/iconify";
import SettingIcon from "src/icons/untitled-ui/duocolor/setting";
import { ChipSet } from "src/components/customize/chipset";
import { CircularProgressWithLabel } from "src/components/loader-with-percentage";
import { ClientFilterInput } from "src/components/customize/client-filter-input";
import { DeleteModal } from "src/components/customize/delete-modal";
import { FilterDateTime } from "src/components/customize/filter-date-time";
import { FilterInput } from "src/components/customize/filter-input";
import { FilterModal } from "src/components/filter-settings-modal";
import { FilterMultiSelect } from "src/components/customize/filter-multi-select";
import { FilterSelect } from "src/components/customize/filter-select";
import { MultiSelect } from "src/components/multi-select";
import { PageNumberSelect } from "src/components/pagination/page-selector";
import { RouterLink } from "src/components/router-link";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { SwapModal } from "./swap-modal";
import { TableModal } from "src/components/table-settings-modal";
import { TableNoData } from "src/components/table-empty";
import { TableSkeleton } from "src/components/table-skeleton";
import { authApi } from "src/api/auth";
import { exportToExcel } from "src/utils/export-excel";
import { paths } from "src/paths";
import { riskApi } from "src/api/risk";
import { settingsApi } from "src/api/settings";
import { thunks } from "src/thunks/dealing";
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "src/hooks/use-router";
import { userApi } from "src/api/user";
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

const market = {
  fx: "Forex",
  commodities: "Commodities",
  crypto: "Crypto",
  stocks: "Stocks",
  cfd: "CFD",
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

export const DealingTable = ({
  count = 0,
  onPageChange = () => {},
  onRowsPerPageChange,
  page = 0,
  rowsPerPage = 0,
  tableData,
  setStatus,
  status,
  setDirection,
  direction,
  marketValue,
  setMarketValue,
  labels,
  setLabels,
  labelList,
  tickerId,
  setTickerId,
  tickerList = [],
  isLoading,
  text,
  setText,
  handleLabelsDialogOpen,
  nonLabels,
  setNonLabels,
  selected = [],
  selectAll,
  onSelectAll,
  onSelectPage,
  onDeselectAll,
  onDeselectPage,
  onSelectOne,
  onDeselectOne,
  selectedLabels,
  handleSelectedLabelsChange,
  getDealing,
  perPage: selectFirstPerPage,
  setPerPage,
}) => {
  const accountId = localStorage.getItem("account_id");

  const [filterModal, setFilterModal] = useState(false);
  const [searchSetting, setSearchSetting] = useState([]);
  const [selectedFilterValue, setSelectedFilterValue] = useState("none");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [positionToClose, setPositionToClose] = useState();
  const [positionToDelete, setPositionToDelete] = useState();
  const [clientId, setClientId] = useState();
  const [closeLoading, setCloseLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [progress, setProgress] = useState(10);

  const [clientList, setClientList] = useState([]);

  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useAuth();
  const { toLocalTime } = useTimezone();

  const filters = useSelector((state) => state.dealing.dealingFilters);
  const updateFilters = (data) => dispatch(thunks.setFilters(data));
  const resetFilters = () => dispatch(thunks.resetFilter());

  const [rule, setRule] = useState([]);
  const [tableModal, setTableModal] = useState(false);
  const [tableSetting, setTableSetting] = useState({});

  const [swapModal, setSwapModal] = useState(false);
  const [positionId, setPositionId] = useState(false);

  const tableIds = useMemo(
    () => tableData?.map((deal) => deal?.id),
    [tableData]
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
  const currentChip = useMemo(() => {
    const newChips = status?.map((item) => ({
      displayValue:
        item === "0" ? "Pending" : item === "1" ? "Active" : "Closed",
      value: item,
      label: "Status",
    }));
    return newChips;
  }, [status]);

  const getTableSetting = async () => {
    try {
      const localTableSetting = localStorage.getItem("tableSetting");
      const { account } = await authApi.me({ accountId });
      if (account?.column_setting) {
        setTableSetting(JSON.parse(account?.column_setting));
        setRule(JSON.parse(account?.column_setting)?.riskTable ?? []);
      } else if (localTableSetting) {
        const { account: _account } = await userApi.updateUser(accountId, {
          column_setting: localTableSetting,
        });
        setTableSetting(JSON.parse(_account?.column_setting));
        setRule(JSON.parse(_account?.column_setting)?.riskTable ?? []);
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getTableSetting();
  }, []);

  const currentDirection = useMemo(() => {
    const newChips = direction?.map((item) => ({
      displayValue: item === "0" ? "Buy" : "Sell",
      value: item,
      label: "Direction",
    }));
    return newChips;
  }, [direction]);

  const labelChip = useMemo(
    () =>
      labels?.map((value) => ({
        displayValue: labelList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Label",
      })),
    [labels, labelList]
  );

  const tickerChip = useMemo(() => {
    const newChip = [
      {
        displayValue: tickerList?.find((item) => item?.value === tickerId)
          ?.label,
        value: tickerId,
        label: "Ticker",
      },
    ];
    if (tickerId) return newChip;
    return [];
  }, [tickerId, tickerList]);

  const nonLabelChip = useMemo(
    () =>
      nonLabels?.map((value) => ({
        displayValue: labelList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Exclude Label",
      })),
    [nonLabels, labelList]
  );

  const marketChip = useMemo(() => {
    const newChips =
      marketValue && marketValue !== "_empty"
        ? [
            {
              displayValue: market[marketValue],
              value: marketValue,
              label: "Market",
            },
          ]
        : [];
    return newChips;
  }, [marketValue]);

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

  const clientIdChip = useMemo(
    () =>
      filters?.client_ids?.map((value) => ({
        displayValue:
          clientList?.find((client) => client?.value == value)?.label ?? value,
        value: value,
        label: "Client",
      })),
    [filters?.client_ids, clientList]
  );

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

  const demoChip = useMemo(() => {
    const newChips = filters?.demo
      ? [
          {
            displayValue: filters?.demo === "true" ? "True" : "False",
            value: filters?.demo,
            label: "Demo",
          },
        ]
      : [];
    return newChips;
  }, [filters?.demo]);

  const handleRemoveChip = (value, target) => {
    if (target === "direction") {
      const newDirection = [...direction].filter((item) => item !== value);
      setDirection(newDirection);
    }
    if (target === "status") {
      const newStatus = [...status].filter((item) => item !== value);
      setStatus(newStatus);
    }
    if (target === "non_label") {
      const newLabels = [...nonLabels].filter((item) => item !== value);
      setNonLabels(newLabels);
    }
    if (target === "labels") {
      const newLabels = [...labels].filter((item) => item !== value);
      setLabels(newLabels);
    }
    if (target === "client_id") {
      const newArrays = [...filters?.client_ids].filter(
        (item) => item !== value
      );
      updateFilters({ client_ids: newArrays });
    }
  };

  const handleEditPageOpen = (id) => {
    router.push(paths.dashboard.riskUpdate.replace(":riskId", id));
  };

  const updateRule = async (rule) => {
    setRule(rule);

    if (tableSetting) {
      const updateSetting = {
        ...tableSetting,
        riskTable: rule,
      };
      await userApi.updateUser(accountId, {
        column_setting: JSON.stringify(updateSetting),
      });
      setTableSetting(updateSetting);
    } else {
      const updateSetting = {
        riskTable: rule,
      };
      await userApi.updateUser(accountId, {
        column_setting: JSON.stringify(updateSetting),
      });
      setTableSetting(updateSetting);
    }
  };

  const handleSelectedLabelsUpdate = useCallback(
    (labels) => {
      handleSelectedLabelsChange(labels);
    },
    [handleSelectedLabelsChange]
  );

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
      id: "client",
      label: "Client",
      enabled: true,
      headerRender: () => (
        <ClientFilterInput
          updateFilters={updateFilters}
          updateClientList={setClientList}
        />
      ),
      render: (row) => (
        <Stack direction="row" gap={1} alignItems="center">
          <Iconify
            icon={`circle-flags:${row?.client_country?.toLowerCase()}`}
            width={24}
          />
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
            <Typography>{row?.client_name}</Typography>
          </Link>
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
          onChange={setDirection}
          value={direction}
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
      id: "opened_at",
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
          filter2={filters?.opened_time_end}
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
          options={tickerList ?? []}
          setValue={(val) => {
            setTickerId(val);
          }}
          value={tickerId}
        />
      ),
      render: (row) =>
        row?.ticker?.base_currency_symbol === null ||
        row?.ticker?.currency_symbol === null
          ? row?.ticker_sym
          : `${row?.ticker?.base_currency_symbol}-${row?.ticker?.currency_symbol}`,
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
          onChange={setStatus}
          value={status}
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
            setMarketValue(val);
          }}
          value={marketValue}
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
          handleModalOpen={() => handleLabelsDialogOpen(true)}
          options={labelList ?? []}
          onChangeNon={(val) => {
            setNonLabels(val);
          }}
          onChange={(val) => {
            setLabels(val);
          }}
          value={labels}
          valueNon={nonLabels}
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
        `${row.currency ? currencies[row.currency] : "$"}${
          row?.amount ? parseFloat(Number(row?.amount).toFixed(5)) : "0.00"
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
        row?.swap ? (
          <Stack direction="row" alignItems="center" gap={0}>
            <Typography variant="subtitle2">
              {row?.swap ? Math.floor(row?.swap * 100000) / 100000 : "0.00"}
            </Typography>
            <Tooltip title="Show swap info">
              <IconButton
                sx={{ "&:hover": { color: "primary.main" }, color: "inherit" }}
                onClick={() => {
                  setPositionId(row.id);
                  setSwapModal(true);
                }}
              >
                <Iconify icon="basil:history-outline" width={22} />
              </IconButton>
            </Tooltip>
          </Stack>
        ) : null,
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
      id: "demo",
      label: "Demo",
      enabled: false,
      headerRender: () => (
        <FilterSelect
          label="DEMO"
          options={[
            {
              label: "True",
              value: "true",
            },
            {
              label: "False",
              value: "false",
            },
          ]}
          setValue={(val) => {
            updateFilters({ demo: val });
          }}
          value={filters?.demo}
        />
      ),
      render: (row) => (
        <Stack direction="row" alignItems="center">
          <Iconify
            icon={
              row?.demo
                ? "mdi:check-circle-outline"
                : "mdi:close-circle-outline"
            }
            width={22}
            sx={{ color: row?.demo ? "success.main" : "error.main" }}
          />
        </Stack>
      ),
    },
    {
      id: "action",
      label: "Actions",
      enabled: true,
      render: (row) => {
        if (
          user?.acc?.acc_e_risk_position === undefined ||
          user?.acc?.acc_e_risk_position
        ) {
          return (
            <Stack
              direction="row"
              alignItems="center"
              sx={{ maxHeight: 28, overflow: "hidden" }}
            >
              <Tooltip title="Edit">
                <IconButton
                  sx={{ "&:hover": { color: "primary.main" } }}
                  onClick={() => handleEditPageOpen(row?.id)}
                >
                  <Iconify icon="mage:edit" width={22} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Close">
                <IconButton
                  sx={{ "&:hover": { color: "primary.main" } }}
                  onClick={() => {
                    setPositionToClose(row?.id);
                    setClientId(row?.client_id);
                    setCloseModalOpen(true);
                  }}
                >
                  <Iconify icon="solar:close-circle-outline" width={22} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  sx={{ "&:hover": { color: "error.main" } }}
                  onClick={() => {
                    setPositionToDelete(row?.id);
                    setClientId(row?.client_id);
                    setDeleteModalOpen(true);
                  }}
                >
                  <Iconify icon="heroicons:trash" width={22} />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      },
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
  }, [
    rule,
    labelList,
    nonLabels,
    status,
    direction,
    marketValue,
    labels,
    filters,
    tickerId,
    tickerList,
  ]);

  const isDefaultSetting =
    JSON.stringify(
      defaultColumn?.map((item, index) => ({
        id: item?.id,
        enabled: item?.enabled,
        order: index,
      }))
    ) ===
      JSON.stringify(
        rule?.map((item, index) => ({
          id: item?.id,
          enabled: item?.enabled,
          order: index,
        }))
      ) || rule?.length === 0;

  const enableBulkActions = selected.length > 0;
  const selectedPage = tableIds?.every((item) => selected?.includes(item));
  const selectedSome =
    tableIds?.some((item) => selected?.includes(item)) &&
    !tableIds?.every((item) => selected?.includes(item));

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
    if (searchSetting?.position?.length && selectedFilterValue !== "none") {
      const result = searchSetting?.position?.find(
        (item) => item?.id === selectedFilterValue?.id
      )?.filter;
      const name = selectedFilterValue.name;
      return { filter: result, name };
    }
  }, [searchSetting, selectedFilterValue]);

  const currentSavedFilterName = useMemo(() => {
    if (currentFilter) {
      const currentFilters = currentFilter?.filter;
      if (filters?.perPage) {
        currentFilters.perPage = filters?.perPage;
      }
      currentFilters.currentPage = filters?.currentPage;
      if (isEqual(currentFilters, filters)) {
        return currentFilter?.name;
      } else {
        return undefined;
      }
    }
  }, [currentFilter, filters]);

  useEffect(() => {
    if (currentFilter) {
      resetFilters();
      updateFilters({ ...currentFilter?.filter });
    }
  }, [currentFilter]);

  const handleClosePosition = async () => {
    try {
      const request = {
        closed: true,
        client_id: clientId,
      };
      await riskApi.updateSingleDealing(positionToClose, request);
      setTimeout(() => {
        toast.success("Position was successfully closed!");
        setPositionToClose(null);
        setClientId(null);
        setCloseModalOpen(false);
      }, 1000);
    } catch (error) {
      setPositionToClose(null);
      setClientId(null);
      setCloseModalOpen(false);
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleDeletePosition = async () => {
    try {
      setCloseLoading(true);
      await riskApi.deletePosition(positionToDelete);
      toast.success("Position successfully deleted!");
      setPositionToDelete(null);
      setClientId(null);
      setDeleteModalOpen(false);
      setCloseLoading(false);
    } catch (error) {
      setCloseLoading(false);
      setDeleteModalOpen(false);
      setClientId(null);
      setPositionToDelete(null);
      toast.error(error?.response?.data?.message);
      console.error("error: ", error);
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
        page: filters?.currentPage + 1,
        per_page: 1000,
        q: text?.length > 0 ? text : null,
      };

      if (!selectAll) {
        checkParams["ids"] = selected;
      }

      const checkRes = await riskApi.getDealingInfo(checkParams);
      const totalPositions = selectFirstPerPage ? selectFirstPerPage : checkRes?.total_count;

      let allData = [];

      if (selectFirstPerPage && selectFirstPerPage > 1000) {
        const numPages = Math.ceil(selectFirstPerPage / 1000);
        
        for (let page = 1; page <= numPages; page++) {
          const newRes = await riskApi.getDealingInfo({
            ...checkParams,
            page,
            per_page: 1000,
          });
          
          const dataIds = allData?.map(d => d?.id);
          allData.push(
            ...newRes?.positions?.filter((position) => !dataIds?.includes(position?.id))
          );
        }
        
        const totalFetched = allData.length;
        if (totalFetched > selectFirstPerPage) {
          allData = allData.slice(0, selectFirstPerPage);
        }
      } else {
        const perPage = totalPositions < 1000 ? totalPositions : 1000;
        const numPages = !selectAll ? 1 : Math.ceil(totalPositions / perPage);

        for (let page = 1; page <= numPages; page++) {
          const newRes = await riskApi.getDealingInfo({
            ...checkParams,
            page,
            per_page: perPage,
          });
          
          const dataIds = allData?.map(d => d?.id);
          allData.push(
            ...newRes?.positions?.filter((position) => !dataIds?.includes(position?.id))
          );
        }
      }

      data.push(...allData);

      setExportLoading(false);
      clearInterval(timer);

      return { excelData: data, params: { ...checkParams, ...filters } };
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
      clearInterval(timer);
      setExportLoading(false);
    }
  };

  const handleExport = useCallback(async () => {
    const dateNow = new Date();
    const exportDate = format(dateNow, "dd.mm.yyyy");
    const { excelData, params } = await handleMakeExcelData();

    let orderMapping;

    let normalizedData;

    if (rule?.length > 0) {
      orderMapping = rule?.reduce((acc, curr) => {
        acc[curr.id] = curr.order;
        return acc;
      }, {});
    }

    const currencyInfo = {
      1: "USD",
      2: "EUR",
      3: "GBP",
    };

    normalizedData = excelData?.map((item) => ({
      client: item?.client_name,
      labels: item?.t_transaction_status_status?.join(", "),
      currency: item?.currency ? currencyInfo[item?.currency] : "USD",
      status: statuses[item?.status],
      "client balance": item?.client_balance,
      "client equity": item?.client_equity,
      "client free margin": item?.client_free_margin,
      "client margine level": item?.client_margine_level,
      "client pl": item?.client_pl,
      "client used margin": item?.client_used_margin,
      "leverage amount": item?.l_leverage_amount,
      "leverage type": item?.l_leverage_type,
      spread: item?.l_spread,
      "market price": item?.market_price,
      "opened amount": item?.opened_amount,
      direction: directions[item?.position_type],
      rate: item?.set_rate,
      ticker: item?.ticker_sym,
      "trade amount": item?.trade_amount,
      "trading account": item?.trading_account_name,
      "opened at": format(new Date(item?.opened_at), "yyyy-MM-dd HH:mm"),
      "closed at": format(new Date(item?.closed_at), "yyyy-MM-dd HH:mm"),
    }));

    if (rule?.length > 0) {
      normalizedData = [
        ...normalizedData
          ?.map((obj) => {
            const filteredObj = {};
            for (const key in obj) {
              if (rule.some((item) => item.id === key && item.enabled)) {
                filteredObj[key] = obj[key];
              }
            }
            return filteredObj;
          })
          ?.map((obj) => {
            const sortedObj = {};
            Object.keys(obj)
              ?.sort((a, b) => orderMapping[a] - orderMapping[b])
              ?.forEach((key) => {
                sortedObj[key] = obj[key];
              });
            return sortedObj;
          }),
      ];
    }

    if (normalizedData)
      exportToExcel(normalizedData, `positions-import-${exportDate}`);

    localStorage.setItem("last_beat_time", new Date().getTime());
    await settingsApi.updateMember(accountId, {
      last_beat: true,
      trigger: "export",
      export_filter_data: JSON.stringify(params),
      export_count: selectAll
        ? excelData?.length + ""
        : selected?.length
        ? selected?.length + ""
        : 0,
      export_table: "Position",
    });
  }, [filters?.perPage, filters?.currentPage, text, selectAll, selected, rule]);

  const isFilter =
    currentChip?.length ||
    nonLabelChip?.length ||
    currentDirection?.length ||
    idChip?.length ||
    clientIdChip?.length ||
    createdStartChip?.length ||
    createdEndChip?.length ||
    closedStartChip?.length ||
    closedEndChip?.length ||
    openedStartChip?.length ||
    openedEndChip?.length ||
    marketChip?.length ||
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
    alertChip?.length ||
    tickerChip?.length ||
    labelChip?.length ||
    demoChip?.length;

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
        <Stack direction="row" gap={1} alignItems="center">
          {isLoading && (
            <Iconify
              icon="svg-spinners:8-dots-rotate"
              width={24}
              sx={{ color: "white" }}
            />
          )}
          <Tooltip title="Reload Table">
            <IconButton
              onClick={() => getDealing()}
              sx={{
                "&:hover": {
                  color: "primary.main",
                  transform: "rotate(180deg)",
                },
                transition: "transform 0.3s",
              }}
            >
              <Iconify icon="ion:reload-sharp" width={24} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Search Setting">
            <IconButton
              onClick={() => setFilterModal(true)}
              sx={{ "&:hover": { color: "primary.main" } }}
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
            <IconButton
              onClick={() => setTableModal(true)}
              sx={{ "&:hover": { color: "primary.main" } }}
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
          {exportLoading ? (
            <CircularProgressWithLabel value={progress} />
          ) : enableBulkActions &&
            (user?.acc?.acc_v_export_positions === undefined ||
              user?.acc?.acc_v_export_positions) ? (
            <Tooltip title="Export selected">
              <IconButton
                onClick={() => {
                  handleExport();
                }}
                sx={{ "&:hover": { color: "primary.main" } }}
              >
                <Iconify icon="line-md:downloading-loop" width={24} />
              </IconButton>
            </Tooltip>
          ) : null}
        </Stack>
      </Stack>
      <Divider />
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
              chips={currentChip}
              handleRemoveChip={(value) => {
                const target = "status";
                return handleRemoveChip(value, target);
              }}
            />
            <ChipSet
              chips={currentDirection}
              handleRemoveChip={(value) => {
                const target = "direction";
                return handleRemoveChip(value, target);
              }}
            />
            <ChipSet
              chips={marketChip}
              handleRemoveChip={() => setMarketValue("")}
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
              chips={clientIdChip}
              handleRemoveChip={(value) => handleRemoveChip(value, "client_id")}
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
              handleRemoveChip={() => updateFilters({ lte_amount: undefined })}
            />
            <ChipSet
              chips={maxSwapChip}
              handleRemoveChip={() => updateFilters({ swap: undefined })}
            />
            <ChipSet
              chips={minSwapChip}
              handleRemoveChip={() => updateFilters({ lte_swap: undefined })}
            />
            <ChipSet
              chips={tickerChip}
              handleRemoveChip={() => setTickerId(undefined)}
            />
            <ChipSet
              chips={labelChip}
              handleRemoveChip={(value) => {
                const target = "labels";
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
              chips={maxUnitChip}
              handleRemoveChip={() => updateFilters({ unit: undefined })}
            />
            <ChipSet
              chips={minUnitChip}
              handleRemoveChip={() => updateFilters({ lte_unit: undefined })}
            />
            <ChipSet
              chips={leverageChip}
              handleRemoveChip={() => updateFilters({ leverage: undefined })}
            />
            <ChipSet
              chips={maxProfitChip}
              handleRemoveChip={() => updateFilters({ profit: undefined })}
            />
            <ChipSet
              chips={minProfitChip}
              handleRemoveChip={() => updateFilters({ lte_profit: undefined })}
            />
            <ChipSet
              chips={maxBalanceChip}
              handleRemoveChip={() => updateFilters({ balance: undefined })}
            />
            <ChipSet
              chips={minBalanceChip}
              handleRemoveChip={() => updateFilters({ lte_balance: undefined })}
            />
            <ChipSet
              chips={maxEquityChip}
              handleRemoveChip={() => updateFilters({ equity: undefined })}
            />
            <ChipSet
              chips={minEquityChip}
              handleRemoveChip={() => updateFilters({ lte_equity: undefined })}
            />
            <ChipSet
              chips={maxTotalPLChip}
              handleRemoveChip={() => updateFilters({ total_pl: undefined })}
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
              handleRemoveChip={() => updateFilters({ free_margin: undefined })}
            />
            <ChipSet
              chips={minFreeMarginChip}
              handleRemoveChip={() =>
                updateFilters({ lte_free_margin: undefined })
              }
            />
            <ChipSet
              chips={maxUsedMarginChip}
              handleRemoveChip={() => updateFilters({ used_margin: undefined })}
            />
            <ChipSet
              chips={minUsedMarginChip}
              handleRemoveChip={() =>
                updateFilters({ lte_used_margin: undefined })
              }
            />
            <ChipSet
              chips={demoChip}
              handleRemoveChip={() => updateFilters({ demo: undefined })}
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
                theme.palette.mode === "dark" ? "neutral.800" : "neutral.50",
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
                    onDeselectPage(tableIds);
                  } else {
                    onSelectPage(tableIds);
                  }
                } else {
                  onDeselectPage(tableIds);
                }
              }}
            />
            <Stack direction="row" alignItems="center" spacing={1}>
              <MultiSelect
                withSearch
                withEdit
                noPadding
                withIcon
                editLabel="Edit position labels"
                labelIcon={
                  <Tooltip title="Assign label">
                    <Iconify icon="mynaui:label" width={24} sx={{ color: "text.disabled", '&:hover': { color: 'primary.main' } }}/>
                  </Tooltip>
                }
                options={labelList}
                onChange={handleSelectedLabelsUpdate}
                onEditClick={handleLabelsDialogOpen}
                value={selectedLabels}
              />
            </Stack>
            {selectAll ? (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  Select first:
                </Typography>
                <OutlinedInput
                  type="number"
                  placeholder="All"
                  value={selectFirstPerPage || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || value === "0") {
                      setPerPage(null);
                    } else {
                      const numValue = parseInt(value);
                      if (numValue > 5000) {
                        setPerPage(5000);
                      } else if (numValue > 0) {
                        setPerPage(numValue);
                      } else {
                        setPerPage(null);
                      }
                    }
                  }}
                  inputProps={{
                    min: 1,
                    max: Math.min(count, 5000),
                    style: { width: "60px", textAlign: "center" },
                  }}
                  sx={{
                    width: "80px",
                    height: "32px",
                    "& input": {
                      padding: "6px 8px",
                      fontSize: "14px",
                    },
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  of {count} items
                </Typography>
              </Stack>
            ) : (
              <Typography>
                Selected <strong>{selected?.length}</strong> of{" "}
                <strong>{count}</strong>
              </Typography>
            )}
            {!selectAll && (
              <Button onClick={() => onSelectAll()}>
                <Typography sx={{ whiteSpace: "nowrap" }}>
                  Selected All
                </Typography>
              </Button>
            )}
            <Button onClick={() => onDeselectAll()}>
              <Typography sx={{ whiteSpace: "nowrap" }}>
                Clear Selection
              </Typography>
            </Button>
          </Stack>
        ) : null}
        <Scrollbar>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    sx={{ p: 0 }}
                    checked={false}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectPage(tableIds);
                      } else {
                        onDeselectPage(tableIds);
                      }
                    }}
                  />
                </TableCell>
                {tableColumn
                  ?.filter((item) => item.enabled)
                  ?.map((item, index) => (
                    <TableCell key={`${item.key}-${index}`}>
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
              {isLoading && tableData?.length < 1 ? (
                <TableSkeleton
                  cellCount={
                    tableColumn?.filter((item) => item.enabled)?.length + 1 ?? 0
                  }
                  rowCount={rowsPerPage > 15 ? 15 : 10}
                />
              ) : (
                tableData?.map((deal, index) => {
                  const isSelected = selected.includes(deal?.id);
                  return (
                    <TableRow hover key={index}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          sx={{ p: 0 }}
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              onSelectOne(deal?.id);
                            } else {
                              onDeselectOne(deal?.id);
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
                            key={deal.id + index}
                          >
                            {column?.render
                              ? column?.render(deal)
                              : deal[column?.id]}
                          </TableCell>
                        ))}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Scrollbar>
        {tableData?.length === 0 && !isLoading && <TableNoData />}
        {isLoading && <Divider />}
        <Stack
          sx={{
            flexDirection: { md: "row", xs: "column" },
            gap: 0,
            justifyContent: "flex-end",
            alignItems: { md: "center", xs: "start" },
          }}
        >
          <PageNumberSelect
            currentPage={page}
            totalPage={count ? Math.ceil(count / rowsPerPage) : 0}
            onUpdate={onPageChange}
          />
          <TablePagination
            component="div"
            count={count}
            onPageChange={(event, index) => onPageChange(index)}
            onRowsPerPageChange={onRowsPerPageChange}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
          />
        </Stack>
      </Box>

      <FilterModal
        variant="position"
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

      <DeleteModal
        isOpen={closeModalOpen}
        setIsOpen={() => setCloseModalOpen(false)}
        onDelete={handleClosePosition}
        title={"Close position"}
        description={"Are you sure you want to close this position?"}
        buttonTitle="Close"
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        setIsOpen={setDeleteModalOpen}
        onDelete={handleDeletePosition}
        title={"Delete position"}
        description={"Are you sure you want to delete this position?"}
        isLoading={closeLoading}
      />

      <SwapModal
        open={swapModal}
        positionId={positionId}
        onClose={() => {
          setSwapModal(false);
          setPositionId(undefined);
        }}
      />
    </>
  );
};
