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

import { affiliateApi } from "src/api/lead-management/affiliate";
import { useMounted } from "src/hooks/use-mounted";
import { usePopover } from "src/hooks/use-popover";
import { useDebounce } from "src/hooks/use-debounce";
import { Scrollbar } from "src/components/scrollbar";
import { TableNoData } from "src/components/table-empty";
import { TableSkeleton } from "src/components/table-skeleton";
import { FilterSelect } from "src/components/customize/filter-select";
import { ChipSet } from "src/components/customize/chipset";
import { Iconify } from "src/components/iconify";

const DEFAULT_PAGINATION = {
  page: 1,
  perPage: 10,
  totalCount: 0,
  totalPages: 0,
};

const TextFilter = ({ label, value, onApply }) => {
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
            placeholder={`${label}...`}
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

export const AffiliateAggregatorsWebhooks = ({ affiliateId }) => {
  const isMounted = useMounted();
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [leadCreatedFilter, setLeadCreatedFilter] = useState("");
  const [webhookSavedFilter, setWebhookSavedFilter] = useState("");
  const [processingStatusFilter, setProcessingStatusFilter] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [eidFilter, setEidFilter] = useState("");
  const [eidInput, setEidInput] = useState("");
  const [searchText, setSearchText] = useState("");
  
  const debouncedSearch = useDebounce(searchText, 300);

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

  const eventTypeOptions = useMemo(
    () => [
      {
        label: "Update Profile",
        value: "update_profile",
      },
      {
        label: "Client",
        value: "client",
      },
      {
        label: "User",
        value: "user",
      },
      {
        label: "Client Update",
        value: "client_update",
      },
      {
        label: "Deposit",
        value: "deposit",
      },
      {
        label: "Withdrawal",
        value: "withdrawal",
      },
      {
        label: "Bonus",
        value: "bonus",
      },
      {
        label: "Acc Deposit Approved",
        value: "acc_deposit_approved",
      },
      {
        label: "Acc Deposit Failed",
        value: "acc_deposit_failed",
      },
      {
        label: "Acc Deposit Cancelled",
        value: "acc_deposit_cancelled",
      },
      {
        label: "Acc Withdrawal Requested",
        value: "acc_withdrawal_requested",
      },
      {
        label: "Acc Withdrawal Approved",
        value: "acc_withdrawal_approved",
      },
      {
        label: "Acc Withdrawal Completed",
        value: "acc_withdrawal_completed",
      },
      {
        label: "Acc Withdrawal Cancelled",
        value: "acc_withdrawal_cancelled",
      },
      {
        label: "Acc Bonus Approved",
        value: "acc_bonus_approved",
      },
      {
        label: "Acc Bonus Cancelled",
        value: "acc_bonus_cancelled",
      },
      {
        label: "Acc Bonus Completed",
        value: "acc_bonus_completed",
      },
      {
        label: "Casino Bet Win",
        value: "casino_bet_win",
      },
      {
        label: "Sport Bet Open",
        value: "sport_bet_open",
      },
      {
        label: "Sport Bet Settled",
        value: "sport_bet_settled",
      },
      {
        label: "Sport Bet Selection Open",
        value: "sport_bet_selection_open",
      },
      {
        label: "Sport Bet Selection Settled",
        value: "sport_bet_selection_settled",
      },
    ],
    []
  );

  const leadCreatedOptions = useMemo(
    () => [
      {
        label: "Yes",
        value: "true",
      },
      {
        label: "No",
        value: "false",
      },
    ],
    []
  );

  const webhookSavedOptions = useMemo(
    () => [
      {
        label: "Yes",
        value: "true",
      },
      {
        label: "No",
        value: "false",
      },
    ],
    []
  );

  const leadCreatedChip = useMemo(() => {
    if (!leadCreatedFilter) {
      return [];
    }

    const selectedOption = leadCreatedOptions.find(
      (option) => option.value === leadCreatedFilter
    );
    
    const displayName = selectedOption?.label || leadCreatedFilter;

    return [
      {
        label: "Lead Created",
        value: leadCreatedFilter,
        displayValue: displayName,
      },
    ];
  }, [leadCreatedFilter, leadCreatedOptions]);

  const webhookSavedChip = useMemo(() => {
    if (!webhookSavedFilter) {
      return [];
    }

    const selectedOption = webhookSavedOptions.find(
      (option) => option.value === webhookSavedFilter
    );
    
    const displayName = selectedOption?.label || webhookSavedFilter;

    return [
      {
        label: "Webhook Saved",
        value: webhookSavedFilter,
        displayValue: displayName,
      },
    ];
  }, [webhookSavedFilter, webhookSavedOptions]);

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

  const eventTypeChip = useMemo(() => {
    if (!eventTypeFilter) {
      return [];
    }

    const selectedEvent = eventTypeOptions.find(
      (option) => option.value === eventTypeFilter
    );
    
    const displayName = selectedEvent?.label || eventTypeFilter;

    return [
      {
        label: "Event Type",
        value: eventTypeFilter,
        displayValue: displayName,
      },
    ];
  }, [eventTypeFilter, eventTypeOptions]);

  const emailChip = useMemo(() => {
    if (!emailFilter) {
      return [];
    }

    return [
      {
        label: "Email",
        value: emailFilter,
        displayValue: emailFilter,
      },
    ];
  }, [emailFilter]);

  const eidChip = useMemo(() => {
    if (!eidFilter) {
      return [];
    }

    return [
      {
        label: "EID",
        value: eidFilter,
        displayValue: eidFilter,
      },
    ];
  }, [eidFilter]);

  const handleRemoveLeadCreatedFilter = useCallback(() => {
    setLeadCreatedFilter("");
  }, []);

  const handleRemoveWebhookSavedFilter = useCallback(() => {
    setWebhookSavedFilter("");
  }, []);

  const handleRemoveProcessingStatusFilter = useCallback(() => {
    setProcessingStatusFilter("");
  }, []);

  const handleRemoveEventTypeFilter = useCallback(() => {
    setEventTypeFilter("");
  }, []);

  const handleRemoveEmailFilter = useCallback(() => {
    setEmailFilter("");
    setEmailInput("");
  }, []);

  const handleRemoveEidFilter = useCallback(() => {
    setEidFilter("");
    setEidInput("");
  }, []);

  const handleApplyEmailFilter = useCallback((value) => {
    setEmailFilter(value);
    setEmailInput(value);
  }, []);

  const handleApplyEidFilter = useCallback((value) => {
    setEidFilter(value);
    setEidInput(value);
  }, []);

  const handleFetchLogs = useCallback(
    async (page, perPage) => {
      if (!affiliateId) {
        return;
      }

      try {
        setIsLoading(true);

        const params = {
          page,
          per_page: perPage,
          api_type: "casino_aggregator",
          affiliate_account_id: affiliateId,
        };

        if (leadCreatedFilter) {
          params.lead_created = leadCreatedFilter === "true";
        }

        if (webhookSavedFilter) {
          params.webhook_saved = webhookSavedFilter === "true";
        }

        if (processingStatusFilter) {
          params.processing_status = processingStatusFilter;
        }

        if (eventTypeFilter) {
          params.event_type = eventTypeFilter;
        }

        if (emailFilter) {
          params.email = emailFilter;
        }

        if (eidFilter) {
          params.eid = eidFilter;
        }

        if (debouncedSearch) {
          params.search = debouncedSearch;
        }

        const response = await affiliateApi.getAffiliateApiLogs(params);
        const payload = response?.data ?? response ?? {};
        const logsPayload = Array.isArray(payload?.logs) ? payload.logs : [];
        const paginationPayload = payload?.pagination ?? {};
        const currentPage = paginationPayload.current_page ?? page;
        const perPageValue = paginationPayload.per_page ?? perPage;
        const totalCount = paginationPayload.total_count ?? logsPayload.length;
        const totalPages =
          paginationPayload.total_pages ??
          (perPageValue ? Math.ceil(totalCount / perPageValue) : 0);

        if (!isMounted()) {
          return;
        }

        setLogs(logsPayload);
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
      } finally {
        if (isMounted()) {
          setIsLoading(false);
        }
      }
    },
    [affiliateId, isMounted, leadCreatedFilter, webhookSavedFilter, processingStatusFilter, eventTypeFilter, emailFilter, eidFilter, debouncedSearch]
  );

  useEffect(() => {
    if (!affiliateId) {
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
  }, [affiliateId, leadCreatedFilter, webhookSavedFilter, processingStatusFilter, eventTypeFilter, emailFilter, eidFilter, debouncedSearch]);

  useEffect(() => {
    if (!affiliateId) {
      return;
    }

    handleFetchLogs(pagination.page, pagination.perPage);
  }, [affiliateId, pagination.page, pagination.perPage, handleFetchLogs]);

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
        formattedProcessingTime:
          typeof log?.processing_time === "number" &&
          Number.isFinite(log.processing_time)
            ? `${log.processing_time} ms`
            : log?.processing_time || "—",
      })),
    [logs]
  );

  const getStatusColor = useCallback((value) => {
    if (!value) {
      return "default";
    }

    const normalizedValue = value.toLowerCase();

    if (["processed", "success", "completed", "ok"].includes(normalizedValue)) {
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
            Aggregators Webhook Logs
          </Typography>
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 400,
              fontFamily: "Inter, sans-serif",
              color: "text.secondary",
            }}
          >
            Review webhook deliveries received from casino aggregator integrations.
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

        {(leadCreatedChip.length > 0 || webhookSavedChip.length > 0 || processingStatusChip.length > 0 || eventTypeChip.length > 0 || emailChip.length > 0 || eidChip.length > 0) && (
          <>
            <Stack
              alignItems="center"
              direction="row"
              flexWrap="wrap"
              gap={1}
              sx={{ p: 2, px: 3 }}
            >
              <ChipSet
                chips={leadCreatedChip}
                handleRemoveChip={handleRemoveLeadCreatedFilter}
              />
              <ChipSet
                chips={webhookSavedChip}
                handleRemoveChip={handleRemoveWebhookSavedFilter}
              />
              <ChipSet
                chips={processingStatusChip}
                handleRemoveChip={handleRemoveProcessingStatusFilter}
              />
              <ChipSet
                chips={eventTypeChip}
                handleRemoveChip={handleRemoveEventTypeFilter}
              />
              <ChipSet
                chips={emailChip}
                handleRemoveChip={handleRemoveEmailFilter}
              />
              <ChipSet
                chips={eidChip}
                handleRemoveChip={handleRemoveEidFilter}
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
                    label="EMAIL"
                    value={emailInput}
                    onApply={handleApplyEmailFilter}
                  />
                </TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Affiliate</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>
                  <FilterSelect
                    label="EVENT TYPE"
                    placeholder="Event..."
                    options={eventTypeOptions}
                    setValue={(val) => setEventTypeFilter(val)}
                    value={eventTypeFilter}
                  />
                </TableCell>
                <TableCell>Request Type</TableCell>
                <TableCell>
                  <FilterSelect
                    label="PROCESSING STATUS"
                    placeholder="Status..."
                    options={processingStatusOptions}
                    setValue={(val) => setProcessingStatusFilter(val)}
                    value={processingStatusFilter}
                  />
                </TableCell>
                <TableCell>
                  <FilterSelect
                    label="LEAD CREATED"
                    placeholder="Select..."
                    options={leadCreatedOptions}
                    setValue={(val) => setLeadCreatedFilter(val)}
                    value={leadCreatedFilter}
                  />
                </TableCell>
                <TableCell>
                  <FilterSelect
                    label="WEBHOOK SAVED"
                    placeholder="Select..."
                    options={webhookSavedOptions}
                    setValue={(val) => setWebhookSavedFilter(val)}
                    value={webhookSavedFilter}
                  />
                </TableCell>
                <TableCell>Validation Passed</TableCell>
                <TableCell>
                  <TextFilter
                    label="EID"
                    value={eidInput}
                    onApply={handleApplyEidFilter}
                  />
                </TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Request Method</TableCell>
                <TableCell>Headers</TableCell>
                <TableCell>Parsed Payload</TableCell>
                <TableCell>Raw Payload</TableCell>
                <TableCell>Response Code</TableCell>
                <TableCell>Error Message</TableCell>
                <TableCell>Processing Time</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Processed At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading && formattedLogs.length === 0 ? (
                <TableSkeleton
                  rowCount={pagination.perPage > 15 ? 15 : pagination.perPage}
                  cellCount={20}
                />
              ) : (
                formattedLogs.map((log) => (
                  <TableRow hover key={log.id}>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Tooltip title={log.email || ""} placement="top" arrow>
                          <Typography
                            sx={{
                              fontSize: "13px",
                              fontWeight: 500,
                              fontFamily: "Inter, sans-serif",
                              color: "text.primary",
                              maxWidth: 200,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {log.email || "—"}
                          </Typography>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontWeight: 400,
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          {log.phone || "—"}
                        </Typography>
                      </Stack>
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
                        {log.affiliate_name || "—"}
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
                        {log.ext_brand_id || "—"}
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
                        {log.event_type || "—"}
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
                        {log.request_type || "—"}
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
                      <Chip
                        label={log.lead_created ? "Yes" : "No"}
                        color={log.lead_created ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.webhook_saved ? "Yes" : "No"}
                        color={log.webhook_saved ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.validation_passed ? "Yes" : "No"}
                        color={log.validation_passed ? "success" : "default"}
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
                        {log.eid || "—"}
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
                      </Stack>
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
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 500,
                          fontFamily: "Inter, sans-serif",
                          color: "text.primary",
                        }}
                      >
                        {log.response_code || "—"}
                      </Typography>
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
            <TableNoData label="No aggregators webhook logs yet." />
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


