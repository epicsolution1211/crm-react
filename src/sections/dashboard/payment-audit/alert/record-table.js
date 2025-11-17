/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Link from "@mui/material/Link";
import OutlinedInput from "@mui/material/OutlinedInput";
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

import { Iconify } from 'src/components/iconify';
import SettingIcon from "src/icons/untitled-ui/duocolor/setting";
import { AuditLabelsDialog } from "src/components/audit-labels-dialog";
import { ChipSet } from "src/components/customize/chipset";
import { CircularProgressWithLabel } from "src/components/loader-with-percentage";
import { FilterMultiSelect } from "src/components/customize/filter-multi-select";
import { MultiSelect } from "src/components/multi-select";
import { PageNumberSelect } from "src/components/pagination/page-selector";
import { RouterLink } from "src/components/router-link";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { TableModal } from "src/components/table-settings-modal";
import { TableNoData } from "src/components/table-empty";
import { TableSkeleton } from "src/components/table-skeleton";
import { auditLabelsApi } from "src/api/payment_audit/labels";
import { exportToExcel } from "src/utils/export-excel";
import { paths } from "src/paths";
import { recordApi } from "src/api/payment_audit/record";
import { thunks } from "src/thunks/record";
import { useAuth } from "src/hooks/use-auth";
import { useDebounce } from "src/hooks/use-debounce";
import { useDispatch, useSelector } from "react-redux";
import { useMounted } from "src/hooks/use-mounted";
import { useSelection } from "src/hooks/use-selection";
import { settingsApi } from "src/api/settings";
import { useTimezone } from "src/hooks/use-timezone";

const enableOption = [
  {
    label: "Valid",
    value: "Valid",
  },
  {
    label: "Invalid",
    value: "Invalid",
  },
];

const useAuditLabels = (handleRecordsGet) => {
  const isMounted = useMounted();
  const [selectedLabels, setSelectedLabels] = useState([]);

  const handleSelectedLabelsGet = useCallback(
    async (selectedIds, selectAll) => {
      const requestData = {};

      if (selectAll) {
        requestData["select_all"] = true;
      }

      if (selectedIds && selectedIds.length > 0) {
        requestData["record_ids"] = selectedIds;
      }

      const { labels } = await auditLabelsApi.getAuditLabels(requestData);

      if (isMounted()) {
        setSelectedLabels(
          labels
            ?.filter((label) => label.check_status)
            .map((label) => label?.label?.id + "")
        );
      }
    },
    [isMounted]
  );

  const handleSelectedLabelsChange = useCallback(
    async (labels, filters = {}, recordSelection = {}) => {
      setSelectedLabels(labels);

      const addedLabels = labels.filter((l) => !selectedLabels.includes(l));
      const removedLabels = selectedLabels.filter((l) => !labels.includes(l));

      const requestData = {
        ...filters,
      };

      if (recordSelection?.selectAll) {
        requestData["select_all"] = true;
        if (recordSelection?.perPage && recordSelection?.perPage > 0) {
          requestData["per_page"] = recordSelection.perPage;
        }
      } else {
        requestData["record_ids"] = recordSelection?.selected;
      }

      if (addedLabels?.length) {
        requestData["add_label_ids"] = addedLabels;
      }

      if (removedLabels?.length) {
        requestData["remove_label_ids"] = removedLabels;
      }

      await recordApi.assignAuditLabelToRecord(requestData);
      handleRecordsGet();
      toast("Audit labels successfully updated!");
    },
    [selectedLabels]
  );

  return {
    handleSelectedLabelsGet,
    handleSelectedLabelsChange,
    selectedLabels,
    setSelectedLabels,
  };
};

export const RecordTable = ({ audit_file_id }) => {
  const { user } = useAuth();
  const { toLocalTime } = useTimezone();
  const accountId = localStorage.getItem("account_id");
  const localTableSetting = localStorage.getItem("tableSetting");
  const tableSetting = JSON.parse(localTableSetting);
  const dispatch = useDispatch();
  const recordsState = useSelector((state) => state.records);
  const recordIds = useSelector((state) => state.records.recordsIds);
  const filter = useSelector((state) => state.records.recordsFilters);
  const updateFilters = (data) => dispatch(thunks.setFilters(data));

  const [exportLoading, setExportLoading] = useState(false);
  const [progress, setProgress] = useState(10);
  const [records, setRecords] = useState([]);
  const [labelList, setLabelList] = useState();
  const [labelInfo, setLabelInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const query = useDebounce(filter?.query, 500);
  const [enabled, setEnabled] = useState([]);

  const [rule, setRule] = useState([]);
  const [tableModal, setTableModal] = useState(false);

  const [openLabelModal, setOpenLabelModal] = useState(false);

  const currentChip = useMemo(() => {
    const newChips = filter?.enabled?.map((item) => ({
      displayValue: item === "Valid" ? "Valid" : "Invalid",
      value: item,
      label: "Status",
    }));
    return newChips;
  }, [filter?.enabled]);
  const recordSelection = useSelection(recordIds ?? [], (message) => {
    toast.error(message);
  });
  const tableIds =
    useMemo(() => records?.map((item) => item?.id), [records]) ?? [];

  const enableBulkActions = recordSelection.selected?.length > 0;
  const selectedPage = useMemo(
    () => tableIds?.every((item) => recordSelection.selected?.includes(item)),
    [tableIds, recordSelection.selected]
  );
  const selectedSome = useMemo(
    () =>
      tableIds?.some((item) => recordSelection.selected?.includes(item)) &&
      !tableIds?.every((item) => recordSelection.selected?.includes(item)),
    [tableIds, tableIds, recordSelection.selected]
  );

  const handleRemoveChip = (value, target) => {
    if (target === "label") {
      const newArrays = [...filter?.label_ids].filter((item) => item !== value);
      updateFilters({ label_ids: newArrays });
    }
    if (target === "non_label") {
      const newArrays = [...filter?.non_label_ids].filter(
        (item) => item !== value
      );
      updateFilters({ non_label_ids: newArrays });
    }
  };

  const handleRemoveEnabledChip = (value) => {
    const newStatus = [...enabled].filter((item) => item !== value);
    updateFilters({ enabled: newStatus });
  };

  const labelChip = useMemo(
    () =>
      filter?.label_ids?.map((value) => ({
        displayValue: labelList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Label",
      })),
    [filter?.label_ids, labelList]
  );

  const nonLabelChip = useMemo(
    () =>
      filter?.non_label_ids?.map((value) => ({
        displayValue: labelList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Exclude Label",
      })),
    [filter?.non_label_ids, labelList]
  );

  const chipSetList = [
    {
      chipValue: labelChip,
      removeChip: (value) => handleRemoveChip(value, "label"),
    },
    {
      chipValue: nonLabelChip,
      removeChip: (value) => handleRemoveChip(value, "non_label"),
    },
  ];

  const getRecords = async () => {
    setIsLoading(true);
    let request = {
      page: filter?.currentPage + 1,
      per_page: filter?.perPage,
      q: query?.length > 0 ? query : null,
      audit_file_id,
      ...filter,
    };
    if (
      filter?.enabled &&
      filter?.enabled[0] === "Valid" &&
      filter?.enabled?.length === 1
    ) {
      request.status = "Valid";
    }
    if (
      filter?.enabled &&
      filter?.enabled[0] === "Invalid" &&
      filter?.enabled?.length === 1
    ) {
      request.status = "Invalid";
    }
    try {
      dispatch(thunks.getRecords(request));
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setIsLoading(false);
  };

  const {
    selectedLabels,
    handleSelectedLabelsChange,
    handleSelectedLabelsGet,
    setSelectedLabels,
  } = useAuditLabels(getRecords);

  const getLabels = async () => {
    try {
      const res = await auditLabelsApi.getAuditLabels();
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
      setLabelInfo(res?.labels);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const updateRule = (rule) => {
    setRule(rule);

    if (tableSetting) {
      const updateSetting = {
        ...tableSetting,
        recordTable: rule,
      };
      localStorage.setItem("tableSetting", JSON.stringify(updateSetting));
    } else {
      const tableSettings = {
        recordTable: rule,
      };
      localStorage.setItem("tableSetting", JSON.stringify(tableSettings));
    }
  };

  useEffect(() => {
    getLabels();
  }, []);

  useEffect(() => {
    getRecords();
  }, [currentPage, perPage, query, filter]);

  useEffect(() => {
    const fetchLabels = async () => {
      if (recordSelection.selectAll) {
        await handleSelectedLabelsGet(
          [],
          recordSelection.selectAll,
        );
      } else {
        setSelectedLabels([]);
      }
    };

    fetchLabels();
  }, [
    recordSelection.selectAll,
    recordSelection.deselected,
    handleSelectedLabelsGet,
  ]);

  useEffect(() => {
    const fetchLabels = async () => {
      if (!recordSelection.selectAll && recordSelection.selected.length > 0) {
        await handleSelectedLabelsGet(
          recordSelection.selected,
          recordSelection.selectAll
        );
      }
    };

    fetchLabels();
  }, [recordSelection.selected, handleSelectedLabelsGet]);

  useEffect(() => {
    setRule(tableSetting?.recordTable ?? []);
  }, []);

  const totalPage = useMemo(()=> {
    if(recordsState?.records?.total_count) {
      const perPage = filter?.perPage ? parseInt(filter?.perPage) : 10 ;
      const totalPage =  Math.ceil(recordsState?.records?.total_count/perPage);
      return totalPage;
    }
    return 0;
  }, [recordsState, filter?.perPage]);

  const defaultColumn = [
    {
      id: "id",
      label: "Id",
      enabled: true,
      render: (row) => (
        <Link
          color="text.primary"
          component={RouterLink}
          href={`${paths.dashboard.paymentAudit.record.index}/${row?.id}`}
          sx={{
            alignItems: "center",
            display: "inline-flex",
          }}
          underline="hover"
        >
          {row?.id}
        </Link>
      ),
    },
    {
      id: "source",
      label: "Source",
      enabled: true,
      render: (row) => (
        <Stack direction="row" gap={1} alignItems="center">
          {row?.source?.ai && <SeverityPill color="success">ai</SeverityPill>}
          {row?.source?.code && (
            <SeverityPill color="success">code</SeverityPill>
          )}
        </Stack>
      ),
    },
    {
      id: "status",
      label: "Status",
      enabled: true,
      headerRender: () => (
        <MultiSelect
          noPadding
          label="STATUS"
          width={150}
          options={enableOption}
          onChange={(val) => updateFilters({ enabled: val })}
          value={filter?.enabled}
        />
      ),
      render: (row) => (
        <SeverityPill color={row?.status === "Valid" ? "success" : "error"}>
          {row?.status}
        </SeverityPill>
      ),
    },
    {
      id: "d_id",
      label: "Internal Id",
      enabled: true,
    },
    {
      id: "d_reference_id",
      label: "Reference Id",
      enabled: true,
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
          handleModalOpen={() => setOpenLabelModal(true)}
          placeholder="Label..."
          options={labelList ?? []}
          onChange={(val) => {
            updateFilters({ label_ids: val });
          }}
          value={filter?.label_ids}
          onChangeNon={(val) => {
            updateFilters({ non_label_ids: val });
          }}
          valueNon={filter?.non_label_ids}
        />
      ),
      render: (row) =>
        row?.labels?.map((item) => (
          <Chip
            key={item}
            label={item}
            size="small"
            color="primary"
            sx={{
              backgroundColor:
                labelInfo?.find(({ label }) => item === label?.name)?.label
                  ?.color ?? "",
              mr: 1,
            }}
          />
        )),
    },
    {
      id: "d_account",
      label: "Agents",
      enabled: true,
    },
    {
      id: "d_client_name",
      label: "Client Name",
      enabled: true,
    },
    {
      id: "d_client_type",
      label: "Client Type",
      enabled: true,
    },
    {
      id: "d_account_provider_number",
      label: "Account Provider Number",
      enabled: true,
    },
    {
      id: "d_status",
      label: "Status Error",
      enabled: true,
    },
    {
      id: "d_type",
      label: "Type",
      enabled: true,
    },
    {
      id: "d_amount",
      label: "Amount",
      enabled: true,
      render: (row) => (
        <Typography color={row?.d_amount < 0 ? "error" : ""}>
          {row?.d_amount}
        </Typography>
      ),
    },
    {
      id: "d_currency",
      label: "Currency",
      enabled: true,
    },
    {
      id: "d_remitter_name",
      label: "Remitter Name",
      enabled: true,
    },
    {
      id: "d_remitter_account",
      label: "Remitter Account",
      enabled: true,
    },
    {
      id: "d_beneficiary_name",
      label: "Beneficiary Name",
      enabled: true,
    },
    {
      id: "d_beneficiary_type",
      label: "Beneficiary Type",
      enabled: true,
    },
    {
      id: "d_bic",
      label: "Bic",
      enabled: true,
    },
    {
      id: "d_description",
      label: "Description",
      enabled: true,
    },

    {
      id: "d_charge_type",
      label: "Charge Type",
      enabled: true,
    },
    {
      id: "d_provider",
      label: "provider",
      enabled: true,
    },
    {
      id: "d_provider_id",
      label: "Provider Id",
      enabled: true,
    },
    {
      id: "d_partner_id",
      label: "Partner Id",
      enabled: true,
    },
    {
      id: "payment_type",
      label: "Payment Type",
      enabled: true,
    },
    {
      id: "fee_actual",
      label: "Fees (actual)",
      enabled: true,
      render: (row) => (
        <Typography
          variant="h7"
          sx={{
            color: row?.fee_actual !== row?.fee_expected ? "red" : "",
          }}
        >
          {row?.fee_actual}
        </Typography>
      ),
    },
    {
      id: "fee_expected",
      label: "Fees (expected)",
      enabled: true,
      render: (row) => (
        <Typography
          variant="h7"
          sx={{
            color: row?.fee_actual !== row?.fee_expected ? "red" : "",
          }}
        >
          {row?.fee_expected}
        </Typography>
      ),
    },
    {
      id: "cost_actual",
      label: "Cost (actual)",
      enabled: true,
      render: (row) => (
        <Typography
          variant="h7"
          sx={{
            color: row?.cost_actual !== row?.cost_expected ? "red" : "",
          }}
        >
          {row?.cost_actual}
        </Typography>
      ),
    },
    {
      id: "cost_expected",
      label: "Cost (expected)",
      enabled: true,
      render: (row) => (
        <Typography
          variant="h7"
          sx={{
            color: row?.cost_actual !== row?.cost_expected ? "red" : "",
          }}
        >
          {row?.cost_expected}
        </Typography>
      ),
    },
    {
      id: "upload_time",
      label: "Upload Time",
      enabled: true,
      render: (row) => (
        <Typography variant="h7">
          {toLocalTime(row?.upload_time)}
        </Typography>
      ),
    },
    {
      id: "d_created",
      label: "Created At",
      enabled: true,
      render: (row) => (
        <Typography variant="h7">
          {toLocalTime(row?.created_at)}
        </Typography>
      ),
    },
    {
      id: "d_updated",
      label: "Updated At",
      enabled: true,
      render: (row) => (
        <Typography variant="h7">
          {toLocalTime(row?.updated_at)}
        </Typography>
      ),
    },
  ];

  const tableColumn = useMemo(() => {
    if (rule?.length) {
      const updateColumn = defaultColumn
        ?.map((item, index) => ({
          ...item,
          enabled: rule?.find((ruleItem) => item?.id === ruleItem?.id)?.enabled,
          order: rule?.find((ruleItem) => item?.id === ruleItem?.id)?.order,
        }))
        ?.sort((a, b) => a.order - b.order);
      return updateColumn;
    } else {
      return defaultColumn?.map((item, index) => ({ ...item, order: index }));
    }
  }, [rule, enabled, labelList, filter]);

  const handleSelectedLabelsUpdate = useCallback(
    (labels) => {
      const selected = recordSelection.selectAll ? [] : recordSelection.selected;
      const selectionData = {
        ...recordSelection,
        selected: selected,
      };
      handleSelectedLabelsChange(labels, filter, selectionData);
    },
    [handleSelectedLabelsChange, filter, recordSelection]
  );

  const handleExport = useCallback(async () => {
    const dateNow = new Date();
    const exportDate = format(dateNow, "dd.mm.yyyy");
    const { excelData, params } = await handleMakeExcelData();

    if (rule?.length) {
      const filteredAndSortedFields = rule
        .filter((setting) => setting.enabled)
        .sort((a, b) => a.order - b.order)
        .map((setting) => setting.id);

      const modifiedArray = excelData?.map((obj) => {
        const modifiedObj = {};
        filteredAndSortedFields.forEach((field) => {
          modifiedObj[field] = obj[field];
        });
        return modifiedObj;
      });

      exportToExcel(modifiedArray, `records-import-${exportDate}`);
      localStorage.setItem("last_beat_time", new Date().getTime());
      await settingsApi.updateMember(accountId, {
        last_beat: true,
        trigger: "export",
        export_filter_data: JSON.stringify(params),
        export_count: recordSelection?.selectAll ? excelData?.length + "" : recordSelection?.selected?.length ? recordSelection?.selected?.length + "" : 0,
        export_table: "Record"
      });
    } else {
      if (excelData) exportToExcel(excelData, `records-import-${exportDate}`);
    }
    localStorage.setItem("last_beat_time", new Date().getTime());
    await settingsApi.updateMember(accountId, {
      last_beat: true,
      trigger: "export",
      export_filter_data: JSON.stringify(params),
      export_count: recordSelection?.selectAll ? excelData?.length + "" : recordSelection?.selected?.length ? recordSelection?.selected?.length + "" : 0,
      export_table: "Record"
    });
  }, [
    perPage,
    currentPage,
    query,
    filter,
    rule,
    recordSelection,
    audit_file_id,
    enabled,
  ]);

  const handleMakeExcelData = async () => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 800);

    try {
      setExportLoading(true);
      const data = [];
      const params = {
        per_page: perPage,
        page: currentPage + 1,
        q: query?.length > 0 ? query : null,
        audit_file_id,
        ...filter,
      };
      if (enabled[0] === "Valid" && enabled?.length === 1) {
        params.status = "Valid";
      }
      if (enabled[0] === "Invalid" && enabled?.length === 1) {
        params.status = "Invalid";
      }
      const res = await recordApi.getRecords(params);

      const newParams = {
        per_page: recordSelection?.selectAll
          ? res?.total_count
          : recordSelection?.selected?.length,
        page: currentPage + 1,
        q: query?.length > 0 ? query : null,
        audit_file_id,
        ...filter,
      };
      if (!recordSelection?.selectAll) {
        newParams["ids"] = recordSelection?.selected;
      }
      const newRes = await recordApi.getRecords(newParams);

      setExportLoading(false);
      clearInterval(timer);

      data.push(...newRes?.records);

      return { excelData: data, params: newParams };
    } catch (error) {
      toast.error(error?.response?.data?.message);
      clearInterval(timer);
      setExportLoading(false);
    }
  };

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
      <Card>
        <Stack alignItems="center" direction="row" spacing={2} sx={{ p: 2 }}>
          <Iconify icon="lucide:search" color="text.secondary" width={24} />
          <Box sx={{ flexGrow: 1 }}>
            <Input
              disableUnderline
              fullWidth
              value={filter?.query ?? ""}
              onChange={(event) => {
                updateFilters({ query: event?.target?.value });
              }}
              placeholder="Enter a keyword"
            />
          </Box>
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
          ) : enableBulkActions  ? (
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
        {labelChip?.length || nonLabelChip?.length ? (
          <>
            <Divider />
            <Stack
              alignItems="center"
              direction="row"
              flexWrap="wrap"
              gap={1}
              sx={{ p: 2, px: 3 }}
            >
              {chipSetList?.map((item, index) => (
                <ChipSet
                  chips={item.chipValue}
                  handleRemoveChip={item.removeChip}
                  key={index}
                />
              ))}
            </Stack>
          </>
        ) : null}
        {filter?.enabled?.length ? (
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
                handleRemoveChip={(value) => handleRemoveEnabledChip(value)}
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
                      recordSelection.handleDeSelectPage(tableIds);
                    } else {
                      recordSelection.handleSelectPage(tableIds);
                    }
                  } else {
                    recordSelection.handleDeSelectPage(tableIds);
                  }
                }}
              />
              <Stack direction="row" alignItems="center" spacing={1}>
                <MultiSelect
                  withSearch
                  withEdit
                  noPadding
                  withIcon
                  editLabel="Edit audit labels"
                  labelIcon={
                    <Tooltip title="Assign label">
                      <Iconify icon="pepicons-pencil:label" width={24} />
                    </Tooltip>
                  }
                  options={labelList}
                  onChange={handleSelectedLabelsUpdate}
                  onEditClick={() => setOpenLabelModal(true)}
                  value={selectedLabels}
                />

                {recordSelection.selectAll ? (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      Select first:
                    </Typography>
                    <OutlinedInput
                      type="number"
                      placeholder="All"
                      value={recordSelection.perPage || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || value === "0") {
                          recordSelection.setPerPage(null);
                        } else {
                          const numValue = parseInt(value);
                          if (numValue > 5000) {
                            recordSelection.setPerPage(5000);
                          } else if (numValue > 0) {
                            recordSelection.setPerPage(numValue);
                          } else {
                            recordSelection.setPerPage(null);
                          }
                        }
                      }}
                      inputProps={{
                        min: 1,
                        max: Math.min(recordsState?.records?.total_count ?? 0, 5000),
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
                      of {recordsState?.records?.total_count ?? 0} items
                    </Typography>
                  </Stack>
                ) : (
                  <Typography sx={{ whiteSpace: "nowrap" }}>
                    Selected <strong>{recordSelection.selected?.length}</strong>{" "}
                    of <strong>{recordsState?.records?.total_count ?? 0}</strong>
                  </Typography>
                )}
              </Stack>
              {recordSelection.selectAll ? (
                <Button onClick={() => recordSelection.handleDeselectAll()}>
                  <Typography sx={{ whiteSpace: "nowrap" }}>
                    Clear Selection
                  </Typography>
                </Button>
              ) : (
                <Button onClick={() => recordSelection.handleSelectAll()}>
                  <Typography sx={{ whiteSpace: "nowrap" }}>
                    Selected All
                  </Typography>
                </Button>
              )}
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
                          recordSelection.handleSelectPage(tableIds);
                        } else {
                          recordSelection.handleSelectPage(tableIds);
                        }
                      }}
                    />
                  </TableCell>
                  {tableColumn
                    ?.filter((item) => item.enabled)
                    ?.map((item) => (
                      <TableCell key={item.id} sx={{ width: item.width }}>
                        {item.headerRender ? (
                          item.headerRender()
                        ) : (
                          <Typography sx={{ fontSize: 14, fontWeight: "600" }}>
                            {item.label}
                          </Typography>
                        )}
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton
                    rowCount={perPage > 15 ? 15 : 10}
                    cellCount={25}
                  />
                ) : (
                  recordsState?.records?.records?.map((record) => {
                    const isSelected = recordSelection.selected.includes(
                      record?.id
                    );

                    return (
                      <TableRow key={record?.id} sx={{ whiteSpace: "nowrap" }}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            sx={{ p: 0 }}
                            checked={isSelected}
                            onChange={(event) => {
                              if (event.target.checked) {
                                recordSelection.handleSelectOne?.(record?.id);
                              } else {
                                recordSelection.handleDeselectOne?.(record?.id);
                              }
                            }}
                            value={isSelected}
                          />
                        </TableCell>
                        {tableColumn
                          ?.filter((item) => item.enabled)
                          ?.map((column, index) => (
                            <TableCell key={record.id + index}>
                              {column?.render
                                ? column?.render(record)
                                : record[column?.id] ?? ""}
                            </TableCell>
                          ))}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </Box>
        {recordsState?.records?.records?.length === 0 && !isLoading && (<TableNoData />)}
        <Stack sx={{  flexDirection: { md: 'row', xs: 'column' }, gap: 0, justifyContent: 'flex-end', alignItems: { md: 'center', xs: 'start' } }}>
          <PageNumberSelect 
            currentPage={filter?.currentPage} 
            totalPage={totalPage}
            onUpdate={(pageNum)=> updateFilters({ currentPage: pageNum })}
          />
          <TablePagination
            component="div"
            labelRowsPerPage="Per page"
            count={recordsState?.records?.total_count ?? 0}
            onPageChange={(event, index) => updateFilters({ currentPage: index })}
            onRowsPerPageChange={(event) =>
              updateFilters({ perPage: event?.target?.value })
            }
            page={filter?.currentPage}
            rowsPerPage={filter?.perPage}
            rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
          />
        </Stack>
      </Card>
      <TableModal
        open={tableModal}
        onClose={() => setTableModal(false)}
        tableColumn={tableColumn}
        defaultColumn={defaultColumn}
        updateRule={updateRule}
      />
      <AuditLabelsDialog
        title="Edit audit labels"
        open={openLabelModal}
        onClose={() => setOpenLabelModal(false)}
        getLabelList={getLabels}
        onGetLabels={getLabels}
      />
    </>
  );
};
