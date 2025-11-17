import { useCallback, useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import OutlinedInput from "@mui/material/OutlinedInput";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import { format } from "date-fns";

import { gameProvidersApi } from "src/api/game-providers";
import { Scrollbar } from "src/components/scrollbar";
import { TableNoData } from "src/components/table-empty";
import { TableSkeleton } from "src/components/table-skeleton";
import { useMounted } from "src/hooks/use-mounted";
import { usePopover } from "src/hooks/use-popover";
import { useDebounce } from "src/hooks/use-debounce";
import { FilterSelect } from "src/components/customize/filter-select";
import { ChipSet } from "src/components/customize/chipset";
import { Iconify } from "src/components/iconify";

const TextFilter = ({ value, onApply, label, placeholder }) => {
  const popover = usePopover();
  const [inputValue, setInputValue] = useState(value || "");

  const handleApply = useCallback(() => {
    onApply(inputValue);
    popover.handleClose();
  }, [inputValue, onApply, popover]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter") {
      handleApply();
    }
  }, [handleApply]);

  return (
    <>
      <Button
        color="inherit"
        endIcon={<Iconify icon="icon-park-outline:down" width={20} />}
        sx={{ p: 0 }}
        onClick={popover.handleOpen}
        ref={popover.anchorRef}
      >
        <Typography
          fontSize={14}
          fontWeight="600"
          sx={{ whiteSpace: "nowrap", textTransform: "uppercase" }}
        >
          {label}
        </Typography>
      </Button>
      <Menu
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
        PaperProps={{ style: { px: 2 } }}
      >
        <Stack sx={{ p: 2 }} direction="row" alignItems="center" spacing={2}>
          <OutlinedInput
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            size="small"
          />
          <IconButton onClick={handleApply}>
            <Iconify icon="material-symbols:check" width={26} color="primary.main" />
          </IconButton>
        </Stack>
      </Menu>
    </>
  );
};

export const GameProviderReceivedWebhooks = ({
  provider,
  selectedBrandId,
}) => {
  const isMounted = useMounted();
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    totalCount: 0,
    totalPages: 0,
  });
  const [gameProviders, setGameProviders] = useState([]);
  const [providerTypeFilter, setProviderTypeFilter] = useState("");
  const [callbackTypeFilter, setCallbackTypeFilter] = useState("");
  const [actionTypeFilter, setActionTypeFilter] = useState("");
  const [processingStatusFilter, setProcessingStatusFilter] = useState("");
  const [sessionIdFilter, setSessionIdFilter] = useState("");
  const [sessionIdInput, setSessionIdInput] = useState("");
  const [transactionIdFilter, setTransactionIdFilter] = useState("");
  const [transactionIdInput, setTransactionIdInput] = useState("");
  const [searchText, setSearchText] = useState("");
  
  const debouncedSearch = useDebounce(searchText, 300);

  const managedProviderId = provider?.id;
  const gamingProviderId = provider?.provider_id || provider?.gaming_provider_id;
  const providerType = provider?.provider_type;
  const providerDisplayName =
    provider?.provider_display_name ||
    provider?.display_name ||
    provider?.name ||
    "Provider";

  useEffect(() => {
    const fetchGameProviders = async () => {
      try {
        const response = await gameProvidersApi.getGameProviders();
        const providers = response?.data?.providers || response?.providers || [];
        
        if (isMounted()) {
          setGameProviders(providers);
        }
      } catch (err) {
        console.error("Failed to load game providers:", err);
      }
    };

    fetchGameProviders();
  }, [isMounted]);

  const providerOptions = useMemo(
    () =>
      gameProviders.map(({ provider }) => ({
        label: provider?.display_name || provider?.name || provider?.provider_type || "Unknown",
        value: provider?.provider_type || provider?.type || "",
      })),
    [gameProviders]
  );

  const callbackTypeOptions = useMemo(
    () => [
      {
        label: "Bet",
        value: "bet",
      },
      {
        label: "Win",
        value: "win",
      },
      {
        label: "Rollback",
        value: "rollback",
      },
      {
        label: "Refund",
        value: "refund",
      },
      {
        label: "Balance",
        value: "balance",
      },
      {
        label: "Authenticate",
        value: "authenticate",
      },
      {
        label: "Session Start",
        value: "session_start",
      },
      {
        label: "Session End",
        value: "session_end",
      },
      {
        label: "Bonus Win",
        value: "bonus_win",
      },
      {
        label: "Jackpot Win",
        value: "jackpot_win",
      },
      {
        label: "End Round",
        value: "end_round",
      },
      {
        label: "Adjustment",
        value: "adjustment",
      },
      {
        label: "Promo Win",
        value: "promo_win",
      },
      {
        label: "Reality Check",
        value: "reality_check",
      },
    ],
    []
  );

  const actionTypeOptions = useMemo(
    () => [
      {
        label: "Debit",
        value: "debit",
      },
      {
        label: "Credit",
        value: "credit",
      },
      {
        label: "Rollback",
        value: "rollback",
      },
    ],
    []
  );

  const processingStatusOptions = useMemo(
    () => [
      {
        label: "Received",
        value: "received",
      },
      {
        label: "Processing",
        value: "processing",
      },
      {
        label: "Processed",
        value: "processed",
      },
      {
        label: "Failed",
        value: "failed",
      },
      {
        label: "Ignored",
        value: "ignored",
      },
    ],
    []
  );

  const providerTypeChip = useMemo(() => {
    if (!providerTypeFilter) {
      return [];
    }

    const selectedProvider = gameProviders.find(
      (p) => (p?.provider?.provider_type || p?.provider?.type) === providerTypeFilter
    );
    
    const displayName = selectedProvider?.provider?.display_name || 
                        selectedProvider?.provider?.name || 
                        providerTypeFilter;

    return [
      {
        label: "Provider Type",
        value: providerTypeFilter,
        displayValue: displayName,
      },
    ];
  }, [providerTypeFilter, gameProviders]);

  const callbackTypeChip = useMemo(() => {
    if (!callbackTypeFilter) {
      return [];
    }

    const selectedCallbackType = callbackTypeOptions.find(
      (option) => option.value === callbackTypeFilter
    );
    
    const displayName = selectedCallbackType?.label || callbackTypeFilter;

    return [
      {
        label: "Callback Type",
        value: callbackTypeFilter,
        displayValue: displayName,
      },
    ];
  }, [callbackTypeFilter, callbackTypeOptions]);

  const actionTypeChip = useMemo(() => {
    if (!actionTypeFilter) {
      return [];
    }

    const selectedActionType = actionTypeOptions.find(
      (option) => option.value === actionTypeFilter
    );
    
    const displayName = selectedActionType?.label || actionTypeFilter;

    return [
      {
        label: "Action Type",
        value: actionTypeFilter,
        displayValue: displayName,
      },
    ];
  }, [actionTypeFilter, actionTypeOptions]);

  const processingStatusChip = useMemo(() => {
    if (!processingStatusFilter) {
      return [];
    }

    const selectedStatus = processingStatusOptions.find(
      (option) => option.value === processingStatusFilter
    );
    
    const displayName = selectedStatus?.label || processingStatusFilter;

    return [
      {
        label: "Processing Status",
        value: processingStatusFilter,
        displayValue: displayName,
      },
    ];
  }, [processingStatusFilter, processingStatusOptions]);

  const sessionIdChip = useMemo(() => {
    if (!sessionIdFilter) {
      return [];
    }

    return [
      {
        label: "Session ID",
        value: sessionIdFilter,
        displayValue: sessionIdFilter,
      },
    ];
  }, [sessionIdFilter]);

  const transactionIdChip = useMemo(() => {
    if (!transactionIdFilter) {
      return [];
    }

    return [
      {
        label: "Transaction ID",
        value: transactionIdFilter,
        displayValue: transactionIdFilter,
      },
    ];
  }, [transactionIdFilter]);

  const handleRemoveProviderTypeFilter = useCallback(() => {
    setProviderTypeFilter("");
  }, []);

  const handleRemoveCallbackTypeFilter = useCallback(() => {
    setCallbackTypeFilter("");
  }, []);

  const handleRemoveActionTypeFilter = useCallback(() => {
    setActionTypeFilter("");
  }, []);

  const handleRemoveProcessingStatusFilter = useCallback(() => {
    setProcessingStatusFilter("");
  }, []);

  const handleRemoveSessionIdFilter = useCallback(() => {
    setSessionIdFilter("");
    setSessionIdInput("");
  }, []);

  const handleRemoveTransactionIdFilter = useCallback(() => {
    setTransactionIdFilter("");
    setTransactionIdInput("");
  }, []);

  const handleApplySessionIdFilter = useCallback((value) => {
    setSessionIdFilter(value);
    setSessionIdInput(value);
  }, []);

  const handleApplyTransactionIdFilter = useCallback((value) => {
    setTransactionIdFilter(value);
    setTransactionIdInput(value);
  }, []);

  const handleFetchWebhooks = useCallback(
    async (page, perPage) => {
      if (!managedProviderId) {
        return;
      }

      try {
        setIsLoading(true);

        const params = {
          page,
          per_page: perPage,
          managed_provider_id: managedProviderId,
        };

        if (gamingProviderId) {
          params.gaming_provider_id = gamingProviderId;
        }

        if (providerTypeFilter) {
          params.provider_type = providerTypeFilter;
        }

        if (callbackTypeFilter) {
          params.callback_type = callbackTypeFilter;
        }

        if (actionTypeFilter) {
          params.action_type = actionTypeFilter;
        }

        if (processingStatusFilter) {
          params.processing_status = processingStatusFilter;
        }

        if (sessionIdFilter) {
          params.session_id = sessionIdFilter;
        }

        if (transactionIdFilter) {
          params.transaction_id = transactionIdFilter;
        }

        if (debouncedSearch) {
          params.search = debouncedSearch;
        }

        if (selectedBrandId) {
          params.internal_brand_id = selectedBrandId;
        }

        const response = await gameProvidersApi.getGameProviderWebhooks(params);
        const payload = response?.data ?? response ?? {};
        const responseLogs = Array.isArray(payload?.logs) ? payload.logs : [];
        const paginationPayload = payload?.pagination ?? {};
        const currentPage = paginationPayload.current_page ?? page;
        const perPageValue = paginationPayload.per_page ?? perPage;
        const totalCount = paginationPayload.total_count ?? responseLogs.length;
        const totalPages =
          paginationPayload.total_pages ??
          (perPageValue ? Math.ceil(totalCount / perPageValue) : 0);

        if (!isMounted()) {
          return;
        }

        setLogs(responseLogs);
        setPagination({
          page: currentPage,
          perPage: perPageValue || perPage,
          totalCount,
          totalPages,
        });
      } catch (err) {
        if (!isMounted()) {
          return;
        }

        setLogs([]);
        console.error("Failed to load webhook logs:", err);
      } finally {
        if (isMounted()) {
          setIsLoading(false);
        }
      }
    },
    [isMounted, managedProviderId, gamingProviderId, providerType, selectedBrandId, providerTypeFilter, callbackTypeFilter, actionTypeFilter, processingStatusFilter, sessionIdFilter, transactionIdFilter, debouncedSearch]
  );

  useEffect(() => {
    if (!managedProviderId) {
      return;
    }

    setPagination((prev) => {
      if (prev.page === 1) {
        return prev;
      }

      return {
        ...prev,
        page: 1,
      };
    });
  }, [managedProviderId, selectedBrandId, providerTypeFilter, callbackTypeFilter, actionTypeFilter, processingStatusFilter, sessionIdFilter, transactionIdFilter, debouncedSearch]);

  useEffect(() => {
    if (!managedProviderId) {
      return;
    }

    handleFetchWebhooks(pagination.page, pagination.perPage);
  }, [managedProviderId, pagination.page, pagination.perPage, handleFetchWebhooks]);

  const handlePageChange = useCallback((event, newPage) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage + 1,
    }));
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    const nextPerPage = Number.parseInt(event.target.value, 10);

    setPagination((prev) => ({
      ...prev,
      page: 1,
      perPage: Number.isNaN(nextPerPage) ? prev.perPage : nextPerPage,
    }));
  }, []);

  const formattedLogs = useMemo(
    () =>
      logs.map((log) => ({
        ...log,
        formattedCreatedAt: log?.created_at
          ? format(new Date(log.created_at), "dd MMM yyyy HH:mm:ss")
          : "—",
        formattedProcessedAt: log?.processed_at
          ? format(new Date(log.processed_at), "dd MMM yyyy HH:mm:ss")
          : "—",
      })),
    [logs]
  );

  const getStatusColor = useCallback((value) => {
    if (!value) {
      return "default";
    }

    const normalizedValue = String(value).toLowerCase();

    if (["approved", "processed", "success", "completed"].includes(normalizedValue)) {
      return "success";
    }

    if (["pending", "queued", "processing"].includes(normalizedValue)) {
      return "warning";
    }

    if (["failed", "error", "rejected"].includes(normalizedValue)) {
      return "error";
    }

    return "info";
  }, []);

  const formatAmountValue = useCallback((value, currency) => {
    const numericValue = Number.parseFloat(value);

    if (Number.isNaN(numericValue)) {
      return value || "—";
    }

    const formattedValue = numericValue.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return currency ? `${formattedValue} ${currency}` : formattedValue;
  }, []);

  const formatProcessingTime = useCallback((value) => {
    if (value === null || value === undefined) {
      return "—";
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return `${value} ms`;
    }

    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }

    return "—";
  }, []);

  const stringifyValue = useCallback((value, options = { pretty: false }) => {
    if (value === null || value === undefined) {
      return options.pretty ? "" : "—";
    }

    if (typeof value === "string") {
      return value.trim().length > 0 ? value : options.pretty ? "" : "—";
    }

    try {
      const stringified = JSON.stringify(
        value,
        options.pretty ? null : undefined,
        options.pretty ? 2 : undefined
      );

      if (typeof stringified !== "string" || stringified.trim().length === 0) {
        return options.pretty ? "" : "—";
      }

      return stringified;
    } catch (error) {
      return options.pretty ? "" : "—";
    }
  }, []);

  return (
    <Box
      sx={{
        px: 2.5,
        py: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Card
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 600,
              fontFamily: "Inter, sans-serif",
              color: "text.primary",
            }}
          >
            Received Webhooks
          </Typography>
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 400,
              fontFamily: "Inter, sans-serif",
              color: "text.secondary",
            }}
          >
            Review webhook deliveries captured for {providerDisplayName}.
          </Typography>
        </Box>

        <Divider />

        <Stack alignItems="center" direction="row" spacing={2} sx={{ p: 2 }}>
          <Iconify icon="lucide:search" color="text.secondary" width={24} />
          <Box sx={{ flexGrow: 1 }}>
            <Input
              disableUnderline
              fullWidth
              placeholder="Search webhooks..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Box>
        </Stack>

        <Divider />

        {(providerTypeChip.length > 0 || callbackTypeChip.length > 0 || actionTypeChip.length > 0 || processingStatusChip.length > 0 || sessionIdChip.length > 0 || transactionIdChip.length > 0) && (
          <>
            <Stack
              alignItems="center"
              direction="row"
              flexWrap="wrap"
              gap={1}
              sx={{ p: 2, px: 3 }}
            >
              <ChipSet
                chips={providerTypeChip}
                handleRemoveChip={handleRemoveProviderTypeFilter}
              />
              <ChipSet
                chips={callbackTypeChip}
                handleRemoveChip={handleRemoveCallbackTypeFilter}
              />
              <ChipSet
                chips={actionTypeChip}
                handleRemoveChip={handleRemoveActionTypeFilter}
              />
              <ChipSet
                chips={processingStatusChip}
                handleRemoveChip={handleRemoveProcessingStatusFilter}
              />
              <ChipSet
                chips={sessionIdChip}
                handleRemoveChip={handleRemoveSessionIdFilter}
              />
              <ChipSet
                chips={transactionIdChip}
                handleRemoveChip={handleRemoveTransactionIdFilter}
              />
            </Stack>
            <Divider />
          </>
        )}

        <Scrollbar sx={{ flex: 1 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TextFilter
                    value={transactionIdInput}
                    onApply={handleApplyTransactionIdFilter}
                    label="TRANSACTION ID"
                    placeholder="Transaction ID..."
                  />
                </TableCell>
                <TableCell>
                  <FilterSelect
                    label="PROVIDER TYPE"
                    placeholder="Provider..."
                    options={providerOptions}
                    setValue={(val) => setProviderTypeFilter(val)}
                    value={providerTypeFilter}
                    withSearch
                  />
                </TableCell>
                <TableCell>
                  <FilterSelect
                    label="CALLBACK TYPE"
                    placeholder="Type..."
                    options={callbackTypeOptions}
                    setValue={(val) => setCallbackTypeFilter(val)}
                    value={callbackTypeFilter}
                  />
                </TableCell>
                <TableCell>
                  <FilterSelect
                    label="ACTION TYPE"
                    placeholder="Action..."
                    options={actionTypeOptions}
                    setValue={(val) => setActionTypeFilter(val)}
                    value={actionTypeFilter}
                  />
                </TableCell>
                <TableCell>
                  <FilterSelect
                    label="PROCESSING STATUS"
                    placeholder="Status..."
                    options={processingStatusOptions}
                    setValue={(val) => setProcessingStatusFilter(val)}
                    value={processingStatusFilter}
                  />
                </TableCell>
                <TableCell>Processing Time</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Balance Before</TableCell>
                <TableCell>Balance After</TableCell>
                <TableCell>Player ID</TableCell>
                <TableCell>
                  <TextFilter
                    value={sessionIdInput}
                    onApply={handleApplySessionIdFilter}
                    label="SESSION ID"
                    placeholder="Session ID..."
                  />
                </TableCell>
                <TableCell>Round ID</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Request Method</TableCell>
                <TableCell>Headers</TableCell>
                <TableCell>Raw Payload</TableCell>
                <TableCell>Parsed Payload</TableCell>
                <TableCell>Response Sent</TableCell>
                <TableCell>Error Message</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Processed At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading && formattedLogs.length === 0 ? (
                <TableSkeleton
                  rowCount={pagination.perPage > 15 ? 15 : pagination.perPage}
                  cellCount={21}
                />
              ) : (
                formattedLogs.map((log) => (
                  <TableRow hover key={log.id}>
                    <TableCell>
                      <Tooltip title={log.transaction_id || ""} placement="top" arrow>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontWeight: 500,
                            fontFamily: "Inter, sans-serif",
                            color: "text.primary",
                            maxWidth: 180,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {log.transaction_id || "—"}
                        </Typography>
                      </Tooltip>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: 400,
                          fontFamily: "Inter, sans-serif",
                          color: "text.secondary",
                        }}
                      >
                        {log.gaming_provider_name || providerDisplayName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: 400,
                          fontFamily: "Inter, sans-serif",
                          color: "text.secondary",
                        }}
                      >
                        {log.provider_type || providerType || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 500,
                          fontFamily: "Inter, sans-serif",
                          color: "text.primary",
                          textTransform: "capitalize",
                        }}
                      >
                        {log.callback_type || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 500,
                          fontFamily: "Inter, sans-serif",
                          color: "text.primary",
                          textTransform: "capitalize",
                        }}
                      >
                        {log.action_type || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.processing_status || "—"}
                        color={getStatusColor(log.processing_status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 500,
                          fontFamily: "Inter, sans-serif",
                          color: "text.primary",
                        }}
                      >
                        {formatProcessingTime(log.processing_time)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 500,
                          fontFamily: "Inter, sans-serif",
                          color: "text.primary",
                        }}
                      >
                        {formatAmountValue(log.amount, log.currency)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 500,
                          fontFamily: "Inter, sans-serif",
                          color: "text.primary",
                        }}
                      >
                        {formatAmountValue(log.balance_before, log.currency)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 500,
                          fontFamily: "Inter, sans-serif",
                          color: "text.primary",
                        }}
                      >
                        {formatAmountValue(log.balance_after, log.currency)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 500,
                          fontFamily: "Inter, sans-serif",
                          color: "text.primary",
                        }}
                      >
                        {log.player_id || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 500,
                          fontFamily: "Inter, sans-serif",
                          color: "text.primary",
                        }}
                      >
                        {log.session_id || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 500,
                          fontFamily: "Inter, sans-serif",
                          color: "text.primary",
                        }}
                      >
                        {log.round_id || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 500,
                          fontFamily: "Inter, sans-serif",
                          color: "text.primary",
                        }}
                      >
                        {log.ip_address || "—"}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: 400,
                          fontFamily: "Inter, sans-serif",
                          color: "text.secondary",
                        }}
                      >
                        {log.user_agent || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 500,
                          fontFamily: "Inter, sans-serif",
                          color: "text.primary",
                          textTransform: "uppercase",
                        }}
                      >
                        {log.request_method || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        title={stringifyValue(log.headers, { pretty: true })}
                        placement="top"
                        arrow
                      >
                        <Typography
                          sx={{
                            fontSize: "12px",
                            fontWeight: 400,
                            fontFamily: "Inter, sans-serif",
                            color: "text.secondary",
                            maxWidth: 240,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {stringifyValue(log.headers)}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={log.raw_payload || ""} placement="top" arrow>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            fontWeight: 400,
                            fontFamily: "Inter, sans-serif",
                            color: "text.secondary",
                            maxWidth: 240,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {log.raw_payload || "—"}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        title={stringifyValue(log.parsed_payload, { pretty: true })}
                        placement="top"
                        arrow
                      >
                        <Typography
                          sx={{
                            fontSize: "12px",
                            fontWeight: 400,
                            fontFamily: "Inter, sans-serif",
                            color: "text.secondary",
                            maxWidth: 240,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {stringifyValue(log.parsed_payload)}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        title={stringifyValue(log.response_sent, { pretty: true })}
                        placement="top"
                        arrow
                      >
                        <Typography
                          sx={{
                            fontSize: "12px",
                            fontWeight: 400,
                            fontFamily: "Inter, sans-serif",
                            color: "text.secondary",
                            maxWidth: 240,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {stringifyValue(log.response_sent)}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={log.error_message || ""} placement="top" arrow>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            fontWeight: 400,
                            fontFamily: "Inter, sans-serif",
                            color: "text.secondary",
                            maxWidth: 240,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {log.error_message || "—"}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontWeight: 500,
                            fontFamily: "Inter, sans-serif",
                            color: "text.primary",
                          }}
                        >
                          {log.formattedCreatedAt}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 500,
                          fontFamily: "Inter, sans-serif",
                          color: "text.primary",
                        }}
                      >
                        {log.formattedProcessedAt}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {!isLoading && formattedLogs.length === 0 && (
            <TableNoData label="No webhook logs yet." />
          )}
        </Scrollbar>

        <Divider />

        <TablePagination
          component="div"
          rowsPerPageOptions={[10, 25, 50]}
          count={pagination.totalCount}
          rowsPerPage={pagination.perPage}
          page={Math.max(0, pagination.page - 1)}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Card>
    </Box>
  );
};


