import { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "react-hot-toast";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Link from "@mui/material/Link";
import LinearProgress from "@mui/material/LinearProgress";
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

import ComplianceDrawer from './compliance-drawer';
import FilterIcon from "src/icons/untitled-ui/duocolor/filter";
import SettingIcon from "src/icons/untitled-ui/duocolor/setting";
import { AnnouncementDialog } from "src/sections/dashboard/customer/customer-list-table/widget/announcement-dialog";
import { ChatReminderDialog } from "src/sections/dashboard/chat/chat-reminder-dialog";
import { ChipSet } from "src/components/customize/chipset";
import { ClientFilterInput } from 'src/components/customize/client-filter-input';
import { ComplianceAiLabelsDialog } from "src/components/compliance-ai-labels-dialog";
import { ComplianceLabelsDialog } from "src/components/compliance-labels-dialog";
import { FilterInput } from "src/components/customize/filter-input";
import { FilterMultiSelect } from "src/components/customize/filter-multi-select";
import { FilterSelect } from "src/components/customize/filter-select";
import { Iconify } from 'src/components/iconify';
import { MultiSelect } from "src/components/multi-select";
import { RouterLink } from "src/components/router-link";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { TableModal } from "src/components/table-settings-modal";
import { announcementsApi } from "src/api/announcements";
import { complianceApi } from 'src/api/compliance/index';
import { customersApi } from "src/api/customers";
import { exportToExcel } from "src/utils/export-excel";
import { paths } from "src/paths";
import { settingsApi } from "src/api/settings";
import { useDebounce } from "src/hooks/use-debounce";
import { useRouter } from "src/hooks/use-router";
import { useSelection } from "src/hooks/use-selection";

const channelList = [
  { label: "Phone Call", value: "phone_call" },
  { label: "Support Chat", value: "support_chat" },
  { label: "SMS", value: "sms" },
];

export const ComplianceTable = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [compliances, setCompliances] = useState([]);
  const [text, setText] = useState("");
  const q = useDebounce(text, 300);
  const [filters, setFilters] = useState({});
  const updateFilters = (val) => setFilters((prev) => ({ ...prev, ...val, currentPage: 0 }));

  const [aiLabelList, setAiLabelList] = useState([]);
  const [labelList, setLabelList] = useState([]);

  const [tableModal, setTableModal] = useState(false);
  const [rule, setRule] = useState([]);
  const [columnSorting, setColumnSorting] = useState({});
  const [tableSetting, setTableSetting] = useState(() => {
    try {
      const local = localStorage.getItem("tableSetting");
      return local ? JSON.parse(local) : {};
    } catch (e) {
      return {};
    }
  });

  const [exportLoading, setExportLoading] = useState(false);
  const [progress, setProgress] = useState(10);
  const [aiLabelsDialogOpen, setAiLabelsDialogOpen] = useState(false);
  const [labelsDialogOpen, setLabelsDialogOpen] = useState(false);
  const [callingId, setCallingId] = useState(null);
  const [openAnnouncementDialog, setOpenAnnouncementDialog] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [reminderClientId, setReminderClientId] = useState(null);
  const [announcementClientId, setAnnouncementClientId] = useState(null);
  const [bulkLabels, setBulkLabels] = useState([]);
  const [bulkAssignLoading, setBulkAssignLoading] = useState(false);
  const [clientList, setClientList] = useState([]);

  const router = useRouter();
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailId, setDetailId] = useState(null);
  

  const handleOpenDetail = useCallback((id) => {
    if (!id) return;
    setDetailId(id);
    setDetailOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setDetailOpen(false);
    setDetailId(null);
  }, []);

  useEffect(() => {}, []);

  const tableIds = useMemo(() => compliances?.map((c) => c?.id) ?? [], [compliances]);
  const selection = useSelection(tableIds ?? [], (message) => {
    toast.error(message);
  });
  const enableBulkActions = selection.selected?.length > 0;

  useEffect(() => {
    const saved = localStorage.getItem("compliancePerPage");
    if (saved) setPerPage(Number(saved));
  }, []);

  const getAiLabels = async () => {
    try {
      const res = await complianceApi.getComplianceAiLabels();
      const labelList = res?.labels
        ?.map((label) => ({
          label: label?.name,
          value: label?.id?.toString(),
          color: label?.color,
        }))
        ?.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.label === item?.label)
        );
      setAiLabelList(labelList);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getLabels = async () => {
    try {
      const res = await complianceApi.getComplianceLabels();
      const labelList = res?.labels
        ?.map((label) => ({
          label: label?.name,
          value: label?.id?.toString(),
          color: label?.color,
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

  useEffect(() => {
    getAiLabels();
    getLabels();
  }, []);

  const baseColumns = useMemo(() => [
    {
      id: "id",
      label: "ID",
      enabled: true,
      hasSort: true,
      headerRender: () => (
        <FilterInput
          labelFont={13}
          label="ID"
          placeholder="ID..."
          filter={filters?.ids}
          setFilter={(val) => updateFilters({ ids: val })}
        />
      ),
      render: (row) =>
        <Link
          color="text.primary"
          component={RouterLink}
          href={`#`}
          sx={{
            alignItems: "center",
            display: "inline-flex",
          }}
          underline="hover"
          gap={1}
          onClick={(e) => { e.preventDefault(); handleOpenDetail(row?.id); }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleOpenDetail(row?.id); } }}
          aria-label={`Open compliance ${row?.id}`}
        >
          <Typography sx={{ whiteSpace: "nowrap", textTransform: 'uppercase' }}>
            {row?.id}
          </Typography>
        </Link>
    },
    {
      id: "status",
      label: "Status",
      hasSort: true,
      headerRender: () => (
        <FilterInput
          label="STATUS"
          placeholder="Status..."
          filter={filters?.status}
          setFilter={(val) => updateFilters({ status: val })}
        />
      ),
      enabled: true,
      render: (row) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <SeverityPill
            color={row?.status === 'approved' ? 'success' : row?.status === 'rejected' ? 'error' : 'warning'}
          >
            {row?.status ?? ""}
          </SeverityPill>
        </Stack>
      ),
    },
    {
      id: "channel",
      label: "Channel",
      enabled: true,
      headerRender: () => (
        <FilterSelect
          label="Channel"
          options={channelList ?? []}
          setValue={(val) => updateFilters({ channel: val })}
          value={filters?.channel}
        />
      ),
      render: (row) => (
        <Stack direction="row" alignItems="center" gap={1}>
          <Iconify icon={row?.channel === 'Phone Call' ? 'uil:phone' : row?.channel === 'SMS' ? 'mdi:sms' : 'fluent:chat-24-regular'} width={20} />
          <Typography>{row?.channel || 'N/A'}</Typography>
          {row?.provider && (
            <Chip
              label={row.provider}
              size="small"
              variant="outlined"
              sx={{
                fontSize: '0.75rem',
                height: '20px',
                '& .MuiChip-label': {
                  px: 1,
                },
              }}
            />
          )}
        </Stack>
      )
    },
    {
      id: "ai_labels",
      label: "AI Labels",
      hasSort: false,
      headerRender: () => (
        <FilterMultiSelect
          label="AI LABELS"
          withSearch
          isLabel
          placeholder="Label..."
          options={aiLabelList ?? []}
          handleModalOpen={() => setAiLabelsDialogOpen(true)}
          onChange={(val) => {
            setFilters((prev) => ({
              ...prev,
              ai_label_ids: val,
            }));
            setCurrentPage(0);
          }}
          isExclude
          value={filters?.ai_label_ids}
          onChangeNon={(val) => {
            setFilters((prev) => ({
              ...prev,
              non_ai_label_ids: val,
            }));
            setCurrentPage(0);
          }}
          valueNon={filters?.non_ai_label_ids}
        />
      ),
      enabled: true,
      render: (row) => (
        <Stack gap={1} direction="row">
          {row?.compliance_ai_labels?.map((item, index) => (
            <Chip
              key={index}
              label={item.name}
              size="small"
              color="primary"
              sx={{
                backgroundColor: item?.color,
                mr: 1,
              }}
            />
          ))}
        </Stack>
      ),
    },
    {
      id: "labels",
      label: "Labels",
      enabled: true,
      hasSort: false,
      headerRender: () => (
        <FilterMultiSelect
          label="LABELS"
          withSearch
          isLabel
          placeholder="Label..."
          options={labelList ?? []}
          handleModalOpen={() => setLabelsDialogOpen(true)}
          onChange={(val) => {
            setFilters((prev) => ({
              ...prev,
              label_ids: val,
            }));
            setCurrentPage(0);
          }}
          isExclude
          value={filters?.label_ids}
          onChangeNon={(val) => {
            setFilters((prev) => ({
              ...prev,
              non_label_ids: val,
            }));
            setCurrentPage(0);
          }}
          valueNon={filters?.non_label_ids}
        />
      ),
      render: (row) =>
        row?.compliance_labels?.map((item) => (
          <Chip
            key={item.name}
            label={item.name}
            size="small"
            color="primary"
            sx={{
              backgroundColor: item?.color ?? "",
              mr: 1,
            }}
          />
        )),
    },
    {
      id: "account_name",
      label: "Agent",
      hasSort: true,
      headerRender: () => <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Agent</Typography>,
      enabled: true,
      render: (row) => (
        <Stack direction="row" alignItems="center" gap={1}>
          <Avatar sx={{ width: 30, height: 30 }} />
          <Typography sx={{ whiteSpace: "nowrap" }}>{row?.account_name || 'N/A'}</Typography>
              </Stack>
      ),
    },
    {
      id: "assignee_officer",
      label: "Assignee Officer",
      hasSort: false,
      headerRender: () => <Typography sx={{ fontSize: 13, fontWeight: 600 }} noWrap>Assignee Officer</Typography>,
      enabled: true,
      render: (row) => (
        <Typography sx={{ whiteSpace: "nowrap" }}>{row?.officer_name || 'N/A'}</Typography>
      ),
    },
    {
      id: "country",
      label: "Country",
      hasSort: false,
      headerRender: () => <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Country</Typography>,
      enabled: true,
      render: (row) =>
        <Stack direction="row" alignItems="center" gap={1}>
          {row?.country ? <Iconify icon={`circle-flags:${row?.country?.toLowerCase()}`} width={20} /> : null}
          <Typography sx={{ whiteSpace: "nowrap" }}>
            {row?.country}
          </Typography>
        </Stack>
    },
    {
      id: "client_id",
      label: "Client",
      enabled: true,
      hasSort: true,
      headerRender: () => (
        <ClientFilterInput
          updateFilters={updateFilters}
          updateClientList={setClientList}
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
            <Typography>{row?.client_name}</Typography>
          </Link>
        </Stack>
      ),
    },
    {
      id: "call_chat",
      label: "Call & Chat",
      hasSort: false,
      enabled: true,
      headerRender: () => (
        <Typography sx={{ fontSize: 13, fontWeight: 600 }} noWrap>Call & Chat</Typography>
      ),
      render: (row) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <MultiSelect
            withSearch
            noPadding
            withIcon
            labelIcon={
              <Tooltip title="Assign label">
                <Iconify 
                  icon="mynaui:label"
                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                  width={22}
                />
              </Tooltip>
            }
            options={labelList}
            value={(row?.compliance_labels || []).map((l) => (l?.id ?? l?.value)?.toString()).filter(Boolean)}
            onChange={async (values) => {
              try {
                const current = (row?.compliance_labels || []).map((l) => (l?.id ?? l?.value)?.toString()).filter(Boolean);
                const added = values.filter((v) => !current.includes(v));
                const removed = current.filter((v) => !values.includes(v));
                if (added.length) {
                  await complianceApi.assignComplianceLabel({
                    compliance_id: row?.id,
                    label_ids: added.map((v) => Number(v)),
                    action: "assign",
                  });
                }
                if (removed.length) {
                  await complianceApi.assignComplianceLabel({
                    compliance_id: row?.id,
                    label_ids: removed.map((v) => Number(v)),
                    action: "remove",
                  });
                }
                toast.success('Compliance labels updated');
                setTimeout(() => {
                  getData();
                }, 1500);
              } catch (error) {
                toast.error(error?.response?.data?.message || 'Failed to update labels');
              }
            }}
          />
          <Tooltip title="Call customer">
            <span>
              <IconButton
                onClick={async () => {
                  if (!row?.client_id || callingId === row?.id) return;
                  try {
                    setCallingId(row?.id);
                    const res = await customersApi.getCustomerPhones({ client_id: row?.client_id });
                    const numbers = res?.phone_numbers || res?.numbers || [];
                    const first = Array.isArray(numbers) && numbers.length > 0 ? (typeof numbers[0] === 'string' ? numbers[0] : (numbers[0]?.phone_number || numbers[0]?.number)) : null;
                    if (!first) {
                      toast.error('No phone number found for this client');
                      return;
                    }
                    await settingsApi.callRequest({ phone_number: first });
                    toast.success('Call requested');
                  } catch (error) {
                    toast.error(error?.response?.data?.message || 'Failed to start call');
                  } finally {
                    setCallingId(null);
                  }
                }}
                disabled={!row?.client_id || callingId === row?.id}
                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                size="small"
              >
                <Iconify icon="line-md:phone-call" width={22} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Open chat">
            <span>
              <IconButton
                onClick={() => {
                  if (!row?.client_id) return;
                  router.push(paths.dashboard.chat + `?customer=${row?.client_id}&returnTo=compliance`);
                }}
                disabled={!row?.client_id}
                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                size="small"
              >
                <Iconify icon="fluent:people-chat-16-regular" width={22} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Reminder">
            <span>
              <IconButton
                onClick={() => {
                  if (!row?.client_id) return;
                  setReminderClientId(row?.client_id);
                  setReminderOpen(true);
                }}
                disabled={!row?.client_id}
                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                size="small"
              >
                <Iconify icon="line-md:calendar" width={22} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Assign Announcement">
            <span>
              <IconButton
                onClick={async () => {
                  if (!row?.client_id) return;
                  try {
                    const response = await announcementsApi.getAnnouncements();
                    setAnnouncements(response?.announcements || []);
                  } catch (error) {
                    setAnnouncements([]);
                  }
                  setAnnouncementClientId(row?.client_id);
                  setOpenAnnouncementDialog(true);
                }}
                disabled={!row?.client_id}
                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                size="small"
              >
                <Iconify icon="mdi:announcement-outline" width={22} />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      )
    },
    {
      id: "provider",
      label: "Provider",
      enabled: true,
      hasSort: true,
      headerRender: () => (
        <FilterInput
          label="PROVIDER"
          placeholder="Provider..."
          filter={filters?.provider}
          setFilter={(val) => updateFilters({ provider: val })}
        />
      ),
      render: (row) => <Typography>{row?.provider || 'N/A'}</Typography>,
    },
    {
      id: "created_at",
      label: "Created At",
      hasSort: true,
      enabled: true,
      render: (row) => <Typography sx={{ whiteSpace: 'nowrap' }}>{row?.created_at ? new Date(row?.created_at).toLocaleString() : ''}</Typography>,
    },
  ], [filters, aiLabelList, labelList]);

  const idsChip = useMemo(() => {
    const chips = filters?.ids
      ? [
          {
            displayValue: filters?.ids,
            value: filters?.ids,
            label: "ID",
          },
        ]
      : [];
    return chips;
  }, [filters?.ids]);

  const statusChip = useMemo(() => {
    const chips = filters?.status
      ? [
          {
            displayValue: filters?.status,
            value: filters?.status,
            label: "Status",
          },
        ]
      : [];
    return chips;
  }, [filters?.status]);

  const channelChip = useMemo(() => {
    const chips = filters?.channel
      ? [
          {
            displayValue:
              channelList?.find((c) => c?.value === filters?.channel)?.label ||
              filters?.channel,
            value: filters?.channel,
            label: "Channel",
          },
        ]
      : [];
    return chips;
  }, [filters?.channel]);

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

  const providerChip = useMemo(() => {
    const chips = filters?.provider
      ? [
          {
            displayValue: filters?.provider,
            value: filters?.provider,
            label: "Provider",
          },
        ]
      : [];
    return chips;
  }, [filters?.provider]);

  const aiLabelsChip = useMemo(() => {
    const values = filters?.ai_label_ids ?? [];
    if (!values?.length) return [];
    return values?.map((id) => ({
      displayValue: aiLabelList?.find((l) => l?.value === id)?.label || id,
      value: id,
      label: "AI Label",
    }));
  }, [filters?.ai_label_ids, aiLabelList]);

  const nonAiLabelsChip = useMemo(() => {
    const values = filters?.non_ai_label_ids ?? [];
    if (!values?.length) return [];
    return values?.map((id) => ({
      displayValue: aiLabelList?.find((l) => l?.value === id)?.label || id,
      value: id,
      label: "Exclude AI Label",
    }));
  }, [filters?.non_ai_label_ids, aiLabelList]);

  const labelsChip = useMemo(() => {
    const values = filters?.label_ids ?? [];
    if (!values?.length) return [];
    return values?.map((id) => ({
      displayValue: labelList?.find((l) => l?.value === id)?.label || id,
      value: id,
      label: "Label",
    }));
  }, [filters?.label_ids, labelList]);

  const nonLabelsChip = useMemo(() => {
    const values = filters?.non_label_ids ?? [];
    if (!values?.length) return [];
    return values?.map((id) => ({
      displayValue: labelList?.find((l) => l?.value === id)?.label || id,
      value: id,
      label: "Exclude Label",
    }));
  }, [filters?.non_label_ids, labelList]);

  const isFilter =
    idsChip?.length ||
    statusChip?.length ||
    channelChip?.length ||
    aiLabelsChip?.length ||
    nonAiLabelsChip?.length ||
    labelsChip?.length ||
    nonLabelsChip?.length ||
    clientIdChip?.length ||
    providerChip?.length;

  const handleRemoveChip = (value, target) => {
    if (target === "ids") {
      updateFilters({ ids: undefined });
    }
    if (target === "status") {
      updateFilters({ status: undefined });
    }
    if (target === "channel") {
      updateFilters({ channel: undefined });
    }
    if (target === "client_id") {
      const newArrays = [...filters?.client_ids].filter(
        (item) => item !== value
      );
      updateFilters({ client_ids: newArrays });
    }
    if (target === "provider") {
      updateFilters({ provider: undefined });
    }
    if (target === "ai_label_ids") {
      const next = (filters?.ai_label_ids ?? []).filter((v) => v !== value);
      updateFilters({ ai_label_ids: next.length ? next : undefined });
    }
    if (target === "non_ai_label_ids") {
      const next = (filters?.non_ai_label_ids ?? []).filter((v) => v !== value);
      updateFilters({ non_ai_label_ids: next.length ? next : undefined });
    }
    if (target === "label_ids") {
      const next = (filters?.label_ids ?? []).filter((v) => v !== value);
      updateFilters({ label_ids: next.length ? next : undefined });
    }
    if (target === "non_label_ids") {
      const next = (filters?.non_label_ids ?? []).filter((v) => v !== value);
      updateFilters({ non_label_ids: next.length ? next : undefined });
    }
  };

  const tableColumn = useMemo(() => {
    if (rule?.length) {
      const updateColumn = baseColumns
        ?.map((item) => ({
          ...item,
          enabled: rule?.find((ruleItem) => item?.id === ruleItem?.id)?.enabled,
          order: rule?.find((ruleItem) => item?.id === ruleItem?.id)?.order,
        }))
        ?.sort((a, b) => a.order - b.order);
      return updateColumn;
    } else {
      return baseColumns?.map((item, index) => ({ ...item, order: index }));
    }
  }, [rule, baseColumns]);

  useEffect(() => {
    setRule(tableSetting?.complianceTable ?? []);
    setColumnSorting(tableSetting?.complianceSorting ?? {});
  }, [tableSetting]);

  const updateRule = (rule, sorting = {}) => {
    setRule(rule);
    const newSetting = {
      ...tableSetting,
      complianceTable: rule,
      complianceSorting: sorting,
    };
    setTableSetting(newSetting);
    localStorage.setItem("tableSetting", JSON.stringify(newSetting));
  };

  const handleSortToggle = async (fieldLabel) => {
    const current = columnSorting?.[fieldLabel];
    const next = current === true ? false : current === false ? undefined : true;
    const newSorting = { ...columnSorting, [fieldLabel]: next };
    setColumnSorting(newSorting);
    const newSetting = { ...tableSetting, complianceSorting: newSorting };
    setTableSetting(newSetting);
    localStorage.setItem("tableSetting", JSON.stringify(newSetting));
    setCurrentPage(0);
  };

  const getCompliances = async () => {
    try {
      const params = {
        q: q?.length ? q : null,
        page: currentPage + 1,
        per_page: perPage,
        ...filters,
      };
      if (columnSorting && Object.keys(columnSorting).length > 0) {
        params.sorting = columnSorting;
      }
      if (filters?.ids?.length) params.ids = [filters?.ids];
      const res = await complianceApi.getCompliances(params);
      setCompliances(res?.compliances ?? []);
      setTotalCount(res?.total_count ?? res?.compliances?.length ?? 0);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load compliances');
    }
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      await getCompliances();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [perPage, currentPage, q, filters, columnSorting]);

  const handleMakeExcelData = async () => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 800);
    try {
      setExportLoading(true);
      const data = [];
      const checkParams = {
        per_page: 1000,
        page: currentPage + 1,
        q: q?.length ? q : null,
        ...filters,
      };
      if (!selection?.selectAll) {
        checkParams["ids"] = selection?.selected;
      }
      if (columnSorting && Object.keys(columnSorting).length > 0) {
        checkParams.sorting = columnSorting;
      }
      const checkRes = await complianceApi.getCompliances(checkParams);
      const total = checkRes?.total_count ?? checkRes?.compliances?.length ?? 0;
      const per = 1000;
      const pages = Math.ceil(total / per);
      for (let page = 1; page <= pages; page++) {
        const params = { ...checkParams, page, per_page: per };
        const res = await complianceApi.getCompliances(params);
        const ids = data.map((d) => d?.id);
        data.push(...(res?.compliances ?? []).filter((c) => !ids.includes(c?.id)));
      }
      setExportLoading(false);
      clearInterval(timer);
      return { excelData: data, params: { ...checkParams } };
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Export failed');
      clearInterval(timer);
      setExportLoading(false);
      return { excelData: [], params: {} };
    }
  };

  const handleExport = async () => {
    const result = await handleMakeExcelData();
    if (!result || !result.excelData) {
      toast.error("Failed to export data. Please try again.");
      return;
    }
    const { excelData } = result;
    const modifiedArray = excelData?.map((obj) => {
      const out = {};
      const fields = rule?.length
        ? rule.filter((s) => s.enabled).sort((a, b) => a.order - b.order).map((s) => s.id)
        : baseColumns?.map((s) => s.id);
      fields.forEach((field) => {
        if (field === 'id') out['id'] = obj?.id;
        else if (field === 'status') out['status'] = obj?.status;
        else if (field === 'channel') out['channel'] = obj?.channel;
        else if (field === 'ai_labels') out['ai labels'] = (obj?.compliance_ai_labels_names || []).join(', ');
        else if (field === 'labels') out['labels'] = (obj?.compliance_labels_names || []).join(', ');
        else if (field === 'account_name') out['agent'] = obj?.account_name;
        else if (field === 'assignee_officer') out['assignee officer'] = 'n/a';
        else if (field === 'country') out['country'] = obj?.country || '';
        else if (field === 'client') {
          out['client id'] = obj?.client_id;
          out['client name'] = obj?.client_name;
        } else if (field === 'provider') out['provider'] = obj?.provider || '';
        else if (field === 'created_at') out['created'] = obj?.created_at ? new Date(obj?.created_at).toLocaleString() : '';
        else out[field] = obj?.[field];
      });
      return out;
    });
    exportToExcel(modifiedArray, `compliances-export-${new Date().toISOString().slice(0,10)}`);
  };

  const handleBulkAssignLabels = async (values) => {
    try {
      setBulkAssignLoading(true);
      setBulkLabels(values);
      const nextLabelIds = (values || []).map((v) => Number(v)).filter(Boolean);
      if (!nextLabelIds.length && !(bulkLabels || []).length) {
        setBulkAssignLoading(false);
        return;
      }

      const prevLabelIds = (bulkLabels || []).map((v) => Number(v)).filter(Boolean);
      const toAssign = nextLabelIds.filter((v) => !prevLabelIds.includes(v));
      const toRemove = prevLabelIds.filter((v) => !nextLabelIds.includes(v));

      const payloadBase = selection?.selectAll
        ? { select_all: true }
        : (selection?.selected || []).length
        ? { compliance_ids: selection.selected.map((id) => Number(id)).filter(Boolean) }
        : null;

      if (!payloadBase) {
        setBulkAssignLoading(false);
        return;
      }

      if (toAssign.length) {
        await complianceApi.assignComplianceLabel({
          ...payloadBase,
          label_ids: toAssign,
          action: "assign",
        });
      }
      if (toRemove.length) {
        await complianceApi.assignComplianceLabel({
          ...payloadBase,
          label_ids: toRemove,
          action: "remove",
        });
      }

      toast.success('Compliance labels assigned');
      setTimeout(() => {
        getData();
      }, 1500);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to assign labels');
    } finally {
      setBulkAssignLoading(false);
    }
  };

  return (
    <>
      <Stack alignItems="center" direction="row" spacing={2} sx={{ p: 2 }}>
        <Iconify icon="lucide:search" color="text.secondary" width={24} />
        <Box sx={{ flexGrow: 1 }}>
          <Input
            disableUnderline
            fullWidth
            placeholder="Enter a keyword"
            value={text}
            onChange={(e) => setText(e?.target?.value)}
          />
        </Box>
        <Stack direction='row' gap={0.5}>
          <Tooltip title="Reload Table">
            <IconButton
              onClick={() => {
                if(isLoading) return;
                getData();
              }}
              sx={{ 
                '&:hover': { color: 'primary.main', transform: 'rotate(180deg)', }, 
                transition: 'transform 0.3s', 
                color:  isLoading ? 'primary.main' : 'text.secondary',
                cursor: isLoading ? 'default' : 'pointer',
              }}
            >
              <Iconify icon={ isLoading ? "svg-spinners:8-dots-rotate" : "ion:reload-sharp"} width={24}/>
            </IconButton>
          </Tooltip>
          <Tooltip title="Search Setting">
            <IconButton>
              <SvgIcon>
                <FilterIcon />
              </SvgIcon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Table Setting">
            <IconButton onClick={() => setTableModal(true)}>
              <SvgIcon>
                <SettingIcon />
              </SvgIcon>
            </IconButton>
          </Tooltip>
          {exportLoading ? (
            <LinearProgress sx={{ width: 60 }} variant="determinate" value={progress} />
          ) : enableBulkActions ? (
            <Tooltip title="Export selected">
              <IconButton onClick={handleExport}>
                <Iconify icon="line-md:downloading-loop" width={24}/>
              </IconButton>
            </Tooltip>
          ) : null}
        </Stack>
      </Stack>
      <Divider />
      {isFilter ? (
        <>
          <Stack
            alignItems="center"
            direction="row"
            flexWrap="wrap"
            gap={1}
            sx={{ p: 2, px: 3 }}
          >
            <ChipSet chips={idsChip} handleRemoveChip={() => handleRemoveChip(null, "ids")} />
            <ChipSet chips={statusChip} handleRemoveChip={() => handleRemoveChip(null, "status")} />
            <ChipSet chips={channelChip} handleRemoveChip={() => handleRemoveChip(null, "channel")} />
            <ChipSet chips={clientIdChip} handleRemoveChip={(value) => handleRemoveChip(value, "client_id")} />
            <ChipSet chips={providerChip} handleRemoveChip={() => handleRemoveChip(null, "provider")} />
            <ChipSet chips={aiLabelsChip} handleRemoveChip={(value) => handleRemoveChip(value, "ai_label_ids")} />
            <ChipSet chips={nonAiLabelsChip} handleRemoveChip={(value) => handleRemoveChip(value, "non_ai_label_ids")} />
            <ChipSet chips={labelsChip} handleRemoveChip={(value) => handleRemoveChip(value, "label_ids")} />
            <ChipSet chips={nonLabelsChip} handleRemoveChip={(value) => handleRemoveChip(value, "non_label_ids")} />
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
              checked={tableIds?.every((id) => selection.selected?.includes(id))}
              indeterminate={tableIds?.some((id) => selection.selected?.includes(id)) && !tableIds?.every((id) => selection.selected?.includes(id))}
              onChange={(event) => {
                if (event.target.checked) {
                  if (tableIds?.some((id) => selection.selected?.includes(id)) && !tableIds?.every((id) => selection.selected?.includes(id))) {
                    selection.handleDeSelectPage(tableIds);
                  } else {
                    selection.handleSelectPage(tableIds);
                  }
                } else {
                  selection.handleDeSelectPage(tableIds);
                }
              }}
            />
            <Tooltip title={bulkAssignLoading ? "Assigning..." : "Assign labels to selected"}>
              <span>
                <MultiSelect
                  withSearch
                  noPadding
                  withIcon
                  disabled={bulkAssignLoading}
                  labelIcon={
                    <Iconify
                      icon="mynaui:label"
                      sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                      width={22}
                    />
                  }
                  options={labelList}
                  value={bulkLabels}
                  onChange={handleBulkAssignLabels}
                />
              </span>
            </Tooltip>
            <Stack direction="row" alignItems="center" spacing={1} pl={2}>
              <Typography sx={{ whiteSpace: "nowrap" }}>
                Selected <strong>{selection.selected?.length}</strong> of <strong>{totalCount}</strong>
              </Typography>
            </Stack>
            {!selection.selectAll && (
              <Button onClick={() => selection.handleSelectAll()}>
                <Typography sx={{ whiteSpace: "nowrap" }}>Selected All</Typography>
              </Button>
            )}
            <Button onClick={() => selection.handleDeselectAll()}>
              <Typography sx={{ whiteSpace: "nowrap" }}>Clear Selection</Typography>
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
                    checked={tableIds?.every((id) => selection.selected?.includes(id)) && !isLoading}
                    indeterminate={tableIds?.some((id) => selection.selected?.includes(id)) && !tableIds?.every((id) => selection.selected?.includes(id))}
                    onChange={(event) => {
                      if (event.target.checked) {
                        selection.handleSelectPage(tableIds);
                      } else {
                        selection.handleDeSelectPage(tableIds);
                      }
                    }}
                  />
                </TableCell>
                {tableColumn
                  ?.filter((item) => item.enabled)
                  ?.map((item) => (
                  <TableCell key={`${item.id}-header`}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {item?.hasSort !== false ? (
                          columnSorting?.[item?.label] === true ? (
                            <Tooltip title="Sorted by ascend">
                              <IconButton size="small" onClick={() => handleSortToggle(item?.label)}>
                                <Iconify icon="fa6-solid:sort-up" color="primary.main" />
                              </IconButton>
                            </Tooltip>
                          ) : columnSorting?.[item?.label] === false ? (
                            <Tooltip title="Sorted by descend">
                              <IconButton size="small" onClick={() => handleSortToggle(item?.label)}>
                                <Iconify icon="fa6-solid:sort-down" color="primary.main" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Sorting disabled">
                              <IconButton size="small" onClick={() => handleSortToggle(item?.label)} sx={{ opacity: ".5" }}>
                                <Iconify icon="bxs:sort-alt" />
                              </IconButton>
                            </Tooltip>
                          )
                        ) : null}
                        {item.headerRender ? (
                          item.headerRender()
                        ) : (
                          <Typography sx={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>{item?.label}</Typography>
                        )}
                      </Stack>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading && compliances.length === 0 ? null : (
                compliances?.map((row) => {
                  const isSelected = selection.selected.includes(row?.id);
                return (
                    <TableRow hover selected={isSelected} key={`compliance-${row?.id}`}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        sx={{ p: 0 }}
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                              selection.handleSelectOne(row?.id);
                          } else {
                              selection.handleDeselectOne(row?.id);
                          }
                        }}
                        value={isSelected}
                      />
                    </TableCell>
                      {tableColumn
                        ?.filter((item) => item.enabled)
                      ?.map((column, index) => (
                          <TableCell key={`${row?.id}-${column?.id}-${index}`} sx={{ whiteSpace: "nowrap" }}>
                            {column?.render ? column?.render(row) : row[column?.id]}
                        </TableCell>
                      ))}
                  </TableRow>
                );
              })
              )}
            </TableBody>
          </Table>
        </Scrollbar>
        <TablePagination
          component="div"
          labelRowsPerPage="Per page"
          count={totalCount ?? 0}
          page={currentPage ?? 0}
          rowsPerPage={perPage ?? 10}
          onPageChange={(event, index) => setCurrentPage(index)}
          onRowsPerPageChange={(event) => {
            const val = Number(event?.target?.value);
            setPerPage(val);
            localStorage.setItem("compliancePerPage", String(val));
          }}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
      </Box>

      <TableModal
        open={tableModal}
        onClose={() => setTableModal(false)}
        tableColumn={tableColumn}
        defaultColumn={baseColumns}
        updateRule={updateRule}
      />
      <ChatReminderDialog
        open={reminderOpen}
        onClose={() => {
          setReminderOpen(false);
          setReminderClientId(null);
        }}
        clientId={reminderClientId}
      />
      <AnnouncementDialog
        open={openAnnouncementDialog}
        onClose={() => setOpenAnnouncementDialog(false)}
        announcements={announcements}
        onAssign={async (announcementId) => {
          try {
            const params = { ...filters };
            const request = {
              client_ids: [announcementClientId || filters?.client_id || null].filter(Boolean),
              announcement_id: announcementId,
            };
            await announcementsApi.assignAnnouncement(params, request);
            toast.success('Announcement assigned successfully');
            setOpenAnnouncementDialog(false);
          } catch (error) {
            toast.error('Failed to assign announcement');
          }
        }}
      />
      <ComplianceAiLabelsDialog
        open={aiLabelsDialogOpen}
        onClose={() => setAiLabelsDialogOpen(false)}
        title="AI Labels"
        getLabelList={getAiLabels}
      />
      <ComplianceLabelsDialog
        open={labelsDialogOpen}
        onClose={() => setLabelsDialogOpen(false)}
        title="Labels"
        getLabelList={getLabels}
      />
      <ComplianceDrawer open={detailOpen} complianceId={detailId} onClose={handleCloseDetail} />
    </>
  );
};
