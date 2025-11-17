import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import { Scrollbar } from "src/components/scrollbar";
import { reorder } from "src/utils/function";
import { useAuth } from "src/hooks/use-auth";
import { userApi } from "src/api/user";
import toast from "react-hot-toast";

export const baseCustomerDetailTabs = [
  { id: "details", label: "Details", enabled: true },
  { id: "analytics", label: "Analytics", enabled: true },
  { id: "calls", label: "Calls", enabled: true }, 
  { id: "bets", label: "Bets", enabled: true },
  { id: "ib_room", label: "IB Portal", enabled: true },
  { id: "note", label: "Note", enabled: true },
  { id: "comments", label: "Comments", enabled: true },
  { id: "positions", label: "Positions", enabled: true },
  { id: "transactions", label: "Transactions", enabled: true },
  { id: "trade_settings", label: "Trader Settings", enabled: true },
  { id: "psp_links", label: "PSP Links", enabled: false },
  { id: "wallet", label: "Wallet", enabled: true },
  { id: "transfer", label: "Transfer", enabled: true },
  { id: "posts", label: "Posts", enabled: true },
  { id: "kyc", label: "KYC", enabled: true },
  { id: "logs", label: "Logs", enabled: true },
  { id: "ico", label: "ICO", enabled: true },
  { id: "saving_accounts", label: "Saving Accounts", enabled: true },
  { id: "forms", label: "Forms", enabled: true },
  { id: "announcements", label: "Announcements", enabled: true },
  { id: "security_report", label: "Security Report", enabled: true },
  { id: "lead_source", label: "Lead Source", enabled: true },
];

export const CustomerOrderTabs = ({
  open,
  onClose,
  updateRule,
}) => {
  const { user, refreshUser, company } = useAuth();

  const [columnList, setColumList] = useState([]);

  useEffect(() => {
    const columnSetting = user?.column_setting ? JSON.parse(user.column_setting) : null;

    if (columnSetting?.customerOrderTabs) {
      let filteredColumns = columnSetting.customerOrderTabs;
      let baseFilteredColumns = baseCustomerDetailTabs;

      if(company?.company_type === 1) {
        filteredColumns = filteredColumns.filter(item => !["Bets", "Analytics"].includes(item.label));
        baseFilteredColumns = baseFilteredColumns.filter(item => !["Bets", "Analytics"].includes(item.label));
      }

      if(filteredColumns.length !== baseFilteredColumns.length) {
        filteredColumns = baseFilteredColumns;
      }
      setColumList(filteredColumns);
    } else {
      let filteredDefaultColumns = baseCustomerDetailTabs;
      if (company?.company_type === 1) {
        filteredDefaultColumns = filteredDefaultColumns.filter(item => !["Bets", "Analytics"].includes(item.label));
      }
      setColumList(filteredDefaultColumns);
    }

  }, [user, company]);

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
    setColumList(newTableData);
  };

  const setDefault = () => {
    let filteredDefaultColumns = baseCustomerDetailTabs;
    if (company?.company_type === 1) {
      filteredDefaultColumns = filteredDefaultColumns.filter(item => item.label !== "Bets");
    }
    setColumList(filteredDefaultColumns);
  };

  const handleUpdateRule = async () => {
    const columnSetting = user?.column_setting ? JSON.parse(user.column_setting) : {};
    const rule = columnList?.map((item, index) => ({
        id: item?.id,
        enabled: item?.enabled,
        label: item?.label,
        order: index,
      })
    );
    const updateSetting = {
      ...columnSetting,
      customerOrderTabs: rule,
    };
    await userApi.updateUser(user?.id, {
      column_setting: JSON.stringify(updateSetting),
    });
    updateRule(rule);
    refreshUser();
    toast.success("Customer tabs order successfully updated!");
    onClose();
  };

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
    <Dialog open={open} onClose={onClose} fullWidth>
      <Stack mt={2} py={3} direction="row" justifyContent="center">
        <Typography variant="h5">Tabs Order</Typography>
      </Stack>
      <Scrollbar sx={{ maxHeight: "500px" }}>
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
      <Stack direction="row" justifyContent="end" px={5} py={3} gap={2}>
        <Button variant="outlined" onClick={setDefault}>
          Default
        </Button>
        <Button onClick={handleUpdateRule} variant="contained">
          Update
        </Button>
      </Stack>
    </Dialog>
  );
};
