import { useState, useEffect, useMemo, useRef } from "react";
import * as yup from "yup";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { toast } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { v4 as uuid4 } from "uuid";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import LoadingButton from "@mui/lab/LoadingButton";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import CustomModal from "src/components/customize/custom-modal";
import { Iconify } from "src/components/iconify";
import { CustomerFieldUpdate } from "../sections/dashboard/customer/customer-field-update";
import { DeleteModal } from "./customize/delete-modal";
import { Scrollbar } from "src/components/scrollbar";
import { customerFieldsApi } from "../api/customer-fields";
import { reorder } from "src/utils/function";
import { statusApi } from "src/api/lead-management/status";
import { useAuth } from "src/hooks/use-auth";
import { useDebounce } from "src/hooks/use-debounce";

const validationSchema = yup.object({
  name: yup.string().required("Name is a required field"),
});

export const defaultQuickIconRule = {
  trader: true,
  dashboard: true,
  info: true,
  reminder: true,
  label: true,
  phone: true,
  note: true,
  field: true,
  chat: true,
  comment: true,
  sms: true,
  email: true,
  summary: true,
  status_history: true,
  chat_with_ai: true,
  add_task: true,
  add_ticket: true,
  assign_form: true,
  assign_announcement: true,
} 

const quickActionTable = [
  {
    key: "trader",
    label: "Trader",
  },
  {
    key: "dashboard",
    label: "Dashboard",
  },
  {
    key: "info",
    label: "Info",
  },
  {
    key: "reminder",
    label: "Reminder",
  },
  {
    key: "phone",
    label: "Phone",
  },
  {
    key: "label",
    label: "Agent Label",
  },
  {
    key: "field",
    label: "Custom Field",
  },
  {
    key: "chat",
    label: "Open Chat",
  },
  {
    key: "chat_with_ai",
    label: "Chat with AI",
  },
  {
    key: "note",
    label: "Note",
  },
  {
    key: "sms",
    label: "SMS",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "comment",
    label: "Comment",
  },
  {
    key: "add_task",
    label: "Create Task",
  },
  {
    key: "add_ticket",
    label: "Add ticket",
  },
  {
    key: "summary",
    label: "Call Summary",
  },
  {
    key: "status_history",
    label: "Status History",
  },
  {
    key: "assign_form",
    label: "Assign Form",
  },
  {
    key: "assign_announcement",
    label: "Assign Announcement",
  },
];

export const IconVisibility = ({
  openIconSetting,
  setOpenIconSetting,
  fieldToEdit,
  updateIconSetting,
  loading = false,
  isDetail = false,
}) => {
  const [iconSetting, setIconSetting] = useState(fieldToEdit);
  const handleSwitch = (target, value) => {
    setIconSetting((prev) => ({ ...prev, [target]: value }));
  };

  const handleUpdate = () => {
    updateIconSetting(iconSetting);
  };

  useEffect(() => {
    setIconSetting(fieldToEdit?.subEnabled);
  }, [fieldToEdit]);

  return (
    <CustomModal
      onClose={() => {
        setOpenIconSetting(false);
      }}
      open={openIconSetting}
    >
      <Stack direction="row" justifyContent="center" pb={3}>
        <Typography sx={{ fontSize: 20, fontWeight: "600" }}>
          Quick Action Visibility
        </Typography>
      </Stack>
      <Scrollbar sx={{ maxHeight: "420px", pl: 0, pr: 1, overflowX: "hidden" }}>
        <Table>
          <TableHead sx={{ position: "sticky", top: 0 }}>
            <TableCell sx={{ width: 220 }}>Icon</TableCell>
            <TableCell>Enabled</TableCell>
          </TableHead>
          <TableBody>
            {iconSetting
              ? (isDetail ? quickActionTable : quickActionTable?.slice(2))?.map(
                  (item) => (
                    <TableRow key={item.key}>
                      <TableCell>{item?.label}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={
                            iconSetting?.[item.key] ||
                            iconSetting?.[item.key] == undefined
                              ? true
                              : false
                          }
                          onChange={(event) =>
                            handleSwitch(item.key, event?.target?.checked)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  )
                )
              : null}
          </TableBody>
        </Table>
      </Scrollbar>
      <Stack direction="row" pt={2} justifyContent="end">
        <LoadingButton
          variant="contained"
          size="medium"
          onClick={() => handleUpdate()}
          loading={loading}
          disabled={loading}
        >
          Update
        </LoadingButton>
      </Stack>
    </CustomModal>
  );
};

export const TableModal = ({
  open,
  onClose,
  tableColumn = [],
  defaultColumn = [],
  updateRule,
  variant,
  sorting = null,
  pinnedFields = [],
  onPinnedFieldsSet = () => {},
  isPlatform = false,
  isTrader = false,
  syncCustomerFieldsDerived = () => {},
  onInitCustomFields = () => {},
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm({ resolver: yupResolver(validationSchema) });
  const { user } = useAuth();

  const [columnList, setColumnList] = useState([]);
  const prevTableColumn = useRef();

  const [createFieldModalOpen, setCreateFieldModalOpen] = useState(false);
  const [fieldType, setFieldType] = useState(1);
  const [fieldOptions, setFieldOptions] = useState([
    {
      id: uuid4(),
      option: "",
    },
  ]);
  const [customFields, setCustomFields] = useState([]);

  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openIconSetting, setOpenIconSetting] = useState(false);
  const [selectedCustomField, setSelectedCustomField] = useState(null);
  const [selectedSetting, setSelectedSetting] = useState("");
  const [fieldToEdit, setFieldToEdit] = useState(null);

  const [search, setSearch] = useState("");
  const query = useDebounce(search, 300);

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [sortingState, setSortingState] = useState({});

  const addMissingOrders = (list) => {
    const existingOrders = new Set(list?.map((item) => item.order));
    let nextOrder = 0;
    return list?.map((item) => {
      if (item?.order === undefined) {
        while (existingOrders.has(nextOrder)) {
          nextOrder++;
        }
        item.order = nextOrder;
      }
      return item;
    });
  };

  useEffect(() => {
    if (
      JSON.stringify(prevTableColumn.current) !== JSON.stringify(tableColumn)
    ) {
      setColumnList(
        addMissingOrders(tableColumn)?.sort((a, b) => a.order - b.order)
      );
      prevTableColumn.current = addMissingOrders(tableColumn)?.sort(
        (a, b) => a.order - b.order
      );
    }
  }, [tableColumn]);

  useEffect(() => {
    if (sorting) setSortingState(sorting);
  }, [sorting]);

  const getItemStyle = ({ theme, isDragging }) => {
    const table = document.querySelector(".signature-table");
    const tableHeader = table?.querySelector("thead");
    const tableBody = table?.querySelector("tbody");
    const theads = tableHeader?.querySelectorAll("th");
    const tr = tableBody?.querySelector("tr");
    const trStyle = {};
    theads?.forEach((th, index) => {
      trStyle[`& td:nth-of-type(${index + 1})`] = {
        width: th.clientWidth ? `${th.clientWidth}px` : "auto",
      };
    });
    if (isDragging)
      table?.style.setProperty("margin-bottom", `${tr?.clientHeight}px`);
    else table?.style.removeProperty("margin-bottom");
    return {
      ...(isDragging
        ? {
            borderRadius: `${theme.shape.borderRadius}px`,
            background: theme.palette.background.paper,
            ...trStyle,
          }
        : {}),
    };
  };
  const getCustomFields = async () => {
    try {
      if (variant === "customer") {
        const { client_fields } = await customerFieldsApi.getCustomerFields();
        setCustomFields(client_fields);
      } else if (variant === "lead") {
        const { lead_fields } = await statusApi.getLeadCustomFields();
        setCustomFields(lead_fields);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getCustomFields();
    setValue("sync_lead", false);
  }, [open]);

  const handleSwitch = (label, value) => {
    const newTableData = [
      ...columnList.map((item) => {
        if (item.label === label) {
          return {
            ...item,
            enabled: value,
          };
        } else {
          return item;
        }
      }),
    ];
    setColumnList(newTableData);
  };

  const handleUpdateSetting = (label, value) => {
    const newTableData = [
      ...columnList.map((item) => {
        if (item.label === label) {
          return {
            ...item,
            subEnabled: value,
          };
        } else {
          return item;
        }
      }),
    ];
    setColumnList(newTableData);
    setOpenIconSetting(false);
  };

  const handleChangeFieldType = (e) => setFieldType(e?.target?.value);

  const setDefault = () => {
    setColumnList(defaultColumn);
    setSortingState({});
  };

  const handleResetSorting = () => {
    setSortingState({});

    const rule = columnList?.map((item, index) =>
      item?.id === "call_chat"
        ? {
            id: item?.id,
            enabled: item?.enabled,
            order: index,
            subEnabled: item?.subEnabled,
          }
        : {
            id: item?.id,
            enabled: item?.enabled,
            order: index,
          }
    );
    updateRule(rule, {}, pinnedFields, "");
    onClose();
  };

  const handleUpdateRule = (type = "") => {
    const rule = columnList?.map((item, index) =>
      item?.id === "call_chat"
        ? {
            id: item?.id,
            label: item?.label,
            enabled: item?.enabled,
            order: index,
            subEnabled: item?.subEnabled,
          }
        : {
            id: item?.id,
            enabled: item?.enabled,
            label: item?.label,
            order: index,
          }
    );
    updateRule(rule, sortingState, pinnedFields, type);
    onClose();
  };

  const containsOnlyLettersAndSpaces = (inputString) => {
    // Define a regular expression pattern that allows only letters and spaces
    var pattern = /^[a-zA-Z0-9\s]+$/;

    // Test the input string against the pattern
    return pattern.test(inputString);
  };

  const onCustomerFieldSubmit = async (data) => {
    try {
      setIsLoading(true);
      const fieldTypeValue = {
        1: "text",
        2: "number",
        3: "multi_choice",
        4: "boolean",
      };

      if (!containsOnlyLettersAndSpaces(data?.name)) {
        toast.error("Field name should not contain symbols!");
        setIsLoading(false);
        return;
      }

      const request = {
        value: data.name.replace(/\s+/g, "_"),
        friendly_name: data.name,
        field_type:
          fieldType === 3
            ? data?.multi_choice_radio
              ? "multi_choice"
              : "multi_choice_radio"
            : fieldTypeValue[fieldType],
      };
      request.sync_lead = data.sync_lead;
      if (fieldType === 3) {
        request["setting"] = JSON.stringify(fieldOptions);
      }

      if (variant === "customer") {
        const { client_field } = await customerFieldsApi.createCustomerField(
          request
        );
        setColumnList((prev) => [
          ...prev,
          ...[
            {
              ...client_field,
              label: client_field?.friendly_name,
              id: client_field?.value,
              enabled: true,
              custom_id: client_field?.id,
              custom: true,
              render: (row) => row?.client_fields[client_field?.id],
            },
          ],
        ]);
        const newFilter = {
          ...client_field,
          label: client_field?.friendly_name,
          enabled: true,
          custom_id: client_field?.id,
          custom: true,
        };

        toast.success("Customer field successfully created!");
        setCreateFieldModalOpen(false);
        reset();
        setFieldType(1);
        setFieldOptions([
          {
            id: uuid4(),
            option: "",
          },
        ]);
        syncCustomerFieldsDerived("create", {
          ...newFilter,
        });
        setTimeout(() => {
          getCustomFields();
        }, 1000);
      }

      if (variant === "lead") {
        const { lead_field } = await statusApi.createLeadCustomField(request);
        setColumnList((prev) => [
          ...prev,
          ...[
            {
              ...lead_field,
              label: lead_field?.friendly_name,
              id: lead_field?.value,
              enabled: true,
              custom_id: lead_field?.id,
              custom: true,
              render: (row) => row?.lead_fields[lead_field?.id],
            },
          ],
        ]);
        toast.success("Customer field successfully created!");
        reset();
        setCreateFieldModalOpen(false);
        setTimeout(() => {
          getCustomFields();
        }, 1000);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleAddOption = () =>
    setFieldOptions((prev) => [...prev, ...[{ option: "", id: uuid4() }]]);

  const handleChangeField = (e, id, type = "option") => {
    e.preventDefault();

    if (type === "option") {
      // Only allow letters, numbers and spaces
      const value = e?.target?.value.replace(/[^a-zA-Z0-9\s]/g, "");
      setFieldOptions(
        fieldOptions.map((option) => {
          if (id === option?.id) {
            return {
              ...option,
              option: value,
            };
          } else {
            return option;
          }
        })
      );
    } else {
      setFieldOptions(
        fieldOptions.map((option) => {
          if (id === option?.id) {
            return {
              ...option,
              color: e?.target?.value,
            };
          } else {
            return option;
          }
        })
      );
    }
  };

  const handleRemoveField = async () => {
    setIsDeleteLoading(true);
    try {
      if (variant === "customer") {
        await customerFieldsApi.deleteCustomerField(selectedCustomField);
      }
      if (variant === "lead") {
        await statusApi.deleteLeadCustomField(selectedCustomField);
      }
      setColumnList((prev) =>
        prev?.filter((item) => item?.custom_id !== selectedCustomField)
      );
      syncCustomerFieldsDerived("delete", {
        custom_id: selectedCustomField,
      });
      setSelectedCustomField(null);
      setOpenDelete(false);
      toast.success("Custom field successfully deleted!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setIsDeleteLoading(false);
  };

  useEffect(() => {
    reset();
    setFieldOptions([
      {
        id: uuid4(),
        option: "",
      },
    ]);
    setFieldType(1);
  }, [createFieldModalOpen]);

  const renderSortingIcon = (variant, label, custom = false) => {
    if (variant === true) {
      return (
        <Tooltip title="Ascending">
          <IconButton
            onClick={() => handleSortingChange(label, false, custom)}
            sx={{ "&:hover": { color: "primary.dark" } }}
          >
            <Iconify
              icon="ph:arrow-circle-up"
              width={28}
              color="primary.main"
            />
          </IconButton>
        </Tooltip>
      );
    } else if (variant === false) {
      return (
        <Tooltip title="Descending">
          <IconButton
            onClick={() => handleSortingChange(label, undefined, custom)}
            sx={{ "&:hover": { color: "primary.dark" } }}
          >
            <Iconify
              icon="ph:arrow-circle-down"
              width={28}
              color="primary.main"
            />
          </IconButton>
        </Tooltip>
      );
    } else if (variant === undefined) {
      return (
        <Tooltip title="Disabled">
          <IconButton
            onClick={() => handleSortingChange(label, true, custom)}
            sx={{
              "&:hover": { color: "primary.main" },
              color: "text.disabled",
            }}
          >
            <Iconify icon="solar:round-sort-vertical-linear" width={28} />
          </IconButton>
        </Tooltip>
      );
    }
  };

  const handleSortingChange = (column, variant, custom) => {
    setSortingState((prev) => ({
      ...prev,
      [custom ? "c_" + column : column]: variant,
    }));
  };

  const handleItemPin = (id, pinned) => {
    if (pinned) {
      onPinnedFieldsSet((prev) => prev?.filter((item) => item !== id));
    } else {
      onPinnedFieldsSet([...pinnedFields, id]);
    }
  };

  const handleMoveToTop = (index) => {
    // Get the item from the filtered list
    const filteredItem = filteredColumnList[index];
    
    // Find the actual index in the original columnList
    const originalIndex = columnList.findIndex(item => 
      item.id === filteredItem.id && item.label === filteredItem.label
    );
    
    if (originalIndex === -1) return; // Item not found in original list
    
    const newTableData = [...columnList];
    const itemToMove = newTableData[originalIndex];
    newTableData.splice(originalIndex, 1);
    newTableData.unshift(itemToMove);

    // Update order values
    newTableData.forEach((item, idx) => {
      item.order = idx;
    });

    setColumnList(newTableData);
  };

  const filteredColumnList = useMemo(() => {
    if (query) {
      return columnList
        ?.filter((item) =>
          item?.label?.toLowerCase()?.includes(query?.toLowerCase())
        )
        ?.map((item) => {
          const accessEditKey = `acc_custom_e_${item?.id}`;
          const editAccess =
            user?.acc &&
            (user?.acc[accessEditKey] === undefined ||
              user?.acc[accessEditKey]);
          return {
            ...item,
            subEnabled:
              item?.id == "call_chat"
                ? item?.subEnabled ?? defaultQuickIconRule
                : undefined,
            sorting:
              sortingState[item?.custom ? "c_" + item?.label : item?.label],
            pinned: pinnedFields.includes(item?.custom_id),
            editAccess,
          };
        });
    } else {
      return columnList?.map((item) => {
        const accessEditKey = `acc_custom_e_${item?.id}`;
        const editAccess =
          user?.acc &&
          (user?.acc[accessEditKey] === undefined || user?.acc[accessEditKey]);
        return {
          ...item,
          subEnabled:
            item?.id == "call_chat"
              ? item?.subEnabled ?? defaultQuickIconRule
              : undefined,
          sorting:
            sortingState[item?.custom ? "c_" + item?.label : item?.label],
          pinned: pinnedFields.includes(item?.custom_id),
          editAccess,
        };
      });
    }
  }, [query, columnList, user, sortingState, pinnedFields]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newTableData = reorder(
      filteredColumnList,
      result.source.index,
      result.destination.index
    );
    setColumnList(newTableData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Stack mt={2} py={3} direction="row" justifyContent="center">
        <Typography variant="h5">Table Column Setting</Typography>
      </Stack>
      <Container maxWidth="sm">
        <Stack direction="column" spacing={2}>
          <TextField
            fullWidth
            sx={{ pt: "5px" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="lucide:search" width={22} color="text.secondary" />
                </InputAdornment>
              ),
            }}
            hiddenLabel
            onChange={(e) => setSearch(e?.target?.value)}
            placeholder="Search columns..."
            value={search}
          />
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant="text"
              size="small"
              sx={{
                px: 1,
                py: 0
              }}
              onClick={() => {
                setColumnList(filteredColumnList?.map((item) => ({
                  ...item,
                  enabled: true
                })));
              }}
            >
              Select All
            </Button>
            <Button
              variant="text" 
              size="small"
              sx={{
                px: 1,
                py: 0
              }}
              onClick={() => {
                setColumnList(filteredColumnList?.map((item) => ({
                  ...item,
                  enabled: false
                })));
              }}
            >
              Deselect All
            </Button>
          </Stack>
          <Scrollbar sx={{ maxHeight: "420px", px: 0, overflowX: "hidden" }}>
            <Table sx={{ position: "relative" }} className="signature-table">
              <TableHead sx={{ position: "sticky", top: 0 }}>
                <TableCell>Name</TableCell>
                <TableCell>Enabled</TableCell>
                <TableCell sx={{ width: 136 }}>Actions</TableCell>
                {variant === "customer" && (!isPlatform || !isTrader) && (
                  <TableCell sx={{ width: 70, pl: 0 }}>Sort</TableCell>
                )}
                {variant === "customer" && (
                  <TableCell sx={{ pl: 0 }}>Pin</TableCell>
                )}
              </TableHead>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {({ innerRef }) => (
                    <Box component={TableBody} ref={innerRef}>
                      {filteredColumnList?.map((row, index) => (
                        <Draggable
                          key={`signature-row-${index}`}
                          draggableId={`signature-row-${index}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Box
                              component={TableRow}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={(theme) => ({
                                ...getItemStyle({
                                  theme,
                                  isDragging: snapshot.isDragging,
                                })
                              })}
                            >
                              <TableCell sx={{ width: 350, height: 76 }}>
                                <Stack direction="row" gap={1}>
                                  <DragIndicatorIcon />
                                  <Typography>{row.label}</Typography>
                                </Stack>
                              </TableCell>
                              <TableCell>
                                <Checkbox
                                  checked={row.enabled}
                                  onChange={(event) =>
                                    handleSwitch(
                                      row.label,
                                      event.target.checked
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <Stack direction="row" spacing={1}>
                                  <Tooltip title="Move to Top">
                                    <IconButton
                                      onClick={() => handleMoveToTop(index)}
                                      sx={{
                                        "&:hover": {
                                          color: "primary.main",
                                        },
                                        color: "text.disabled",
                                      }}
                                    >
                                      <Iconify
                                        icon="solar:square-arrow-up-linear"
                                        width={26}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                  {row?.subSetting ? (
                                    <Tooltip title="Edit Call & Chat Visibility">
                                      <IconButton
                                        onClick={() => {
                                          setFieldToEdit(row);
                                          setOpenIconSetting(true);
                                        }}
                                        sx={{
                                          "&:hover": { color: "primary.main" },
                                          color: "text.disabled",
                                        }}
                                      >
                                        <Iconify
                                          icon="carbon:settings-adjust"
                                          width={28}
                                        />
                                      </IconButton>
                                    </Tooltip>
                                  ) : null}
                                  {(row?.custom &&
                                    variant === "lead" &&
                                    !user?.affiliate) ||
                                  (row?.custom &&
                                    user?.acc?.acc_e_client_data &&
                                    row?.editAccess) ? (
                                    <>
                                      <IconButton
                                        onClick={() => {
                                          setSelectedCustomField(
                                            row?.custom_id
                                          );
                                          setSelectedSetting(row?.setting);
                                          setFieldToEdit(row);
                                          setOpenEdit(true);
                                        }}
                                        sx={{
                                          "&:hover": { color: "primary.main" },
                                        }}
                                      >
                                        <Tooltip title="Edit Custom Field">
                                          <Iconify
                                            icon="mage:edit"
                                            width={28}
                                          />
                                        </Tooltip>
                                      </IconButton>
                                      <IconButton
                                        onClick={() => {
                                          setSelectedCustomField(
                                            row?.custom_id
                                          );
                                          setOpenDelete(true);
                                        }}
                                        sx={{
                                          "&:hover": { color: "error.main" },
                                        }}
                                      >
                                        <Tooltip title="Delete Label">
                                          <Iconify
                                            icon="clarity:trash-line"
                                            width={28}
                                          />
                                        </Tooltip>
                                      </IconButton>
                                    </>
                                  ) : null}
                                </Stack>
                              </TableCell>
                              {variant === "customer" &&
                                (!isPlatform || !isTrader) && (
                                  <TableCell sx={{ pl: 0 }}>
                                    {row?.hasSort === false ? null : (
                                      <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={1}
                                      >
                                        {renderSortingIcon(
                                          row?.sorting,
                                          row?.label,
                                          row?.custom
                                        )}
                                      </Stack>
                                    )}
                                  </TableCell>
                                )}
                              {variant === "customer" && (
                                <TableCell sx={{ pl: 0 }}>
                                  {row?.custom ? (
                                    <Tooltip title="Pin">
                                      <IconButton
                                        onClick={() =>
                                          handleItemPin(
                                            row?.custom_id,
                                            row?.pinned
                                          )
                                        }
                                        sx={{
                                          "&:hover": {
                                            color: row?.pinned
                                              ? "primary.dark"
                                              : "primary.main",
                                          },
                                          color: row?.pinned
                                            ? "primary.main"
                                            : "text.disabled",
                                        }}
                                      >
                                        <Iconify
                                          icon={
                                            row?.pinned
                                              ? "clarity:pin-solid"
                                              : "clarity:pin-line"
                                          }
                                          width={28}
                                        />
                                      </IconButton>
                                    </Tooltip>
                                  ) : null}
                                </TableCell>
                              )}
                            </Box>
                          )}
                        </Draggable>
                      ))}
                    </Box>
                  )}
                </Droppable>
              </DragDropContext>
            </Table>
          </Scrollbar>
        </Stack>
        <Divider />
      </Container>
      <Stack direction="row" alignItems={'center'} justifyContent="end" px={5} py={3} gap={2}>
        {isPlatform ? (
          <Stack direction="row" justifyContent="end" gap={2}>
            <Button
              variant="outlined"
              onClick={() => handleUpdateRule("default")}
            >
              Save for new users
            </Button>
            <Button
              onClick={() => handleUpdateRule("existing")}
              variant="contained"
            >
              Apply for existing users
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" justifyContent="end" gap={2}>
            {variant === "customer" && (
              <Button variant="outlined" onClick={handleResetSorting}>
                Reset Sorting
              </Button>
            )}
            <Button variant="outlined" onClick={setDefault}>
              Default
            </Button>
            {variant && !user?.affiliate && (
              <Button
                variant="outlined"
                onClick={() => setCreateFieldModalOpen(true)}
              >
                Create field
              </Button>
            )}
            <Button onClick={handleUpdateRule} variant="contained">
              Update
            </Button>
          </Stack>
        )}
      </Stack>

      <IconVisibility
        openIconSetting={openIconSetting}
        setOpenIconSetting={setOpenIconSetting}
        fieldToEdit={fieldToEdit}
        updateIconSetting={(val) => {
          handleUpdateSetting(fieldToEdit.label, val);
        }}
      />

      <CustomModal
        onClose={() => {
          setCreateFieldModalOpen(false);
          reset();
        }}
        open={createFieldModalOpen}
      >
        <form onSubmit={handleSubmit(onCustomerFieldSubmit)}>
          <Stack spacing={2}>
            <Typography
              id="modal-modal-title"
              align="center"
              sx={{ fontSize: 22, fontWeight: "bold", mt: 1 }}
            >
              Create Custom Field
            </Typography>
            <Stack direction="column">
              <Stack sx={{ pb: 2 }} spacing={1} justifyContent="center">
                <Typography>Name</Typography>
                <TextField
                  fullWidth
                  autoFocus
                  error={!!errors?.name?.message}
                  helperText={errors?.name?.message}
                  label="Name"
                  name="name"
                  type="text"
                  {...register("name")}
                />
              </Stack>
              <Controller
                name="sync_lead"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormControlLabel
                    sx={{ userSelect: "none" }}
                    control={
                      <Checkbox
                        checked={value}
                        onChange={(event) => onChange(event?.target?.checked)}
                      />
                    }
                    label="Sync with upcoming lead"
                  />
                )}
              />
              {fieldType === 3 ? (
                <Controller
                  name="multi_choice_radio"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                      sx={{ userSelect: "none" }}
                      control={
                        <Checkbox
                          checked={value}
                          onChange={(event) => onChange(event?.target?.checked)}
                        />
                      }
                      label="Multi-choice dropdown"
                    />
                  )}
                />
              ) : null}
            </Stack>
            <Stack sx={{ pb: 2 }} spacing={1} justifyContent="center">
              <Typography>Type</Typography>
              <Select
                value={fieldType}
                onChange={handleChangeFieldType}
                sx={{ width: "100%" }}
              >
                <MenuItem value={1}>Text</MenuItem>
                <MenuItem value={2}>Number</MenuItem>
                <MenuItem value={3}>Dropdown</MenuItem>
                <MenuItem value={4}>Switch</MenuItem>
              </Select>
            </Stack>
            {fieldType === 3 && (
              <Stack spacing={2}>
                <Typography variant={"h6"}>Create options:</Typography>
                <Scrollbar sx={{ maxHeight: "175px" }}>
                  <Stack spacing={1}>
                    {fieldOptions?.map((option, index) => (
                      <Stack direction="row" spacing={1} key={option?.id}>
                        <OutlinedInput
                          value={option.option}
                          placeholder={`Option ${index + 1}`}
                          onChange={(e) => handleChangeField(e, option?.id)}
                          sx={{ width: "100%" }}
                        />
                        <Stack direction="row" alignItems="center" gap={1}>
                          <label htmlFor={option.id}>
                            <Chip
                              label={option?.color ?? "Default"}
                              color="primary"
                              sx={{ backgroundColor: option?.color ?? "" }}
                            />
                          </label>
                          <input
                            style={{
                              visibility: "hidden",
                              width: "0px",
                              height: "0px",
                            }}
                            id={option.id}
                            type="color"
                            onChange={(e) =>
                              handleChangeField(e, option?.id, "color")
                            }
                          />
                        </Stack>
                        {index !== 0 && (
                          <IconButton
                            onClick={() =>
                              setFieldOptions(
                                fieldOptions?.filter(
                                  (opt) => opt?.id !== option?.id
                                )
                              )
                            }
                          >
                            <Iconify
                              icon="gravity-ui:xmark"
                              width={28}
                              height={28}
                            />
                          </IconButton>
                        )}
                      </Stack>
                    ))}
                  </Stack>
                </Scrollbar>
                <Button variant={"contained"} onClick={handleAddOption}>
                  + Add
                </Button>
              </Stack>
            )}
            <Stack sx={{ gap: 2 }} direction="row" justifyContent="center">
              <LoadingButton
                variant="contained"
                type="submit"
                loading={isLoading}
              >
                Create
              </LoadingButton>
              <Button
                variant="outlined"
                onClick={() => {
                  setCreateFieldModalOpen(false);
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </CustomModal>

      <DeleteModal
        isLoading={isDeleteLoading}
        isOpen={openDelete}
        setIsOpen={setOpenDelete}
        title="Are you sure you want to delete this custom field?"
        onDelete={handleRemoveField}
      />

      {!!fieldToEdit && (
        <CustomerFieldUpdate
          fields={customFields}
          field={fieldToEdit}
          open={openEdit}
          fieldId={selectedCustomField}
          fieldSetting={selectedSetting}
          variant={variant}
          onClose={() => {
            setOpenEdit(false);
            setFieldToEdit(null);
          }}
          onSetList={setColumnList}
          onUpdateRule={handleUpdateRule}
          onGetFields={getCustomFields}
          getCustomFieldsDerived={syncCustomerFieldsDerived}
          onInitCustomFields={onInitCustomFields}
        />
      )}
    </Dialog>
  );
};
