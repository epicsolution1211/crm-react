import { useCallback, useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
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

import { callProvidersApi } from "src/api/call-providers";
import { useMounted } from "src/hooks/use-mounted";
import { usePopover } from "src/hooks/use-popover";
import { useDebounce } from "src/hooks/use-debounce";
import { Scrollbar } from "src/components/scrollbar";
import { TableNoData } from "src/components/table-empty";
import { TableSkeleton } from "src/components/table-skeleton";
import { FilterSelect } from "src/components/customize/filter-select";
import { ChipSet } from "src/components/customize/chipset";
import { Iconify } from "src/components/iconify";

const CallUuidFilter = ({ value, onApply }) => {
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
          CALL UUID
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
            placeholder="Call UUID..."
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

export const CallProviderReceivedWebhooks = ({ provider }) => {
  const isMounted = useMounted();
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    totalCount: 0,
    totalPages: 0,
  });
  const [callProviders, setCallProviders] = useState([]);
  const [providerTypeFilter, setProviderTypeFilter] = useState("");
  const [webhookTypeFilter, setWebhookTypeFilter] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("");
  const [processingStatusFilter, setProcessingStatusFilter] = useState("");
  const [callUuidFilter, setCallUuidFilter] = useState("");
  const [callUuidInput, setCallUuidInput] = useState("");
  const [searchText, setSearchText] = useState("");
  
  const debouncedSearch = useDebounce(searchText, 300);

  const managedProviderId = provider?.id;
  const providerType = provider?.provider_type;
  const providerName = provider?.name || "Provider";
  const providerExternalId =
    provider?.call_provider_id || provider?.provider_id || provider?.psp_provider_id;

  useEffect(() => {
    const fetchCallProviders = async () => {
      try {
        const response = await callProvidersApi.getCallProviders();
        const providers = response?.data?.providers || response?.providers || [];
        
        if (isMounted()) {
          setCallProviders(providers);
        }
      } catch (err) {
        console.error("Failed to load call providers:", err);
      }
    };

    fetchCallProviders();
  }, [isMounted]);

  const providerOptions = useMemo(
    () =>
      callProviders.map(({ provider }) => ({
        label: provider?.display_name || provider?.name || provider?.provider_type || "Unknown",
        value: provider?.provider_type || provider?.type || "",
      })),
    [callProviders]
  );

  const webhookTypeOptions = useMemo(
    () => [
      {
        label: "Call Initiated",
        value: "call_initiated",
      },
      {
        label: "Call Started",
        value: "call_started",
      },
      {
        label: "Call Ringing",
        value: "call_ringing",
      },
      {
        label: "Call Answered",
        value: "call_answered",
      },
      {
        label: "Call Completed",
        value: "call_completed",
      },
      {
        label: "Call Ended",
        value: "call_ended",
      },
      {
        label: "Call Failed",
        value: "call_failed",
      },
      {
        label: "Call Busy",
        value: "call_busy",
      },
      {
        label: "Call No Answer",
        value: "call_no_answer",
      },
      {
        label: "Recording Available",
        value: "recording_available",
      },
      {
        label: "Recording Completed",
        value: "recording_completed",
      },
      {
        label: "Status Callback",
        value: "status_callback",
      },
      {
        label: "Event Callback",
        value: "event_callback",
      },
    ],
    []
  );

  const eventTypeOptions = useMemo(
    () => [
      {
        label: "Status",
        value: "status",
      },
      {
        label: "Recording",
        value: "recording",
      },
      {
        label: "Completed",
        value: "completed",
      },
      {
        label: "Failed",
        value: "failed",
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

    const selectedProvider = callProviders.find(
      (p) => (p?.provider_type || p?.type) === providerTypeFilter
    );
    
    const displayName = selectedProvider?.display_name || 
                        selectedProvider?.name || 
                        providerTypeFilter;

    return [
      {
        label: "Provider Type",
        value: providerTypeFilter,
        displayValue: displayName,
      },
    ];
  }, [providerTypeFilter, callProviders]);

  const webhookTypeChip = useMemo(() => {
    if (!webhookTypeFilter) {
      return [];
    }

    const selectedWebhookType = webhookTypeOptions.find(
      (option) => option.value === webhookTypeFilter
    );
    
    const displayName = selectedWebhookType?.label || webhookTypeFilter;

    return [
      {
        label: "Webhook Type",
        value: webhookTypeFilter,
        displayValue: displayName,
      },
    ];
  }, [webhookTypeFilter, webhookTypeOptions]);

  const eventTypeChip = useMemo(() => {
    if (!eventTypeFilter) {
      return [];
    }

    const selectedEventType = eventTypeOptions.find(
      (option) => option.value === eventTypeFilter
    );
    
    const displayName = selectedEventType?.label || eventTypeFilter;

    return [
      {
        label: "Event Type",
        value: eventTypeFilter,
        displayValue: displayName,
      },
    ];
  }, [eventTypeFilter, eventTypeOptions]);

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

  const callUuidChip = useMemo(() => {
    if (!callUuidFilter) {
      return [];
    }

    return [
      {
        label: "Call UUID",
        value: callUuidFilter,
        displayValue: callUuidFilter,
      },
    ];
  }, [callUuidFilter]);

  const handleRemoveProviderTypeFilter = useCallback(() => {
    setProviderTypeFilter("");
  }, []);

  const handleRemoveWebhookTypeFilter = useCallback(() => {
    setWebhookTypeFilter("");
  }, []);

  const handleRemoveEventTypeFilter = useCallback(() => {
    setEventTypeFilter("");
  }, []);

  const handleRemoveProcessingStatusFilter = useCallback(() => {
    setProcessingStatusFilter("");
  }, []);

  const handleRemoveCallUuidFilter = useCallback(() => {
    setCallUuidFilter("");
    setCallUuidInput("");
  }, []);

  const handleApplyCallUuidFilter = useCallback((value) => {
    setCallUuidFilter(value);
    setCallUuidInput(value);
  }, []);

  const handleFetchWebhooks = useCallback(
    async (page, perPage) => {
      if (!managedProviderId) {
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const params = {
          page,
          per_page: perPage,
          managed_provider_id: managedProviderId,
        };

        if (providerExternalId) {
          params.call_provider_id = providerExternalId;
        }

        if (providerTypeFilter) {
          params.provider_type = providerTypeFilter;
        }

        if (webhookTypeFilter) {
          params.webhook_type = webhookTypeFilter;
        }

        if (eventTypeFilter) {
          params.event_type = eventTypeFilter;
        }

        if (processingStatusFilter) {
          params.processing_status = processingStatusFilter;
        }

        if (callUuidFilter) {
          params.call_uuid = callUuidFilter;
        }

        if (debouncedSearch) {
          params.search = debouncedSearch;
        }

        const response = await callProvidersApi.getCallProviderWebhooks(params);
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
        setError(
          err?.response?.data?.message || err?.message || "Failed to load webhook logs."
        );
      } finally {
        if (isMounted()) {
          setIsLoading(false);
        }
      }
    },
    [isMounted, managedProviderId, providerExternalId, providerType, providerTypeFilter, webhookTypeFilter, eventTypeFilter, processingStatusFilter, callUuidFilter, debouncedSearch]
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
  }, [managedProviderId, providerTypeFilter, webhookTypeFilter, eventTypeFilter, processingStatusFilter, callUuidFilter, debouncedSearch]);

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

  const handleRetry = useCallback(() => {
    handleFetchWebhooks(pagination.page, pagination.perPage);
  }, [handleFetchWebhooks, pagination.page, pagination.perPage]);

  const formatCostValue = useCallback((amount, currency) => {
    const numericAmount = Number.parseFloat(amount);

    if (Number.isNaN(numericAmount)) {
      return amount || "—";
    }

    const formattedAmount = numericAmount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return currency ? `${formattedAmount} ${currency}` : formattedAmount;
  }, []);

  const formatDurationValue = useCallback((formatted, seconds) => {
    if (formatted) {
      return formatted;
    }

    const numericSeconds = Number.parseFloat(seconds);

    if (!Number.isFinite(numericSeconds) || numericSeconds < 0) {
      return seconds || "—";
    }

    const totalSeconds = Math.floor(numericSeconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    const paddedSeconds = remainingSeconds.toString().padStart(2, "0");

    return `${minutes}:${paddedSeconds}`;
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

  const getStatusColor = useCallback((value) => {
    if (!value) {
      return "default";
    }

    const normalizedValue = value.toLowerCase();

    if (["completed", "success", "processed", "approved"].includes(normalizedValue)) {
      return "success";
    }

    if (["pending", "processing", "queued"].includes(normalizedValue)) {
      return "warning";
    }

    if (["failed", "error", "rejected"].includes(normalizedValue)) {
      return "error";
    }

    return "info";
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
        formattedCallDuration: formatDurationValue(log?.call_duration_formatted, log?.duration),
        formattedCost: formatCostValue(log?.cost_amount, log?.cost_currency),
        stringifiedHeaders: stringifyValue(log?.headers),
        prettyHeaders: stringifyValue(log?.headers, { pretty: true }),
        stringifiedRawPayload: stringifyValue(log?.raw_payload),
        prettyRawPayload: stringifyValue(log?.raw_payload, { pretty: true }),
        stringifiedParsedPayload: stringifyValue(log?.parsed_payload),
        prettyParsedPayload: stringifyValue(log?.parsed_payload, { pretty: true }),
        formattedProcessingTime: formatProcessingTime(log?.processing_time),
        displayProviderName: log?.call_provider_name || providerName,
      })),
    [
      logs,
      formatDurationValue,
      formatCostValue,
      stringifyValue,
      formatProcessingTime,
      providerName,
    ]
  );

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
      {error && (
        <Alert
          severity="error"
          action={
            <Button
              size="small"
              color="inherit"
              onClick={handleRetry}
              aria-label="Retry loading call provider webhook logs"
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

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
            Review webhook deliveries captured for {providerName}.
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

        {(providerTypeChip.length > 0 || webhookTypeChip.length > 0 || eventTypeChip.length > 0 || processingStatusChip.length > 0 || callUuidChip.length > 0) && (
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
                chips={webhookTypeChip}
                handleRemoveChip={handleRemoveWebhookTypeFilter}
              />
              <ChipSet
                chips={eventTypeChip}
                handleRemoveChip={handleRemoveEventTypeFilter}
              />
              <ChipSet
                chips={processingStatusChip}
                handleRemoveChip={handleRemoveProcessingStatusFilter}
              />
              <ChipSet
                chips={callUuidChip}
                handleRemoveChip={handleRemoveCallUuidFilter}
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
                  <CallUuidFilter
                    value={callUuidInput}
                    onApply={handleApplyCallUuidFilter}
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
                    label="WEBHOOK TYPE"
                    placeholder="Type..."
                    options={webhookTypeOptions}
                    setValue={(val) => setWebhookTypeFilter(val)}
                    value={webhookTypeFilter}
                  />
                </TableCell>
                <TableCell>
                  <FilterSelect
                    label="EVENT TYPE"
                    placeholder="Type..."
                    options={eventTypeOptions}
                    setValue={(val) => setEventTypeFilter(val)}
                    value={eventTypeFilter}
                  />
                </TableCell>
                <TableCell>Call Status</TableCell>
                <TableCell>
                  <FilterSelect
                    label="PROCESSING STATUS"
                    placeholder="Status..."
                    options={processingStatusOptions}
                    setValue={(val) => setProcessingStatusFilter(val)}
                    value={processingStatusFilter}
                  />
                </TableCell>
                <TableCell>Disposition</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Request Method</TableCell>
                <TableCell>Headers</TableCell>
                <TableCell>Raw Payload</TableCell>
                <TableCell>Parsed Payload</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Processing Time</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Processed At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading && formattedLogs.length === 0 ? (
                <TableSkeleton
                  rowCount={pagination.perPage > 15 ? 15 : pagination.perPage}
                  cellCount={17}
                />
              ) : (
                formattedLogs.map((log) => (
                  <TableRow hover key={log.id}>
                    <TableCell>
                      <Tooltip title={log.call_uuid || ""} placement="top" arrow>
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
                          {log.call_uuid || "—"}
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
                        {log.displayProviderName}
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
                        {log.call_provider_type || log.provider_type || "—"}
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
                        {log.webhook_type || "—"}
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
                        {log.event_type || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.call_status || "—"}
                        color={getStatusColor(log.call_status)}
                        size="small"
                      />
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
                        {log.disposition || "—"}
                      </Typography>
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
                          {log.formattedCallDuration}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            fontWeight: 400,
                            fontFamily: "Inter, sans-serif",
                            color: "text.secondary",
                          }}
                        >
                          {log.duration !== null && log.duration !== undefined
                            ? `${log.duration} s`
                            : "—"}
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
                        {log.formattedCost}
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
                      <Tooltip title={log.prettyHeaders} placement="top" arrow>
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
                          {log.stringifiedHeaders}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={log.prettyRawPayload} placement="top" arrow>
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
                          {log.stringifiedRawPayload}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={log.prettyParsedPayload} placement="top" arrow>
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
                          {log.stringifiedParsedPayload}
                        </Typography>
                      </Tooltip>
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
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
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
                        }}
                      >
                        {log.formattedProcessingTime}
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
                        {log.formattedCreatedAt}
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
