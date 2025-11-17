import { useCallback } from "react";
import { useMemo, useState, useEffect } from "react";
import isEqual from "lodash.isequal";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import OutlinedInput from "@mui/material/OutlinedInput";
import { toast } from "react-hot-toast";

import SettingIcon from "src/icons/untitled-ui/duocolor/setting";
import { ChipSet } from "src/components/customize/chipset";
import { CircularProgressWithLabel } from "src/components/loader-with-percentage";
import { ClientFilterInput } from 'src/components/customize/client-filter-input';
import { FilterDateTime } from "src/components/customize/filter-date-time";
import { FilterModal } from "src/components/filter-settings-modal";
import { FilterMultiSelect } from "src/components/customize/filter-multi-select";
import { FormInfoDrawer } from "./form-drawer";
import { Iconify } from 'src/components/iconify';
import { MultiSelect } from "src/components/multi-select";
import { PageNumberSelect } from "src/components/pagination/page-selector";
import { RouterLink } from "src/components/router-link";
import { Scrollbar } from "src/components/scrollbar";
import { TableModal } from "src/components/table-settings-modal";
import { TableNoData } from "src/components/table-empty";
import { TableSkeleton } from "src/components/table-skeleton";
import { authApi } from "src/api/auth";
import { exportToExcel } from "src/utils/export-excel";
import { formsApi } from "src/api/forms";
import { paths } from "src/paths";
import { settingsApi } from "src/api/settings";
import { submittedFormsApi } from "src/api/submitted-forms";
import { thunks } from "src/thunks/submitted_forms";
import { useTimezone } from "src/hooks/use-timezone";
import { userApi } from "src/api/user";

export const FormsTable = ({
  count = 0,
  onPageChange = () => { },
  onRowsPerPageChange,
  page = 0,
  rowsPerPage = 0,
  tableData,
  labels,
  setLabels,
  labelList,
  isLoading,
  text,
  setText,
  brands,
  handleLabelsDialogOpen,
  selected = [],
  selectAll,
  onSelectAll,
  onSelectPage,
  onDeselectAll,
  onDeselectPage,
  onSelectOne,
  onDeselectOne,
  getSubmittedForms,

  currentBrandId,
  setCurrentBrandId,

  selectedLabels,

  // Assign labels
  handleSelectedLabelsChange = () => {},
  
  // Selection perPage functionality
  perPage: selectFirstPerPage,
  setPerPage,
}) => {
  const accountId = localStorage.getItem("account_id");

  const [filterModal, setFilterModal] = useState(false);
  const [searchSetting, setSearchSetting] = useState([]);
  const [selectedFilterValue, setSelectedFilterValue] = useState("none");

  const [clientList, setClientList] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [brandForms, setBrandForms] = useState([]);
  const [selectedFormNames, setSelectedFormNames] = useState([]);

  const [exportLoading, setExportLoading] = useState(false);
  const [progress, setProgress] = useState(10);

  const handleRowClick = (form) => {
    setSelectedForm(form);
    setDrawerOpen(true);
  };

  const dispatch = useDispatch();
  const { toLocalTime } = useTimezone();

  const filters = useSelector((state) => state.submittedForms.submittedFormsFilters);
  const updateFilters = (data) => dispatch(thunks.setFilters(data));
  const resetFilters = () => dispatch(thunks.resetFilter());

  const [rule, setRule] = useState([]);
  const [tableModal, setTableModal] = useState(false);
  const [tableSetting, setTableSetting] = useState({});

  const tableIds = useMemo(
    () => tableData?.map((form) => form?.id),
    [tableData]
  );

  const fetchBrandForms = async () => {
    try {
      const response = await formsApi.getForms();
      if (response?.forms) {
        const forms = response.forms.map(form => ({
          label: (() => {
            try {
              const formName = JSON.parse(form?.name);
              return formName?.en || form?.name || '';
            } catch (error) {
              return form?.name || '';
            }
          })(),
          value: form?.id?.toString()
        }));
        setBrandForms(forms);
      }
    } catch (error) {
      console.error("Error fetching brand forms:", error);
    }
  };

  useEffect(() => {
    fetchBrandForms();
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

  const getTableSetting = async () => {
    try {
      const localTableSetting = localStorage.getItem("tableSetting");
      const { account } = await authApi.me({ accountId });
      if (account?.column_setting) {
        setTableSetting(JSON.parse(account?.column_setting));
        setRule(JSON.parse(account?.column_setting)?.submittedFormsTable ?? []);
      } else if (localTableSetting) {
        const { account: _account } = await userApi.updateUser(accountId, {
          column_setting: localTableSetting,
        });
        setTableSetting(JSON.parse(_account?.column_setting));
        setRule(JSON.parse(_account?.column_setting)?.submittedFormsTable ?? []);
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getTableSetting();
  }, []);

  const formNameChip = useMemo(() => {
    const newChips = selectedFormNames?.length > 0
      ? selectedFormNames.map(formName => ({
        displayValue: formName,
        value: formName,
        label: "Form Name",
      }))
      : [];
    return newChips;
  }, [selectedFormNames]);

  const labelChip = useMemo(
    () =>
      labels?.map((value) => ({
        displayValue: labelList?.find((label) => label?.value === value)?.label ?? value,
        value: value,
        label: "Label",
      })),
    [labels, labelList]
  );

  const clientIdChip = useMemo(
    () =>
      filters?.client_ids?.map((value) => ({
        displayValue: clientList?.find((client)=> client?.value==value)?.label ?? value,
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


  const updateRule = async (rule) => {
    setRule(rule);

    if (tableSetting) {
      const updateSetting = {
        ...tableSetting,
        submittedFormsTable: rule,
      };
      await userApi.updateUser(accountId, {
        column_setting: JSON.stringify(updateSetting),
      });
      setTableSetting(updateSetting);
    } else {
      const updateSetting = {
        submittedFormsTable: rule,
      };
      await userApi.updateUser(accountId, {
        column_setting: JSON.stringify(updateSetting),
      });
      setTableSetting(updateSetting);
    }
  };

  const defaultColumn = [
    {
      id: "id",
      label: "ID",
      enabled: true
    },
    {
      id: "form_name",
      label: "Form Name",
      enabled: true,
      headerRender: () => (
        <FilterMultiSelect
          label="FORM NAME"
          withSearch
          placeholder="Form name..."
          options={brandForms}
          onChange={(val) => {
            const selectedNames = val.map(formId => {
              const form = brandForms.find(f => f.value === formId);
              return form ? form.label : formId;
            });
            setSelectedFormNames(selectedNames);
            updateFilters({ form_ids: val });
          }}
          value={filters?.form_ids || []}
        />
      ),
      render: (row) => (
        <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
          {(() => {
            try {
              const formName = JSON.parse(row?.form_name);
              return formName?.en || '';
            } catch (error) {
              return row?.form_name || '';
            }
          })()}
        </Typography>
      ),
    },
    {
      id: "client_name",
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
          onChange={(val) => {
            setLabels(val);
          }}
          value={labels ?? []}
        />
      ),
      render: (row) => (
        <Stack direction="row">
          {row?.label_assignments?.map((label) => (
            <Chip
              key={label.id}
              label={label.form_label_name}
              size="small"
              color="primary"
              sx={{ backgroundColor: label?.form_label_color ?? "", mr: 1 }}
            />
          ))}
        </Stack>
      ),
    },
    {
      id: "created_at",
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
    labels,
    filters,
    brands,
    brandForms,
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

  const handleRemoveChip = (value, target) => {
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
    if (target === "form_names") {
      const newArrays = [...selectedFormNames].filter(
        (item) => item !== value
      );
      setSelectedFormNames(newArrays);
      const formIds = newArrays.map(formName => {
        const form = brandForms.find(f => f.label === formName);
        return form ? form.value : formName;
      });
      updateFilters({ form_ids: formIds });
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

  const isFilter =
    formNameChip?.length ||
    clientIdChip?.length ||
    createdStartChip?.length ||
    createdEndChip?.length ||
    labelChip?.length;

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
        page: 1,
        q: text?.length ? text : null,
        internal_brand_id: currentBrandId,
      };

      if (selected?.length > 0) {
        checkParams["client_brand_form_ids"] = selected;
      }

      const checkRes = await submittedFormsApi.getSubmittedFormsInfo(checkParams);
      const totalForms = selectFirstPerPage ? selectFirstPerPage : checkRes?.total_count;

      let allData = [];

      if (selectFirstPerPage && selectFirstPerPage > 1000) {
        const numPages = Math.ceil(selectFirstPerPage / 1000);
        
        for (let page = 1; page <= numPages; page++) {
          const newParams = {
            page,
            per_page: 1000,
            q: text?.length ? text : null,
            internal_brand_id: currentBrandId,
          };
  
          if (selected?.length > 0) {
            newParams["client_brand_form_ids"] = selected;
          }
          const newRes = await submittedFormsApi.getSubmittedFormsInfo(newParams);
          
          const dataIds = allData?.map(d => d?.id);
          allData.push(
            ...newRes?.forms?.filter((form) => !dataIds?.includes(form?.id))
          );
        }
        
        const totalFetched = allData.length;
        if (totalFetched > selectFirstPerPage) {
          allData = allData.slice(0, selectFirstPerPage);
        }
      } else {
        const perPage = totalForms < 1000 ? totalForms : 1000;
        const numPages = !selectAll ? 1 : Math.ceil(totalForms / perPage);

        for (let page = 1; page <= numPages; page++) {
          const newParams = {
            page,
            per_page: perPage,
            q: text?.length ? text : null,
            internal_brand_id: currentBrandId,
          };

          if (selected?.length > 0) {
            newParams["client_brand_form_ids"] = selected;
          }
          const newRes = await submittedFormsApi.getSubmittedFormsInfo(newParams);
          
          const dataIds = allData?.map(d => d?.id);
          allData.push(
            ...newRes?.forms?.filter((form) => !dataIds?.includes(form?.id))
          );
        }
      }

      data.push(...allData);

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
          if (field === "id") {
            modifiedObj["ID"] = obj?.id;
          } else if (field === "form_name") {
            try {
              const formName = JSON.parse(obj?.form_name);
              modifiedObj["Form Name"] = formName?.en || obj?.form_name || "";
            } catch (error) {
              modifiedObj["Form Name"] = obj?.form_name || "";
            }
          } else if (field === "client_name") {
            modifiedObj["Client Name"] = obj?.client_name || "";
          } else if (field === "client_id") {
            modifiedObj["Client ID"] = obj?.client_id || "";
          } else if (field === "client_country") {
            modifiedObj["Client Country"] = obj?.client_country || "";
          } else if (field === "labels") {
            modifiedObj["Labels"] = obj?.label_assignments?.map(label => label.form_label_name).join(", ") || "";
          } else if (field === "created_at") {
            modifiedObj["Created At"] = obj?.created_at || "";
          } else if (field === "updated_at") {
            modifiedObj["Updated At"] = obj?.updated_at || "";
          }
        });
        return modifiedObj;
      });

      exportToExcel(modifiedArray, `submitted-forms-export-${exportDate}`);

      localStorage.setItem("last_beat_time", new Date().getTime());
      await settingsApi.updateMember(accountId, {
        last_beat: true,
        trigger: "export",
        export_filter_data: JSON.stringify(params),
        export_count: selected?.length > 0 ? selected?.length + "" : excelData?.length + "",
        export_table: "Submitted Forms",
      });
    } else {
      const modifiedArray = excelData?.map((obj) => {
        const modifiedObj = {};
        defaultColumn
          ?.map((setting) => setting?.id)
          ?.forEach((field) => {
            if (field === "id") {
              modifiedObj["ID"] = obj?.id;
            } else if (field === "form_name") {
              try {
                const formName = JSON.parse(obj?.form_name);
                modifiedObj["Form Name"] = formName?.en || obj?.form_name || "";
              } catch (error) {
                modifiedObj["Form Name"] = obj?.form_name || "";
              }
            } else if (field === "client_name") {
              modifiedObj["Client Name"] = obj?.client_name || "";
            } else if (field === "client_id") {
              modifiedObj["Client ID"] = obj?.client_id || "";
            } else if (field === "client_country") {
              modifiedObj["Client Country"] = obj?.client_country || "";
            } else if (field === "labels") {
              modifiedObj["Labels"] = obj?.label_assignments?.map(label => label.form_label_name).join(", ") || "";
            } else if (field === "created_at") {
              modifiedObj["Created At"] = obj?.created_at || "";
            } else if (field === "updated_at") {
              modifiedObj["Updated At"] = obj?.updated_at || "";
            }
          });
        return modifiedObj;
      });

      if (modifiedArray) {
        exportToExcel(modifiedArray, `submitted-forms-export-${exportDate}`);
      }

      localStorage.setItem("last_beat_time", new Date().getTime());
      await settingsApi.updateMember(accountId, {
        last_beat: true,
        trigger: "export",
        export_filter_data: JSON.stringify(params),
        export_count: selected?.length > 0 ? selected?.length + "" : excelData?.length + "",
        export_table: "Submitted Forms",
      });
    }
  }, [
    text,
    filters,
    currentBrandId,
    selected,
    rule,
    defaultColumn,
  ]);

  return (
    <>
      <Stack alignItems="center" justifyContent="space-between" direction="row" spacing={2} sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={3}>
          <Stack direction="row" alignItems="center" spacing={2} ml={2}>
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
          </Stack>
        </Stack>
        <Stack direction='row' gap={1} alignItems='center'>
        <Stack direction="row" alignItems="center" spacing={2} mr={2}>
          <Typography>Internal Brand :</Typography>
            <Select
              fullWidth
              size="small"
              value={currentBrandId ?? ""}
              onChange={(event) => setCurrentBrandId(event?.target?.value)}
              sx={{ width: 200 }}
            >
              {brands?.map((item) => (
                <MenuItem
                  key={item?.id}
                  value={item?.id}
                >
                  {item?.company_name ?? ""}
                </MenuItem>
              ))}
            </Select>
          </Stack>
          {isLoading ? (
            <Stack sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center',width: '40px' }}>
              <Iconify
                icon='svg-spinners:8-dots-rotate'
                width={24}
                sx={{ color: 'white' }}
              />
            </Stack>
          ) : (
            <Stack sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px' }}>
              <Tooltip title="Reload Table">
                <IconButton
                  onClick={() => getSubmittedForms()}
                  sx={{ '&:hover': { color: 'primary.main', transform: 'rotate(180deg)', }, transition: 'transform 0.3s' }}
                >
                  <Iconify icon="ion:reload-sharp" width={24}/>
                </IconButton>
            </Tooltip>
            </Stack>
          )}
          
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
              chips={formNameChip}
              handleRemoveChip={(value) => handleRemoveChip(value, "form_names")}
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
              chips={labelChip}
              handleRemoveChip={(value) => {
                const target = "labels";
                return handleRemoveChip(value, target);
              }}
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
                editLabel="Edit submitted forms labels"
                labelIcon={
                  <Tooltip title="Assign label">
                    <Iconify
                      icon="mynaui:label"
                      sx={{
                        color: "text.disabled",
                        "&:hover": { color: "primary.main" },
                      }}
                    />
                  </Tooltip>
                }
                options={labelList}
                onChange={handleSelectedLabelsChange}
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
              <Typography sx={{ whiteSpace: "nowrap" }}>
                Selected <strong>{selected?.length}</strong> of{" "}
                <strong>{count}</strong>
              </Typography>
            )}
            {selectAll ? (
              <Button onClick={() => onDeselectAll()}>
                <Typography sx={{ whiteSpace: "nowrap" }}>
                  Clear Selection
                </Typography>
              </Button>
            ) : (
              <Button onClick={() => onSelectAll()}>
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
                  cellCount={tableColumn?.filter((item) => item.enabled)?.length + 1 ??0}
                  rowCount={rowsPerPage > 15 ? 15 : 10}
                />
              ) : (
                tableData?.map((form, index) => {
                  const isSelected = selected.includes(form?.id);
                  return (
                    <TableRow 
                      hover 
                      key={index}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          sx={{ p: 0 }}
                          checked={isSelected}
                          onChange={(event) => {
                            event.stopPropagation();
                            if (event.target.checked) {
                              onSelectOne(form?.id);
                            } else {
                              onDeselectOne(form?.id);
                            }
                          }}
                          value={isSelected}
                        />
                      </TableCell>
                      {tableColumn
                        ?.filter((item) => item.enabled)
                        ?.map((column, index) => (
                          <TableCell
                            sx={{ whiteSpace: "nowrap", cursor: 'pointer' }}
                            onClick={() => handleRowClick(form)}
                            key={form.id + index}
                          >
                            {column?.render
                              ? column?.render(form)
                              : form[column?.id]}
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
        <Divider />
        <Stack sx={{  flexDirection: { md: 'row', xs: 'column' }, gap: 0, justifyContent: 'flex-end', alignItems: { md: 'center', xs: 'start' } }}>
          <PageNumberSelect 
            currentPage={page} 
            totalPage={count? Math.ceil(count/rowsPerPage) : 0}
            onUpdate={onPageChange}
          />
          <TablePagination
            component="div"
            labelRowsPerPage='Per page'
            count={count}
            onPageChange={(event, index)=> onPageChange(index)}
            onRowsPerPageChange={onRowsPerPageChange}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
          />
        </Stack>
      </Box>

      <FilterModal
        variant="submitted-forms"
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
      <FormInfoDrawer
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        form={selectedForm}
      />
    </>
  );
};
