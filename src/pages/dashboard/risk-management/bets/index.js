import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { format } from "date-fns";

import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
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
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { toast } from "react-hot-toast";
import { InfoOutlined } from "@mui/icons-material";

import SettingIcon from "src/icons/untitled-ui/duocolor/setting";
import { BetsTableHeader } from "src/sections/dashboard/risk-management/bets/table-header";
import { ChipSet } from "src/components/customize/chipset";
import { CircularProgressWithLabel } from "src/components/loader-with-percentage";
import { ClientFilterInput } from "src/components/customize/client-filter-input";
import { CreateBetDialog } from "src/sections/dashboard/risk-management/bets/create-bet-dialog";
import { FilterDateTime } from "src/components/customize/filter-date-time";
import { FilterInput } from "src/components/customize/filter-input";
import { FilterSelect } from "src/components/customize/filter-select";
import { Iconify } from "src/components/iconify";
import { PageNumberSelect } from "src/components/pagination/page-selector";
import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { RouterLink } from "src/components/router-link";
import { Scrollbar } from "src/components/scrollbar";
import { Seo } from "src/components/seo";
import { SeverityPill } from "src/components/severity-pill";
import { TableModal } from "src/components/table-settings-modal";
import { TableNoData } from "src/components/table-empty";
import { TableSkeleton } from "src/components/table-skeleton";
import { UpdateBetDialog } from "src/sections/dashboard/risk-management/bets/update-bet-dialog";
import { betsApi } from "src/api/bets";
import { copyToClipboard } from "src/utils/copy-to-clipboard";
import { currencyFlagMap, currencyOption } from "src/utils/constant";
import { exportToExcel } from "src/utils/export-excel";
import { paths } from "src/paths";
import { settingsApi } from "src/api/settings";
import { useAuth } from "src/hooks/use-auth";
import { useDebounce } from "src/hooks/use-debounce";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { useSelection } from "src/hooks/use-selection";
import { userApi } from "src/api/user";
import { useTimezone } from "src/hooks/use-timezone";

const statuses = {
  settled_win: "Settled Win",
  settled_loss: "Settled Loss",
  settled_push: "Settled Push",
  pending: "Pending",
  cancelled: "Cancelled",
  voided: "Voided",
};

const statusList = [
  { label: "Open", value: 1 },
  { label: "Settled Win", value: 2 },
  { label: "Settled Lose", value: 3 },
  { label: "Cancelled", value: 4 },
  { label: "Void", value: 5 },
];

const betTypes = [
  { label: "Sports", value: "sports" },
  { label: "Casino", value: "casino" },
  { label: "Virtual", value: "virtual" },
];

const isLiveList = [
  { label: "Live", value: "true" },
  { label: "Not Live", value: "false" },
];

const isVirtualList = [
  { label: "Virtual", value: "true" },
  { label: "Not Virtual", value: "false" },
];

const sourceSystemList = [
  { label: "Internal", value: "internal" },
  { label: "Casino Aggregator", value: "casino_aggregator" },
  { label: "Sports Aggregator", value: "sports_aggregator" },
];

const Page = () => {
  usePageView();
  const { toLocalTime } = useTimezone();
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState();
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const { user, refreshUser } = useAuth();
  const [bets, setBets] = useState([]);
  const [tableModal, setTableModal] = useState(false);
  const [rule, setRule] = useState([]);
  const [webhookData, setWebhookData] = useState(undefined);
  const [webhookDialogOpen, setWebhookDialogOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [progress, setProgress] = useState(10);
  const [columnSorting, setColumnSorting] = useState(null);
  const [createBetDialogOpen, setCreateBetDialogOpen] = useState(false);
  const [updateBetDialogOpen, setUpdateBetDialogOpen] = useState(false);
  const [selectedBet, setSelectedBet] = useState(null);

  const [text, setText] = useState("");
  const q = useDebounce(text, 300);
  const [filters, setFilters] = useState({});

  const updateFilters = (val) => setFilters((prev) => ({ ...prev, ...val }));

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

  const clientIdChip = useMemo(
    () =>
      filters?.client_ids?.length
        ? filters?.client_ids?.map((value) => ({
            displayValue: value,
            value: value,
            label: "Client ID",
          }))
        : [],
    [filters?.client_ids]
  );

  const externalUserIdChip = useMemo(() => {
    const newChips = filters?.external_user_id
      ? [
          {
            displayValue: filters?.external_user_id,
            value: filters?.external_user_id,
            label: "External User ID",
          },
        ]
      : [];
    return newChips;
  }, [filters?.external_user_id]);

  const isLiveChip = useMemo(() => {
    const newChips =
      filters?.is_live !== undefined && filters?.is_live !== "_empty"
        ? [
            {
              displayValue: filters?.is_live === "true" ? "Yes" : "No",
              value: filters?.is_live,
              label: "Live",
            },
          ]
        : [];
    return newChips;
  }, [filters?.is_live]);

  const isVirtualChip = useMemo(() => {
    const newChips =
      filters?.is_virtual !== undefined && filters?.is_virtual !== "_empty"
        ? [
            {
              displayValue: filters?.is_virtual === "true" ? "Yes" : "No",
              value: filters?.is_virtual,
              label: "Virtual",
            },
          ]
        : [];
    return newChips;
  }, [filters?.is_virtual]);

  const betDateStartChip = useMemo(() => {
    return dateChipVal(filters?.bet_date_start, "Bet Date Start");
  }, [filters?.bet_date_start]);

  const betDateEndChip = useMemo(() => {
    return dateChipVal(filters?.bet_date_end, "Bet Date End");
  }, [filters?.bet_date_end]);

  const settlementDateStartChip = useMemo(() => {
    return dateChipVal(filters?.settlement_date_start, "Settlement Date Start");
  }, [filters?.settlement_date_start]);

  const settlementDateEndChip = useMemo(() => {
    return dateChipVal(filters?.settlement_date_end, "Settlement Date End");
  }, [filters?.settlement_date_end]);

  const maxBetAmountChip = useMemo(() => {
    const newChips = filters?.max_bet_amount
      ? [
          {
            displayValue: filters?.max_bet_amount,
            value: filters?.max_bet_amount,
            label: "Max Bet Amount",
          },
        ]
      : [];
    return newChips;
  }, [filters?.max_bet_amount]);

  const minBetAmountChip = useMemo(() => {
    const newChips = filters?.min_bet_amount
      ? [
          {
            displayValue: filters?.min_bet_amount,
            value: filters?.min_bet_amount,
            label: "Min Bet Amount",
          },
        ]
      : [];
    return newChips;
  }, [filters?.min_bet_amount]);

  const maxWinAmountChip = useMemo(() => {
    const newChips = filters?.max_win_amount
      ? [
          {
            displayValue: filters?.max_win_amount,
            value: filters?.max_win_amount,
            label: "Max Win Amount",
          },
        ]
      : [];
    return newChips;
  }, [filters?.max_win_amount]);

  const minWinAmountChip = useMemo(() => {
    const newChips = filters?.min_win_amount
      ? [
          {
            displayValue: filters?.min_win_amount,
            value: filters?.min_win_amount,
            label: "Min Win Amount",
          },
        ]
      : [];
    return newChips;
  }, [filters?.min_win_amount]);

  const betTypeChip = useMemo(() => {
    const newChips = filters?.bet_type
      ? [
          {
            displayValue: filters?.bet_type,
            value: filters?.bet_type,
            label: "Bet Type",
          },
        ]
      : [];
    return newChips;
  }, [filters?.bet_type]);

  const statusChip = useMemo(() => {
    const newChips = filters?.status
      ? [
          {
            displayValue: statusList.find((item) => item.value === filters?.status)?.label,
            value: filters?.status,
            label: "Status",
          },
        ]
      : [];
    return newChips;
  }, [filters?.status]);

  const sourceSystemChip = useMemo(() => {
    const newChips = filters?.source_system
      ? [
          {
            displayValue: filters?.source_system,
            value: filters?.source_system,
            label: "Source System",
          },
        ]
      : [];
    return newChips;
  }, [filters?.source_system]);


  const isFilter =
    idsChip?.length ||
    nonIdsChip?.length ||
    clientIdChip?.length ||
    externalUserIdChip?.length ||
    isLiveChip?.length ||
    isVirtualChip?.length ||
    betDateStartChip?.length ||
    betDateEndChip?.length ||
    settlementDateStartChip?.length ||
    settlementDateEndChip?.length ||
    maxBetAmountChip?.length ||
    minBetAmountChip?.length ||
    maxWinAmountChip?.length ||
    minWinAmountChip?.length ||
    betTypeChip?.length ||
    statusChip?.length ||
    sourceSystemChip?.length;

  const router = useRouter();
  useEffect(() => {
    if (user?.acc?.acc_v_risk_bets === false) {
      router?.push(paths.notFound);
    }
  }, [user]);

  useEffect(() => {
    const riskBetsPerPage = localStorage.getItem("riskBetsPerPage");

    if (riskBetsPerPage) {
      setPerPage(riskBetsPerPage);
    }
  }, []);

  const [betIds, setBetIds] = useState([]);
  const tableIds = useMemo(() => bets?.map((item) => item?.id), [bets]) ?? [];

  const betSelection = useSelection(betIds ?? [], (message) => {
    toast.error(message);
  });
  const enableBulkActions = betSelection.selected?.length > 0;

  const selectedPage = useMemo(
    () => tableIds?.every((item) => betSelection.selected?.includes(item)),
    [tableIds, betSelection.selected]
  );

  const selectedSome = useMemo(
    () =>
      tableIds?.some((item) => betSelection.selected?.includes(item)) &&
      !tableIds?.every((item) => betSelection.selected?.includes(item)),
    [tableIds, tableIds, betSelection.selected]
  );

  const [tableSetting, setTableSetting] = useState(() => {
    try {
      const localTableSetting = localStorage.getItem("tableSetting");
      return localTableSetting ? JSON.parse(localTableSetting) : null;
    } catch (error) {
      return null;
    }
  });

  const accountId = localStorage.getItem("account_id");

  const DEFAULT_COLUMN = [
    ...(user?.acc?.acc_v_bets_id !== false
      ? [
          {
            id: "id",
            label: "ID",
            enabled: true,
            hasSort: true,
            render: (row) => (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Link
                  color="text.primary"
                  component={RouterLink}
                  href={paths.dashboard.risk.bet.replace(":betId", row?.id)}
                  sx={{
                    alignItems: "center",
                    display: "inline-flex",
                  }}
                  underline="hover"
                >
                  <Typography variant="subtitle2">{row?.id}</Typography>
                </Link>
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
              />
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_client_id !== false
      ? [
          {
            id: "client",
            label: "Client",
            enabled: true,
            hasSort: true,
            headerRender: () => (
              <ClientFilterInput updateFilters={updateFilters} />
            ),
            render: (row) => (
              <Link
                color="text.primary"
                component={RouterLink}
                href={`${paths.dashboard.customers.index}/${row?.client_id}`}
                sx={{
                  alignItems: "center",
                  display: "inline-flex",
                }}
                underline="hover"
              >
                <Typography variant="subtitle2">{row?.client_name ?? row?.client_id}</Typography>
              </Link>
            ),
          },
        ]
      : []),
      ...(user?.acc?.acc_v_bets_client_id !== false
        ? [
            {
              id: "client_id",
              label: "Client ID",
              enabled: true,
              hasSort: true,
              render: (row) => (
                <Link
                  color="text.primary"
                  component={RouterLink}
                  href={`${paths.dashboard.customers.index}/${row?.client_id}`}
                  sx={{
                    alignItems: "center",
                    display: "inline-flex",
                  }}
                  underline="hover"
                >
                  <Typography variant="subtitle2">{row?.client_id}</Typography>
                </Link>
              ),
            },
          ]
        : []),
    ...(user?.acc?.acc_v_bets_bet_id !== false
      ? [
          {
            id: "external_bet_id",
            label: "External Bet ID",
            enabled: true,
            hasSort: true,
            render: (row) => (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle2">
                  {row?.external_bet_id || ""}
                </Typography>
                {row?.external_bet_id && (
                  <IconButton
                    edge="end"
                    onClick={() => copyToClipboard(row?.external_bet_id)}
                  >
                    <Iconify
                      icon="mdi:content-copy"
                      color="primary.main"
                      width={20}
                    />
                  </IconButton>
                )}
              </Stack>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_external_brand !== false
      ? [
          {
            id: "external_brand",
            label: "External Brand",
            enabled: true,
            hasSort: true,
            render: (row) => (
              <Typography variant="subtitle2">
                {row?.external_brand || ""}
              </Typography>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_external_user_id !== false
      ? [
          {
            id: "external_user_id",
            label: "External User ID",
            enabled: true,
            hasSort: true,
            render: (row) => (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle2">
                  {row?.external_user_id || ""}
                </Typography>
                {row?.external_user_id && (
                  <IconButton
                    edge="end"
                    onClick={() => copyToClipboard(row?.external_user_id)}
                  >
                    <Iconify
                      icon="mdi:content-copy"
                      color="primary.main"
                      width={20}
                    />
                  </IconButton>
                )}
              </Stack>
            ),
            headerRender: () => (
              <FilterInput
                label="External User ID"
                placeholder="External User ID..."
                filter={filters?.external_user_id}
                setFilter={(val) => {
                  updateFilters({ external_user_id: val, currentPage: 0 });
                }}
              />
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_bet_type !== false
      ? [
          {
            id: "bet_type",
            label: "Bet Type",
            enabled: true,
            hasSort: true,
            headerRender: () => (
              <FilterSelect
                label="Bet Type"
                placeholder="Bet Type..."
                options={betTypes ?? []}
                setValue={(val) => {
                  updateFilters({ bet_type: val });
                }}
                value={filters?.bet_type}
              />
            ),
            render: (row) => (
              <SeverityPill
                color={
                  row?.bet_type === "sports"
                    ? "success"
                    : row?.bet_type === "casino"
                    ? "warning"
                    : "info"
                }
              >
                {row?.bet_type || ""}
              </SeverityPill>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_bet_category !== false
      ? [
          {
            id: "bet_category",
            label: "Bet Category",
            enabled: true,
            hasSort: true,
            render: (row) => (
              <Typography variant="subtitle2">
                {row?.bet_category || ""}
              </Typography>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_bet_amount !== false
      ? [
          {
            id: "bet_amount",
            label: "Bet Amount",
            enabled: true,
            hasSort: true,
            headerRender: () => (
              <FilterInput
                label="Bet Amount"
                type="number"
                placeholder="Max Bet Amount..."
                filter={filters?.max_bet_amount}
                setFilter={(val) => {
                  updateFilters({ max_bet_amount: val });
                }}
                isRange
                placeholder2="Min Bet Amount..."
                filter2={filters?.min_bet_amount}
                setFilter2={(val) => {
                  updateFilters({ min_bet_amount: val });
                }}
              />
            ),
            render: (row) => (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle2">
                  {row?.bet_amount || "0.00"}
                </Typography>
              </Stack>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_win_amount !== false
      ? [
          {
            id: "win_amount",
            label: "Win Amount",
            enabled: true,
            hasSort: true,
            headerRender: () => (
              <FilterInput
                label="Win Amount"
                type="number"
                placeholder="Max Win Amount..."
                filter={filters?.max_win_amount}
                setFilter={(val) => {
                  updateFilters({ max_win_amount: val });
                }}
                isRange
                placeholder2="Min Win Amount..."
                filter2={filters?.min_win_amount}
                setFilter2={(val) => {
                  updateFilters({ min_win_amount: val });
                }}
              />
            ),
            render: (row) => (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography
                  variant="subtitle2"
                  color={row?.win_amount > 0 ? "success.main" : "text.primary"}
                >
                  {row?.win_amount || "0.00"}
                </Typography>
              </Stack>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_potential_win !== false
      ? [
          {
            id: "potential_win",
            label: "Potential Win",
            enabled: true,
            hasSort: true,
            render: (row) => (
              <Typography variant="subtitle2">
                {row?.potential_win || "0.00"}
              </Typography>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_currency !== false
      ? [
          {
            id: "currency",
            label: "Currency",
            enabled: true,
            hasSort: true,
            render: (row) => (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify
                  icon={
                    row?.currency
                      ? currencyFlagMap[row?.currency]
                      : currencyFlagMap[1]
                  }
                  width={24}
                />
                <Typography variant="subtitle2">
                  {row?.currency
                    ? currencyOption?.find(
                        (currency) => currency?.value === row?.currency
                      )?.name
                    : "USD"}
                </Typography>
              </Stack>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_status !== false
      ? [
          {
            id: "status",
            label: "Status",
            enabled: true,
            hasSort: true,
            headerRender: () => (
              <FilterSelect
                label="Status"
                placeholder="Status..."
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
                  row?.status === "settled_win"
                    ? "success"
                    : row?.status === "settled_loss"
                    ? "error"
                    : row?.status === "pending"
                    ? "warning"
                    : "info"
                }
              >
                {statuses[row?.status] || row?.status}
              </SeverityPill>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_settlement_status !== false
      ? [
          {
            id: "settlement_status",
            label: "Settlement Status",
            enabled: true,
            hasSort: true,
            render: (row) => (
              <Typography variant="subtitle2">
                {row?.settlement_status || ""}
              </Typography>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_total_odds !== false
      ? [
          {
            id: "total_odds",
            label: "Total Odds",
            enabled: true,
            hasSort: true,
            render: (row) => (
              <Typography variant="subtitle2">
                {row?.total_odds || ""}
              </Typography>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_selection_count !== false
      ? [
          {
            id: "selection_count",
            label: "Selection Count",
            enabled: true,
            hasSort: true,
            render: (row) => (
              <Typography variant="subtitle2">
                {row?.selection_count || ""}
              </Typography>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_account_id !== false
      ? [
          {
            id: "account_id",
            label: "Account ID",
            enabled: true,
            hasSort: true,
            render: (row) => (
              <Typography variant="subtitle2">
                {row?.account_id || "N/A"}
              </Typography>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_desk_id !== false
      ? [
          {
            id: "desk_id",
            label: "Desk ID",
            enabled: true,
            hasSort: true,
            render: (row) => (
              <Typography variant="subtitle2">
                {row?.desk_id || "N/A"}
              </Typography>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_platform !== false
      ? [
          {
            id: "platform",
            label: "Platform",
            enabled: true,
            hasSort: true,
            render: (row) => (
              <Typography variant="subtitle2">
                {row?.platform || "N/A"}
              </Typography>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_timing !== false
      ? [
          {
            id: "timing",
            label: "Timing",
            enabled: true,
            hasSort: true,
            render: (row) => (
              <Typography variant="subtitle2">
                {row?.timing || "N/A"}
              </Typography>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_real_balance_before !== false
      ? [
          {
            id: "real_balance_before",
            label: "Real Balance Before",
            enabled: true,
            hasSort: true,
            render: (row) => (
              <Typography variant="subtitle2">
                {row?.real_balance_before || "N/A"}
              </Typography>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_real_balance_after !== false
      ? [
          {
            id: "real_balance_after",
            label: "Real Balance After",
            enabled: true,
            hasSort: true,
            render: (row) => (
              <Typography variant="subtitle2">
                {row?.real_balance_after || "N/A"}
              </Typography>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_bonus_balance_before !== false
      ? [
          {
            id: "bonus_balance_before",
            label: "Bonus Balance Before",
            enabled: true,
            hasSort: true,
            render: (row) => (
              <Typography variant="subtitle2">
                {row?.bonus_balance_before || "N/A"}
              </Typography>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_bonus_balance_after !== false
      ? [
          {
            id: "bonus_balance_after",
            label: "Bonus Balance After",
            enabled: true,
            hasSort: true,
            render: (row) => (
              <Typography variant="subtitle2">
                {row?.bonus_balance_after || "N/A"}
              </Typography>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_sport_data !== false
      ? [
          {
            id: "sport_data",
            label: "Sport Data",
            enabled: true,
            hasSort: true,
            render: (row) => {
              if (!row?.sport_data) return "N/A";
              const sportData = row.sport_data;
              return (
                <Typography variant="subtitle2">
                  {sportData.league
                    ? `${sportData.league} - ${sportData.market}`
                    : "N/A"}
                </Typography>
              );
            },
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_competitors !== false
      ? [
          {
            id: "competitors",
            label: "Competitors",
            enabled: true,
            hasSort: true,
            render: (row) => (
              <Typography variant="subtitle2">
                {row?.competitors?.join(" vs ") || "N/A"}
              </Typography>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_webhook_data !== false
      ? [
          {
            id: "webhook_data",
            label: "Webhook Data",
            enabled: true,
            hasSort: true,
            render: (row) => {
              if (!row?.webhook_data) return "N/A";
              return (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <InfoOutlined fontSize="medium" />
                  <Typography
                    onClick={() => {
                      setWebhookData(row.webhook_data);
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
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_description !== false
      ? [
          {
            id: "description",
            label: "Description",
            enabled: true,
            hasSort: true,
            render: (row) => (
              <Typography variant="subtitle2">
                {row?.description || "N/A"}
              </Typography>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_is_live !== false
      ? [
          {
            id: "is_live",
            label: "Live",
            enabled: true,
            hasSort: true,
            render: (row) => (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify
                  icon={
                    row?.is_live
                      ? "mdi:check-circle-outline"
                      : "mdi:close-circle-outline"
                  }
                  color={row?.is_live ? "success.main" : "error.main"}
                  width={24}
                />
              </Stack>
            ),
            headerRender: () => (
              <FilterSelect
                label="Live"
                placeholder="Live..."
                options={isLiveList ?? []}
                setValue={(val) => {
                  updateFilters({ is_live: val });
                }}
                value={filters?.is_live}
              />
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_is_virtual !== false
      ? [
          {
            id: "is_virtual",
            label: "Virtual",
            enabled: true,
            hasSort: true,
            render: (row) => (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify
                  icon={
                    row?.is_virtual
                      ? "mdi:check-circle-outline"
                      : "mdi:close-circle-outline"
                  }
                  color={row?.is_virtual ? "success.main" : "error.main"}
                  width={24}
                />
              </Stack>
            ),
            headerRender: () => (
              <FilterSelect
                label="Virtual"
                placeholder="Virtual..."
                options={isVirtualList ?? []}
                setValue={(val) => {
                  updateFilters({ is_virtual: val });
                }}
                value={filters?.is_virtual}
              />
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_is_cash_out !== false
      ? [
          {
            id: "is_cash_out",
            label: "Cash Out",
            enabled: true,
            hasSort: true,
            render: (row) => (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify
                  icon={
                    row?.is_cash_out
                      ? "mdi:check-circle-outline"
                      : "mdi:close-circle-outline"
                  }
                  color={row?.is_cash_out ? "success.main" : "error.main"}
                  width={24}
                />
              </Stack>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_bet_date !== false
      ? [
          {
            id: "bet_date",
            label: "Bet Date",
            enabled: true,
            hasSort: true,
            headerRender: () => (
              <FilterDateTime
                label="Bet Date"
                isRange
                subLabel1="Start"
                subLabel2="End"
                filter={filters?.bet_date_start}
                setFilter={(val) => {
                  updateFilters({ bet_date_start: val });
                }}
                filter2={filters?.bet_date_end}
                setFilter2={(val) => {
                  updateFilters({ bet_date_end: val });
                }}
              />
            ),
            render: (row) => (
              <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                {row?.bet_date ? toLocalTime(row?.bet_date) : ""}
              </Typography>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_settlement_date !== false
      ? [
          {
            id: "settlement_date",
            label: "Settlement Date",
            enabled: true,
            hasSort: true,
            headerRender: () => (
              <FilterDateTime
                label="Settlement Date"
                isRange
                subLabel1="Start"
                subLabel2="End"
                filter={filters?.settlement_date_start}
                setFilter={(val) => {
                  updateFilters({ settlement_date_start: val });
                }}
                filter2={filters?.settlement_date_end}
                setFilter2={(val) => {
                  updateFilters({ settlement_date_end: val });
                }}
              />
            ),
            render: (row) => (
              <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                {row?.settlement_date
                  ? toLocalTime(row?.settlement_date)
                  : ""}
              </Typography>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_event_date !== false
      ? [
          {
            id: "event_date",
            label: "Event Date",
            enabled: true,
            hasSort: true,
            render: (row) => (
              <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                {row?.event_date
                  ? toLocalTime(row?.event_date)
                  : ""}
              </Typography>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_source_system !== false
      ? [
          {
            id: "source_system",
            label: "Source System",
            enabled: true,
            hasSort: true,
            headerRender: () => (
              <FilterSelect
                label="Source System"
                placeholder="Source System..."
                options={sourceSystemList ?? []}
                setValue={(val) => {
                  updateFilters({ source_system: val });
                }}
                value={filters?.source_system}
              />
            ),
            render: (row) => (
              <Typography variant="subtitle2">
                {row?.source_system || ""}
              </Typography>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_processing_status !== false
      ? [
          {
            id: "processing_status",
            label: "Processing Status",
            enabled: true,
            hasSort: true,
            render: (row) => (
              <SeverityPill
                color={
                  row?.processing_status === "processed"
                    ? "success"
                    : row?.processing_status === "processing"
                    ? "warning"
                    : "error"
                }
              >
                {row?.processing_status || ""}
              </SeverityPill>
            ),
          },
        ]
      : []),
    ...(user?.acc?.acc_v_bets_created_at !== false
      ? [
          {
            id: "created_at",
            label: "Created Date",
            enabled: true,
            hasSort: true,
            render: (row) => (
              <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                {toLocalTime(row?.created_at)}
              </Typography>
            ),
          },
        ]
      : []),
    {
      id: "actions",
      label: "Actions",
      enabled: true,
      render: (row) => {
        if (
          user?.acc?.acc_e_risk_bet === undefined ||
          user?.acc?.acc_e_risk_bet
        ) {
          return (
            <Stack
              direction="row"
              alignItems="center"
              sx={{ maxHeight: 28, overflow: "hidden" }}
            >
              <Tooltip title="Edit">
                <IconButton
                  onClick={() => {
                    setSelectedBet(row);
                    setUpdateBetDialogOpen(true);
                  }}
                  sx={{ "&:hover": { color: "primary.main" } }}
                >
                  <Iconify icon="mage:edit" width={22} />
                </IconButton>
              </Tooltip>
              {user?.acc?.acc_e_risk_bet_delete === undefined ||
              user?.acc?.acc_e_risk_bet_delete ? (
              <Tooltip title="Delete">
                <IconButton
                  onClick={() => handleDeleteBet(row.id)}
                  sx={{ "&:hover": { color: "error.main" } }}
                >
                  <Iconify icon="heroicons:trash" width={22} />
                </IconButton>
              </Tooltip>
              ) : null}
            </Stack>
          );
        }
      },
    },
  ];

  const [defaultColumn, setDefaultColumn] = useState(DEFAULT_COLUMN);
  const prevColumn = useRef();

  const handleRemoveChip = (value, target) => {
    if (target === "ids") {
      updateFilters({ ids: undefined });
    }
    if (target === "client_id") {
      const newArrays = [...filters?.client_ids].filter(
        (item) => item !== value
      );
      updateFilters({ client_ids: newArrays });
    }
    if (target === "external_user_id") {
      updateFilters({ external_user_id: undefined });
    }
    if (target === "is_live") {
      updateFilters({ is_live: undefined });
    }
    if (target === "is_virtual") {
      updateFilters({ is_virtual: undefined });
    }
    if (target === "bet_date_start") {
      updateFilters({ bet_date_start: undefined });
    }
    if (target === "bet_date_end") {
      updateFilters({ bet_date_end: undefined });
    }
    if (target === "settlement_date_start") {
      updateFilters({ settlement_date_start: undefined });
    }
    if (target === "settlement_date_end") {
      updateFilters({ settlement_date_end: undefined });
    }
    if (target === "max_bet_amount") {
      updateFilters({ max_bet_amount: undefined });
    }
    if (target === "min_bet_amount") {
      updateFilters({ min_bet_amount: undefined });
    }
    if (target === "max_win_amount") {
      updateFilters({ max_win_amount: undefined });
    }
    if (target === "min_win_amount") {
      updateFilters({ min_win_amount: undefined });
    }
    if (target === "bet_type") {
      updateFilters({ bet_type: undefined });
    }
    if (target === "status") {
      updateFilters({ status: undefined });
    }
    if (target === "source_system") {
      updateFilters({ source_system: undefined });
    }
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBetId, setSelectedBetId] = useState(null);

  useEffect(() => {
    if (JSON.stringify(prevColumn.current) !== JSON.stringify(DEFAULT_COLUMN)) {
      setDefaultColumn(DEFAULT_COLUMN);
      prevColumn.current = DEFAULT_COLUMN;
    }
  }, [DEFAULT_COLUMN]);

  const handleDeleteBet = (betId) => {
    setSelectedBetId(betId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await betsApi.deleteBet(selectedBetId);
      toast.success("Bet deleted successfully");
      getBets();
      setDeleteDialogOpen(false);
      setSelectedBetId(null);
    } catch (error) {
      console.error("Error deleting bet:", error);
      toast.error("Failed to delete bet");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedBetId(null);
  };

  const getBets = async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const { client_ids, ...rest } = filters;
      const params = {
        q: q?.length > 0 ? q : null,
        page: currentPage + 1,
        per_page: perPage ?? 10,
        ...rest,
      };

      if (filters?.ids?.length) {
        params.ids = [filters?.ids];
      }
      if (filters?.client_ids?.length) {
        params.client_id = filters?.client_ids[0];
      }

      if (columnSorting) {
        params.sorting = columnSorting;
      }

      const res = await betsApi.getBets(params);
      setTotalCount(res?.total_count);
      setBets(res?.bets ?? []);
      setBetIds([
        ...new Set([...betIds, ...res?.bets?.map((item) => item?.id)]),
      ]);
    } catch (error) {
      console.error("error: ", error);

      if (error?.response?.status === 500) {
        setColumnSorting({});
        toast.error("Sorting reset due to server error. Please try again.");
      }
    }
  };

  const getTrx = async () => {
    setIsLoading(true);
    try {
      await getBets();
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
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

      const checkParams = {
        per_page: 1000,
        page: currentPage + 1,
        q: q?.length ? q : null,
      };

      if (!betSelection?.selectAll) {
        checkParams["ids"] = betSelection?.selected;
      }

      if (filters?.ids?.length) {
        checkParams.ids = [filters?.ids];
      }

      if (filters?.client_ids?.length) {
        checkParams.client_id = filters?.client_ids[0];
      }

      if (columnSorting) {
        checkParams.sorting = columnSorting;
      }

      const checkRes = await betsApi.getBets(checkParams);
      const totalBets = checkRes?.total_count;
      const perPage = 1000;
      const numPages = Math.ceil(totalBets / perPage);

      for (let page = 1; page <= numPages; page++) {
        const newParams = {
          page,
          per_page: perPage,
          q: q?.length ? q : null,
        };

        if (!betSelection?.selectAll) {
          newParams["ids"] = betSelection?.selected;
        }

        if (filters?.ids?.length) {
          newParams.ids = [filters?.ids];
        }

        if (filters?.client_ids?.length) {
          newParams.client_id = filters?.client_ids[0];
        }

        if (columnSorting) {
          newParams.sorting = columnSorting;
        }

        const newRes = await betsApi.getBets(newParams);

        const dataIds = data?.map((d) => d?.id);
        data.push(
          ...newRes?.bets?.filter((bet) => !dataIds?.includes(bet?.id))
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

      const modifiedArray = excelData?.map((obj) => {
        const modifiedObj = {};
        filteredAndSortedFields.forEach((field) => {
          if (field === "id") modifiedObj["id"] = obj?.id;
          else if (field === "client_id") modifiedObj["client id"] = obj?.client_id;
          else if (field === "external_bet_id") modifiedObj["external bet id"] = obj?.external_bet_id || "";
          else if (field === "external_brand") modifiedObj["external brand"] = obj?.external_brand || "";
          else if (field === "external_user_id") modifiedObj["external user id"] = obj?.external_user_id || "";
          else if (field === "bet_type") modifiedObj["bet type"] = obj?.bet_type || "";
          else if (field === "bet_category") modifiedObj["bet category"] = obj?.bet_category || "";
          else if (field === "bet_amount") modifiedObj["bet amount"] = obj?.bet_amount || "0.00";
          else if (field === "win_amount") modifiedObj["win amount"] = obj?.win_amount || "0.00";
          else if (field === "potential_win") modifiedObj["potential win"] = obj?.potential_win || "0.00";
          else if (field === "currency") modifiedObj["currency"] = obj?.currency ? currencyOption?.find((currency) => currency?.value === obj?.currency)?.name : "USD";
          else if (field === "status") modifiedObj["status"] = statuses[obj?.status] || obj?.status;
          else if (field === "settlement_status") modifiedObj["settlement status"] = obj?.settlement_status || "";
          else if (field === "total_odds") modifiedObj["total odds"] = obj?.total_odds || "";
          else if (field === "selection_count") modifiedObj["selection count"] = obj?.selection_count || "";
          else if (field === "is_live") modifiedObj["is live"] = obj?.is_live ? "Yes" : "No";
          else if (field === "is_virtual") modifiedObj["is virtual"] = obj?.is_virtual ? "Yes" : "No";
          else if (field === "is_cash_out") modifiedObj["is cash out"] = obj?.is_cash_out ? "Yes" : "No";
          else if (field === "competitors") modifiedObj["competitors"] = obj?.competitors?.join(" vs ") || "";
          else if (field === "bet_date") modifiedObj["bet date"] = obj?.bet_date ? toLocalTime(obj?.bet_date) : "";
          else if (field === "settlement_date") modifiedObj["settlement date"] = obj?.settlement_date ? toLocalTime(obj?.settlement_date) : "";
          else if (field === "event_date") modifiedObj["event date"] = obj?.event_date ? toLocalTime(obj?.event_date) : "";
          else if (field === "source_system") modifiedObj["source system"] = obj?.source_system || "";
          else if (field === "processing_status") modifiedObj["processing status"] = obj?.processing_status || "";
          else if (field === "created_at") modifiedObj["created date"] = obj?.created_at ? toLocalTime(obj?.created_at) : "";
          else if (field === "account_id") modifiedObj["account id"] = obj?.account_id || "N/A";
          else if (field === "desk_id") modifiedObj["desk id"] = obj?.desk_id || "N/A";
          else if (field === "platform") modifiedObj["platform"] = obj?.platform || "N/A";
          else if (field === "timing") modifiedObj["timing"] = obj?.timing || "N/A";
          else if (field === "real_balance_before") modifiedObj["real balance before"] = obj?.real_balance_before || "N/A";
          else if (field === "real_balance_after") modifiedObj["real balance after"] = obj?.real_balance_after || "N/A";
          else if (field === "bonus_balance_before") modifiedObj["bonus balance before"] = obj?.bonus_balance_before || "N/A";
          else if (field === "bonus_balance_after") modifiedObj["bonus balance after"] = obj?.bonus_balance_after || "N/A";
          else if (field === "sport_data") modifiedObj["sport data"] = obj?.sport_data ? (obj.sport_data.league ? `${obj.sport_data.league} - ${obj.sport_data.market}` : "N/A") : "N/A";
          else if (field === "webhook_data") modifiedObj["webhook data"] = obj?.webhook_data ? "See Detail" : "";
          else if (field === "description") modifiedObj["description"] = obj?.description || "N/A";
          else modifiedObj[field] = obj[field];
        });
        return modifiedObj;
      });

      exportToExcel(modifiedArray, `bets-export-${exportDate}`);

      localStorage.setItem("last_beat_time", new Date().getTime());
      await settingsApi.updateMember(accountId, {
        last_beat: true,
        trigger: "export",
        export_filter_data: JSON.stringify(params),
        export_count: betSelection?.selectAll
          ? excelData?.length + ""
          : betSelection?.selected?.length
          ? betSelection?.selected?.length + ""
          : 0,
        export_table: "Bets",
      });
    } else {
      const modifiedArray = excelData?.map((obj) => {
        const modifiedObj = {};
        defaultColumn
          ?.map((setting) => setting?.id)
          ?.forEach((field) => {
            if (field === "id") {
              modifiedObj["id"] = obj?.id;
            } else if (field === "client_id") {
              modifiedObj["client id"] = obj?.client_id;
            } else if (field === "external_bet_id") {
              modifiedObj["external bet id"] = obj?.external_bet_id || "";
            } else if (field === "external_brand") {
              modifiedObj["external brand"] = obj?.external_brand || "";
            } else if (field === "external_user_id") {
              modifiedObj["external user id"] = obj?.external_user_id || "";
            } else if (field === "bet_type") {
              modifiedObj["bet type"] = obj?.bet_type || "";
            } else if (field === "bet_category") {
              modifiedObj["bet category"] = obj?.bet_category || "";
            } else if (field === "bet_amount") {
              modifiedObj["bet amount"] = obj?.bet_amount || "0.00";
            } else if (field === "win_amount") {
              modifiedObj["win amount"] = obj?.win_amount || "0.00";
            } else if (field === "potential_win") {
              modifiedObj["potential win"] = obj?.potential_win || "0.00";
            } else if (field === "currency") {
              modifiedObj["currency"] = obj?.currency
                ? currencyOption?.find(
                    (currency) => currency?.value === obj?.currency
                  )
                : "USD";
            } else if (field === "status") {
              modifiedObj["status"] = statuses[obj?.status] || obj?.status;
            } else if (field === "settlement_status") {
              modifiedObj["settlement status"] = obj?.settlement_status || "";
            } else if (field === "total_odds") {
              modifiedObj["total odds"] = obj?.total_odds || "";
            } else if (field === "selection_count") {
              modifiedObj["selection count"] = obj?.selection_count || "";
            } else if (field === "is_live") {
              modifiedObj["is live"] = obj?.is_live ? "Yes" : "No";
            } else if (field === "is_virtual") {
              modifiedObj["is virtual"] = obj?.is_virtual ? "Yes" : "No";
            } else if (field === "is_cash_out") {
              modifiedObj["is cash out"] = obj?.is_cash_out ? "Yes" : "No";
            } else if (field === "competitors") {
              modifiedObj["competitors"] = obj?.competitors?.join(" vs ") || "";
            } else if (field === "bet_date") {
              modifiedObj["bet date"] = obj?.bet_date 
                ? toLocalTime(obj?.bet_date, user?.timezone)
                : "";
            } else if (field === "settlement_date") {
              modifiedObj["settlement date"] = obj?.settlement_date
                ? toLocalTime(obj?.settlement_date, user?.timezone)
                : "";
            } else if (field === "event_date") {
              modifiedObj["event date"] = obj?.event_date
                ? toLocalTime(obj?.event_date, user?.timezone)
                : "";
            } else if (field === "source_system") {
              modifiedObj["source system"] = obj?.source_system || "";
            } else if (field === "processing_status") {
              modifiedObj["processing status"] = obj?.processing_status || "";
            } else if (field === "created_at") {
              modifiedObj["created date"] = obj?.created_at
                ? toLocalTime(obj?.created_at, user?.timezone)
                : "";
            } else if (field === "account_id") {
              modifiedObj["account id"] = obj?.account_id || "N/A";
            } else if (field === "desk_id") {
              modifiedObj["desk id"] = obj?.desk_id || "N/A";
            } else if (field === "platform") {
              modifiedObj["platform"] = obj?.platform || "N/A";
            } else if (field === "timing") {
              modifiedObj["timing"] = obj?.timing || "N/A";
            } else if (field === "real_balance_before") {
              modifiedObj["real balance before"] =
                obj?.real_balance_before || "N/A";
            } else if (field === "real_balance_after") {
              modifiedObj["real balance after"] =
                obj?.real_balance_after || "N/A";
            } else if (field === "bonus_balance_before") {
              modifiedObj["bonus balance before"] =
                obj?.bonus_balance_before || "N/A";
            } else if (field === "bonus_balance_after") {
              modifiedObj["bonus balance after"] =
                obj?.bonus_balance_after || "N/A";
            } else if (field === "sport_data") {
              if (obj?.sport_data) {
                const sportData = obj.sport_data;
                modifiedObj["sport data"] = sportData.league
                  ? `${sportData.league} - ${sportData.market}`
                  : "N/A";
              } else {
                modifiedObj["sport data"] = "N/A";
              }
            } else if (field === "webhook_data") {
              modifiedObj["webhook data"] = obj?.webhook_data
                ? "See Detail"
                : "";
            } else if (field === "description") {
              modifiedObj["description"] = obj?.description || "N/A";
            } else {
              modifiedObj[field] = obj[field];
            }
          });
        return modifiedObj;
      });

      if (modifiedArray)
        exportToExcel(modifiedArray, `bets-export-${exportDate}`);

      localStorage.setItem("last_beat_time", new Date().getTime());
      await settingsApi.updateMember(accountId, {
        last_beat: true,
        trigger: "export",
        export_filter_data: JSON.stringify(params),
        export_count: betSelection?.selectAll
          ? excelData?.length + ""
          : betSelection?.selected?.length
          ? betSelection?.selected?.length + ""
          : 0,
        export_table: "Bets",
      });
    }
  }, [
    perPage,
    currentPage,
    q,
    betSelection,
    rule,
    user?.timezone,
    defaultColumn,
    columnSorting,
  ]);

  useEffect(() => {
    if (!isLoading) {
      const intervalId = setInterval(() => {
        getBets();
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [isLoading]);

  useEffect(() => {
    getTrx();
  }, [
    perPage,
    currentPage,
    q,
    filters,
    idsChip,
    nonIdsChip,
    clientIdChip,
    columnSorting,
  ]);

  const updateRule = (rule) => {
    setRule(rule);

    const newTableSetting = {
      ...tableSetting,
      betsTable: rule,
    };
    
    setTableSetting(newTableSetting);
    localStorage.setItem("tableSetting", JSON.stringify(newTableSetting));
  };

  const handleSortReset = async () => {
    setColumnSorting({});
    if (user?.column_setting) {
      const updateSetting = {
        ...JSON.parse(user?.column_setting),
        betsSorting: {},
      };
      await userApi.updateUser(accountId, {
        column_setting: JSON.stringify(updateSetting),
      });
      setTimeout(() => {
        refreshUser();
      }, 1500);
    }
  };

  useEffect(() => {
    setRule(tableSetting?.betsTable ?? []);
  }, [tableSetting]);

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const localTableSetting = localStorage.getItem("tableSetting");
        if (localTableSetting) {
          const parsed = JSON.parse(localTableSetting);
          setTableSetting(parsed);
        }
      } catch (error) {
        console.error("Error parsing table settings:", error);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    try {
      const localTableSetting = localStorage.getItem("tableSetting");
      if (localTableSetting) {
        const parsed = JSON.parse(localTableSetting);
        setTableSetting(parsed);
      }
    } catch (error) {
      console.error("Error parsing initial table settings:", error);
    }
  }, []);

  useEffect(() => {
    if (user?.column_setting) {
      try {
        const userColumnSetting = JSON.parse(user.column_setting);
        const currentTableSetting = tableSetting || {};
        
        const updatedTableSetting = {
          ...currentTableSetting,
          betsSorting: userColumnSetting.betsSorting || {},
          betsPinnedFields: userColumnSetting.betsPinnedFields || [],
        };
        
        setTableSetting(updatedTableSetting);
        localStorage.setItem("tableSetting", JSON.stringify(updatedTableSetting));
      } catch (error) {
        console.error("Error parsing user column settings:", error);
      }
    }
  }, [user?.column_setting]);

  useEffect(() => {
    if (user?.column_setting) {
      setColumnSorting(JSON.parse(user?.column_setting)?.betsSorting);
    }
  }, [user]);

  useEffect(() => {
    if (user?.column_setting) {
      const updateSetting = {
        ...tableSetting,
        betsSorting: columnSorting,
      };
      setTableSetting(updateSetting);
      localStorage.setItem("tableSetting", JSON.stringify(updateSetting));
    }
  }, [columnSorting, user?.column_setting, tableSetting]);

  useEffect(() => {
    setCurrentPage(0);
  }, [columnSorting]);

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
  }, [rule, defaultColumn]);

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

  useEffect(() => {
    if (!tableSetting?.betsTable && defaultColumn?.length > 0) {
      const defaultTableSettings = {
        betsTable: defaultColumn.map((item, index) => ({
          id: item.id,
          enabled: item.enabled,
          order: index,
        })),
        betsSorting: {},
        betsPinnedFields: [],
      };
      
      setTableSetting(defaultTableSettings);
      localStorage.setItem("tableSetting", JSON.stringify(defaultTableSettings));
    }
  }, [tableSetting?.betsTable, defaultColumn]);

  return (
    <>
      <Seo title={`Dashboard: Bets`} />
      <Box component="main" sx={{ flexGrow: 1, pt: 7, pb: 2 }}>
        <Container maxWidth="xxl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Bets</Typography>
              </Stack>
              {user?.acc?.acc_e_create_bets !== false && (
                <Button
                  variant="contained"
                  onClick={() => setCreateBetDialogOpen(true)}
                  startIcon={<Iconify icon="eva:plus-fill" />}
                >
                  Create
                </Button>
              )}
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
                      icon="svg-spinners:8-dots-rotate"
                      width={24}
                      sx={{ color: "white" }}
                    />
                  )}
                  <Tooltip title="Reload Table">
                    <IconButton
                      onClick={() => getTrx()}
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
                  {columnSorting && Object.keys(columnSorting).length > 0 && (
                    <Tooltip title="Reset Sorting">
                      <IconButton
                        onClick={handleSortReset}
                        sx={{ "&:hover": { color: "error.main" } }}
                      >
                        <Iconify icon="mdi:sort-variant-remove" width={24} />
                      </IconButton>
                    </Tooltip>
                  )}
                  {/* {isFilter && (
                    <Badge variant="dot" color="error">
                      <SvgIcon>
                        <FilterIcon />
                      </SvgIcon>
                    </Badge>
                  )} */}
                  {exportLoading ? (
                    <CircularProgressWithLabel value={progress} />
                  ) : enableBulkActions ? (
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
                        chips={idsChip}
                        handleRemoveChip={() => handleRemoveChip(null, "ids")}
                      />
                      <ChipSet
                        chips={nonIdsChip}
                        handleRemoveChip={() =>
                          handleRemoveChip(null, "non_ids")
                        }
                      />
                      <ChipSet
                        chips={clientIdChip}
                        handleRemoveChip={(value) =>
                          handleRemoveChip(value, "client_id")
                        }
                      />
                      <ChipSet
                        chips={externalUserIdChip}
                        handleRemoveChip={(value) =>
                          handleRemoveChip(value, "external_user_id")
                        }
                      />
                      <ChipSet
                        chips={isLiveChip}
                        handleRemoveChip={(value) =>
                          handleRemoveChip(value, "is_live")
                        }
                      />
                      <ChipSet
                        chips={isVirtualChip}
                        handleRemoveChip={(value) =>
                          handleRemoveChip(value, "is_virtual")
                        }
                      />
                      <ChipSet
                        chips={betDateStartChip}
                        handleRemoveChip={(value) =>
                          handleRemoveChip(value, "bet_date_start")
                        }
                      />
                      <ChipSet
                        chips={betDateEndChip}
                        handleRemoveChip={(value) =>
                          handleRemoveChip(value, "bet_date_end")
                        }
                      />
                      <ChipSet
                        chips={settlementDateStartChip}
                        handleRemoveChip={(value) =>
                          handleRemoveChip(value, "settlement_date_start")
                        }
                      />
                      <ChipSet
                        chips={settlementDateEndChip}
                        handleRemoveChip={(value) =>
                          handleRemoveChip(value, "settlement_date_end")
                        }
                      />
                      <ChipSet
                        chips={maxBetAmountChip}
                        handleRemoveChip={(value) =>
                          handleRemoveChip(value, "max_bet_amount")
                        }
                      />
                      <ChipSet
                        chips={minBetAmountChip}
                        handleRemoveChip={(value) =>
                          handleRemoveChip(value, "min_bet_amount")
                        }
                      />
                      <ChipSet
                        chips={maxWinAmountChip}
                        handleRemoveChip={(value) =>
                          handleRemoveChip(value, "max_win_amount")
                        }
                      />
                      <ChipSet
                        chips={minWinAmountChip}
                        handleRemoveChip={(value) =>
                          handleRemoveChip(value, "min_win_amount")
                        }
                      />
                      <ChipSet
                        chips={betTypeChip}
                        handleRemoveChip={(value) =>
                          handleRemoveChip(value, "bet_type")
                        }
                      />
                      <ChipSet
                        chips={statusChip}
                        handleRemoveChip={(value) =>
                          handleRemoveChip(value, "status")
                        }
                      />
                    </Stack>
                    <ChipSet
                      chips={sourceSystemChip}
                      handleRemoveChip={(value) =>
                        handleRemoveChip(value, "source_system")
                      }
                    />
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
                              betSelection.handleDeSelectPage(tableIds);
                            } else {
                              betSelection.handleSelectPage(tableIds);
                            }
                          } else {
                            betSelection.handleDeSelectPage(tableIds);
                          }
                        }}
                      />
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        pl={2}
                      >
                        {betSelection.selectAll ? (
                          <Typography sx={{ whiteSpace: "nowrap" }}>
                            Selected all <strong>{totalCount}</strong> items
                          </Typography>
                        ) : (
                          <Typography sx={{ whiteSpace: "nowrap" }}>
                            Selected{" "}
                            <strong>{betSelection.selected?.length}</strong> of{" "}
                            <strong>{totalCount}</strong>
                          </Typography>
                        )}
                      </Stack>
                      {!betSelection.selectAll && (
                        <Button onClick={() => betSelection.handleSelectAll()}>
                          <Typography sx={{ whiteSpace: "nowrap" }}>
                            Selected All
                          </Typography>
                        </Button>
                      )}
                      <Button onClick={() => betSelection.handleDeselectAll()}>
                        <Typography sx={{ whiteSpace: "nowrap" }}>
                          Clear Selection
                        </Typography>
                      </Button>
                    </Stack>
                  ) : null}
                  <Scrollbar>
                    <Table sx={{ minWidth: 700 }}>
                      <BetsTableHeader
                        selected={betSelection.selected}
                        isLoading={isLoading && bets.length == 0}
                        selectedSome={selectedSome}
                        onDeselectPage={betSelection.handleDeSelectPage}
                        onSelectPage={betSelection.handleSelectPage}
                        onSortingSet={setColumnSorting}
                        sortingState={columnSorting}
                        columnSettings={
                          user?.column_setting
                            ? JSON.parse(user?.column_setting)
                            : null
                        }
                        tableIds={tableIds}
                        tableColumn={tableColumn}
                        rule={rule}
                      />
                      <TableBody>
                        {isLoading && bets.length == 0 ? (
                          <TableSkeleton
                            cellCount={
                              tableColumn?.filter((item) => item.enabled)
                                ?.length + 1
                            }
                            rowCount={perPage > 15 ? 15 : 10}
                          />
                        ) : (
                          bets?.map((bet) => {
                            const isSelected = betSelection.selected.includes(
                              bet?.id
                            );
                            return (
                              <TableRow key={bet?.id}>
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    sx={{ p: 0 }}
                                    checked={isSelected}
                                    onChange={(event) => {
                                      if (event.target.checked) {
                                        betSelection.handleSelectOne?.(bet?.id);
                                      } else {
                                        betSelection.handleDeselectOne?.(
                                          bet?.id
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
                                      key={bet.id + index}
                                    >
                                      {column?.render
                                        ? column?.render(bet)
                                        : bet[column?.id]}
                                    </TableCell>
                                  ))}
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                    {!isLoading && bets.length === 0 && (
                      <TableNoData label="No bets found." />
                    )}
                    <Divider />
                  </Scrollbar>
                </Box>

                <Stack
                  sx={{
                    flexDirection: { md: "row", xs: "column" },
                    gap: 0,
                    justifyContent: "flex-end",
                    alignItems: { md: "center", xs: "start" },
                  }}
                >
                  <PageNumberSelect
                    currentPage={currentPage}
                    totalPage={totalCount ? Math.ceil(totalCount / perPage) : 0}
                    onUpdate={setCurrentPage}
                  />
                  <TablePagination
                    component="div"
                    labelRowsPerPage="Per page"
                    count={totalCount ?? 0}
                    onPageChange={(event, index) => setCurrentPage(index)}
                    onRowsPerPageChange={(event) => {
                      setPerPage(event?.target?.value);
                      localStorage.setItem(
                        "riskBetsPerPage",
                        event?.target?.value
                      );
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

      <TableModal
        open={tableModal}
        onClose={() => setTableModal(false)}
        tableColumn={tableColumn}
        defaultColumn={defaultColumn}
        updateRule={updateRule}
      />

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
          {webhookData &&
            (() => {
              const parsedWebhookData =
                typeof webhookData === "string"
                  ? JSON.parse(webhookData)
                  : webhookData;
              return (
                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Sport Match ID
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {parsedWebhookData.sport_match_id || "N/A"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Last Bet ID
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {parsedWebhookData.sport_last_bet_id || "N/A"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Last Bet Type
                      </Typography>
                      <Typography variant="body1">
                        {parsedWebhookData.sport_last_bet_type || "N/A"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Last Bet Amount
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "success.main" }}
                      >
                        $
                        {parsedWebhookData.sport_last_bet_amount?.toFixed(2) ||
                          "0.00"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Last Selection ID
                      </Typography>
                      <Typography variant="body1">
                        {parsedWebhookData.sport_last_selection_id || "N/A"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Last Selection Odds
                      </Typography>
                      <Typography variant="body1">
                        {parsedWebhookData.sport_last_selection_odds || "N/A"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Last Selection League
                      </Typography>
                      <Typography variant="body1">
                        {parsedWebhookData.sport_last_selection_league || "N/A"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Last Selection Market
                      </Typography>
                      <Typography variant="body1">
                        {parsedWebhookData.sport_last_selection_market || "N/A"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Last Selection Outcome
                      </Typography>
                      <Typography variant="body1">
                        {parsedWebhookData.sport_last_selection_outcome ||
                          "N/A"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Last Selection Sport Type
                      </Typography>
                      <Typography variant="body1">
                        {parsedWebhookData.sport_last_selection_sport_type ||
                          "N/A"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Last Selection Count
                      </Typography>
                      <Typography variant="body1">
                        {parsedWebhookData.sport_last_bet_selection_count ||
                          "N/A"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Home Team
                      </Typography>
                      <Typography variant="body1">
                        {parsedWebhookData.sport_last_selection_home_team ||
                          "N/A"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Away Team
                      </Typography>
                      <Typography variant="body1">
                        {parsedWebhookData.sport_last_selection_away_team ||
                          "N/A"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Settlement Status
                      </Typography>
                      <Typography variant="body1">
                        {parsedWebhookData.sport_last_selection_settlement_status ||
                          "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              );
            })()}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setWebhookDialogOpen(false);
              setWebhookData(undefined);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <CreateBetDialog
        open={createBetDialogOpen}
        onClose={() => setCreateBetDialogOpen(false)}
        onSuccess={getTrx}
      />

      <UpdateBetDialog
        open={updateBetDialogOpen}
        onClose={() => {
          setUpdateBetDialogOpen(false);
          setSelectedBet(null);
        }}
        onSuccess={getTrx}
        bet={selectedBet}
      />

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Bet</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this bet? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Page;
