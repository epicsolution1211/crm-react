import { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import toast from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import LoadingButton from '@mui/lab/LoadingButton';

import { Scrollbar } from "src/components/scrollbar";
import { reorder } from "src/utils/function";
import { useAuth } from "src/hooks/use-auth";
import { userApi } from "src/api/user";
import { IconVisibility } from "src/components/table-settings-modal";
import { defaultQuickIconRule } from "src/components/table-settings-modal";

export const defaultColumn = [
  { id: "user_id", label: "User ID", order: 0, enabled: true },
  { id: "local_time", label: "Local Time", order: 1, enabled: true },
  { id: "last_ip", label: "Last IP", order: 2, enabled: true },
  { id: "created_at", label: "Created At", order: 3, enabled: true },
  { id: "total_deposit", label: "Total Deposit", order: 4, enabled: false },
  { id: "net_deposit", label: "Net Deposit", order: 4, enabled: false },
  { id: "balance", label: "Balance", order: 5, enabled: false },
  { id: "full_name", label: "Full Name", order: 6, enabled: false },
  { id: "email", label: "Email", order: 7, enabled: false },
  { id: "phone_number", label: "Phone Number", order: 8, enabled: false },
  { id: "last_online", label: "Last Online", order: 9, enabled: false },
  { id: "status", label: "Status", order: 10, enabled: false },
  { id: "affiliate", label: "Affiliate", order: 11, enabled: false },
  { id: "total_withdrawal", label: "Total Withdrawal", order: 12, enabled: false },
];

export const CustomerInfoModal = ({
  open,
  onClose,
  updateRule,
}) => {
  const { user, refreshUser } = useAuth();

  const [isUpdating, setIsUpdating] = useState(false);
  const [isQuickLoading, setIsQuickLoading] = useState(false);
  const [columnList, setColumList] = useState([]);

  const [openIconSetting, setOpenIconSetting] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState(undefined);

  useEffect(() => {
    const columnSetting = user?.column_setting ? JSON.parse(user.column_setting) : null;

    if (columnSetting?.customerInfo) {
      setColumList(columnSetting.customerInfo ?? []);
    } else {
      setColumList(defaultColumn);
    }
    if (columnSetting?.customerQuickAction) {
      setFieldToEdit({ subEnabled: columnSetting.customerQuickAction })
    } else {
      setFieldToEdit({ subEnabled: defaultQuickIconRule })
    }
  }, [user]);

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

  const handleSwitch = (label, value) => {
    const newTableData = [
      ...columnList?.map((item) => {
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
    setColumList(newTableData);
  };

  const setDefault = () => {
    setColumList(defaultColumn);
  };

  const handleUpdateRule = useCallback(async () => {
    setIsUpdating(true);
    try {
      const columnSetting = user?.column_setting ? JSON.parse(user.column_setting) : {};
      const rule = columnList?.map((item, index) => ({
        id: item?.id,
        enabled: item?.enabled,
        label: item?.label,
        order: index,
      }));
  
      const updateSetting = {
        ...columnSetting,
        customerInfo: rule,
      };
  
      await userApi.updateUser(user?.id, {
        column_setting: JSON.stringify(updateSetting),
      });
  
      updateRule(rule);
      refreshUser();
      toast.success("Customer info settings updated!");
      onClose();
    } catch (error) {
      console.error("error: ", error);
    }
    setIsUpdating(false);
  }, [user, columnList, updateRule, refreshUser, onClose]);
  
  const handleUpdateQuickActionRule = useCallback(
    async (val) => {
      setIsQuickLoading(true);
      try {
        const columnSetting = user?.column_setting ? JSON.parse(user.column_setting) : {};
        const updateSetting = {
          ...columnSetting,
          customerQuickAction: val,
        };
  
        await userApi.updateUser(user?.id, {
          column_setting: JSON.stringify(updateSetting),
        });
  
        setFieldToEdit({ subEnabled: val });
        refreshUser();
        setOpenIconSetting(false);
        toast.success("Quick action settings updated!");
      } catch (error) {
        console.error("error: ", error);
      }
      setIsQuickLoading(false);
    },
    [user, refreshUser, setFieldToEdit, setOpenIconSetting]
  );
  

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newTableData = reorder(
      columnList,
      result.source.index,
      result.destination.index
    );
    setColumList(newTableData);
  };

  return (
    <>
      <Dialog PaperProps={{ sx: { maxWidth: 530 }}} open={open} onClose={onClose} fullWidth>
        <Stack mt={2} py={3} direction="row" justifyContent="center">
          <Typography variant="h5">User Info Settings</Typography>
        </Stack>
        <Scrollbar sx={{ maxHeight: "479px" }}>
          <Stack direction="column" spacing={3}>
            <Table sx={{ position: "relative" }} className="signature-table">
              <TableHead sx={{ position: "sticky", top: 0 }}>
                <TableCell>Name</TableCell>
                <TableCell>Enabled</TableCell>
              </TableHead>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {({ innerRef }) => (
                    <Box component={TableBody} ref={innerRef}>
                      {columnList?.map((row, index) => (
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
                              sx={(theme) => getItemStyle({
                                theme,
                                isDragging: snapshot.isDragging,
                              })}
                            >
                              <TableCell sx={{ width: 350 }}>
                                <Stack direction="row" gap={1}>
                                  <DragIndicatorIcon />
                                  <Typography>{row.label}</Typography>
                                </Stack>
                              </TableCell>
                              <TableCell>
                                <Checkbox
                                  checked={row.enabled}
                                  onChange={(event) => handleSwitch(
                                    row.label,
                                    event.target.checked
                                  )} />
                              </TableCell>
                            </Box>
                          )}
                        </Draggable>
                      ))}
                    </Box>
                  )}
                </Droppable>
              </DragDropContext>
            </Table>
          </Stack>
        </Scrollbar>
        <Divider />
        <Stack justifyContent='space-between' direction='row' gap={2} px={3} py={3}>
          <Button
            variant="contained" 
            onClick={() => setOpenIconSetting(true)}
            sx={{ width: 'fit-content', height: 'fit-content' }}
          >
            Action Setting
          </Button>
          <Stack direction="row" justifyContent="end" gap={2}>
            <Button variant="outlined" onClick={setDefault}>
              Default
            </Button>
            <LoadingButton 
              variant="contained" 
              type="submit" 
              sx={{ width: 80 }} 
              onClick={() => handleUpdateRule()}
              loading={isUpdating}
              disabled={isUpdating}
            >
              Update
            </LoadingButton>
          </Stack>
        </Stack>
      </Dialog>
      <IconVisibility
        openIconSetting={openIconSetting}
        setOpenIconSetting={setOpenIconSetting}
        fieldToEdit={fieldToEdit}
        updateIconSetting={(val) => {
          handleUpdateQuickActionRule(val)
        }}
        loading={isQuickLoading}
        isDetail
      />
    </>
  );
};
