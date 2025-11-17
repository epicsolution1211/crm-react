import { useState, useEffect, useMemo, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Iconify } from "src/components/iconify";
import { TableContainerStyle } from "src/utils/constants";
import { useDebounce } from "src/hooks/use-debounce";

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
      borderTop: "1px solid",
      borderBottom: "1px solid",
      borderColor: theme.palette.divider,
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

const reorderColumn = (list, startIndex, endIndex) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const TextFieldSearch = ({ tableLength, search, setSearch }) => {
  const [inputValue, setInputValue] = useState(search || "");
  const debouncedValue = useDebounce(inputValue, tableLength > 50 ? 500 : 0);

  useEffect(() => {
    if (debouncedValue !== search) {
      setSearch(debouncedValue);
    }
  }, [debouncedValue]);

  const handleChange = (e) => {
    setInputValue(e?.target?.value);
  };

  return (
    <TextField
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon="lucide:search" width={22} color="text.secondary" />
          </InputAdornment>
        ),
      }}
      type="search"
      inputProps={{ sx: { height: 24, py: 1.5 } }}
      fullWidth
      hiddenLabel
      placeholder="Enter a keyword..."
      value={inputValue}
      onChange={handleChange}
    />
  );
};

export const TableSettingsDrawer = ({
  open = false,
  onClose = () => {},
  tableColumns = [],
  defaultColumns = [],
  updateRule = () => {},
}) => {
  const [columnList, setColumnList] = useState([]);
  const [search, setSearch] = useState("");

  const filteredColumnList = useMemo(() => {
    if (search) {
      return columnList
        ?.filter((item) =>
          item?.label?.toLowerCase()?.includes(search?.toLowerCase())
        );
    } 
    return columnList;
  }, [search, columnList]);

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

  const toggleSelectAll = useCallback((value) => {
    setColumnList(filteredColumnList?.map((item) => ({
      ...item,
      enabled: value
    })));
  }, [filteredColumnList]);

  const handleUpdateRule = useCallback(() => {
    const rule = columnList?.map((item, index) => ({
      id: item?.id,
      enabled: item?.enabled,
      label: item?.label,
      order: index,
    }));
    updateRule(rule);
    onClose();
  }, [columnList, updateRule, onClose]);

  const setDefault = () => {
    setColumnList(defaultColumns);
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

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newTableData = reorderColumn(
      filteredColumnList,
      result.source.index,
      result.destination.index
    );
    setColumnList(newTableData);
  };

  useEffect(() => {
    setColumnList(tableColumns?.map((col, index)=> ({
      id: col.id,
      label: col.label,
      enabled: col.enabled,
      order: col.order ?? index,
    })) || []);
  }, [tableColumns]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 420 }},
      }}
    >
      <IconButton 
        onClick={onClose} 
        sx={{ 
          display: { xs: 'flex', md: 'flex' },
          position: 'absolute',
          right: { xs: 8, md: 14 },
          top: { xs: 8, md: 14 },
          color: 'text.primary',
          '&:hover': {
            backgroundColor: 'action.hover',
          }
        }}
      >
        <Iconify icon="mingcute:close-line" width={20} height={20} />
      </IconButton>
      <Stack sx={{ py: 1.5, flexDirection: 'column' }}>
        <Stack px={2} py={2} direction="row" alignItems="center" gap={1}>
          <Typography sx={{ fontSize: 20, fontWeight: 600 }}>Table Setting</Typography>
        </Stack>

        <Stack direction="column" gap={2} px={2}>
          <TextFieldSearch
            search={search}
            setSearch={setSearch}
            tableLength={filteredColumnList?.length} />
          <Stack direction="row" alignItems="center" sx={{ gap: 2 }}>
            <Button
              variant="text"
              size="small"
              sx={{
                px: 1,
                py: 0,
                '&:hover': {
                  backgroundColor: 'action.hover',
                  color: 'primary.main',
                }
              }}
              onClick={() => toggleSelectAll(true)}
            >
              Select All
            </Button>
            <Button
              variant="text" 
              size="small"
              sx={{
                px: 1,
                py: 0,
                '&:hover': {
                  backgroundColor: 'action.hover',
                }
              }}
              onClick={() => toggleSelectAll(false)}
            >
              Deselect All
            </Button>
          </Stack>
          <TableContainer 
            component={Paper} 
            sx={{
              height: 'calc(100vh - 256px)',
              ...TableContainerStyle,
            }}
          >
            <Table sx={{ position: "relative" }} className="signature-table">
              <TableHead sx={{ position: "sticky", top: 0 }}>
                <TableCell>Name</TableCell>
                <TableCell>Enabled</TableCell>
                <TableCell>Actions</TableCell>
              </TableHead>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {({ innerRef }) => (
                    <TableBody ref={innerRef}>
                      {filteredColumnList?.map((row, index) => (
                        <Draggable
                          key={`signature-row-${index}`}
                          draggableId={`signature-row-${index}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <TableRow
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
                              <TableCell sx={{ width: '70%' }}>
                                <Stack direction="row" gap={1}>
                                  <DragIndicatorIcon />
                                  <Typography variant="subtitle2">{row.label}</Typography>
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
                                  sx={{ p: 0, m: 0 }}
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
                                          backgroundColor: "action.hover",
                                        },
                                        color: "text.disabled",
                                      }}
                                      size="small"
                                    >
                                      <Iconify
                                        icon="solar:square-arrow-up-linear"
                                        width={24}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          )}
                        </Draggable>
                      ))}
                    </TableBody>
                  )}
                </Droppable>
              </DragDropContext>
            </Table>
          </TableContainer>
        </Stack>

        <Stack 
          sx={{ 
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 2,
            pt: 2,
            mx: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}>
          <Button variant="outlined" onClick={setDefault}>
            Default
          </Button>
          <Button onClick={handleUpdateRule} variant="contained">
            Update
          </Button>
        </Stack>
      </Stack> 
    </Drawer>
  );
};
