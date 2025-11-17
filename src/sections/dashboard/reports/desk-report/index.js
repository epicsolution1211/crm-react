import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format, startOfMonth } from "date-fns";
import * as XLSX from "xlsx-js-style";

import { useTimezone } from "src/hooks/use-timezone";
import { Iconify } from "src/components/iconify";
import { useAuth } from "src/hooks/use-auth";
import { reportsApi } from "src/api/reports";
import { DeskReportContent } from "./desk-content";
import { settingsApi } from "src/api/settings";
import { AgentFTD } from "../agent-report/agent-ftd";
import { AgentWD } from "../agent-report/agent-wd";
import { AgentOpenPositions } from "../agent-report/agent-open-position";
import { AgentClosePositions } from "../agent-report/agent-close-position";
import { AgentBrand } from "../agent-report/agent-brand";
import { AgentTotal } from "../agent-report/agent-total";
import { AgentCountry } from "../agent-report/agent-country";
import { AgentActivity } from "../agent-report/agent-activity";

const useDesks = () => {
  const [desks, setDesks] = useState([]);
  const { user } = useAuth();

  const getDesks = async () => {
    try {
      const res = await settingsApi.getDesk();
      setDesks(
        res?.desks
          ?.filter((desk) => {
            if (
              user?.acc?.acc_v_client_self_desk === undefined ||
              user?.acc?.acc_v_client_self_desk
            ) {
              return user?.desk_ids?.includes(desk?.id);
            } else {
              return false;
            }
          })
          .map((desk) => ({
            label: desk?.name,
            value: desk?.id,
          }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDesks();
  }, []);

  return desks;
};

export const DeskReport = ({ selectedDesk, setSelectedDesk }) => {
  const { toUTCTime } = useTimezone();
  const desks = useDesks();
  const { company } = useAuth();
  const accountId = localStorage.getItem("account_id");

  const [report, setReport] = useState();
  const [agentList, setAgentList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [filterDate, setFilterDate] = useState({
    from: startOfMonth(new Date()),
    to: new Date()?.setHours(23, 59, 59, 999),
  });

  const getDeskStatistics = async () => {
    try {
      let params = {};
      if (filterDate?.from) {
        params["start_time"] = toUTCTime(filterDate?.from);
      }
      if (filterDate?.to) {
        params["end_time"] = toUTCTime(filterDate?.to);
      }
      if (params) {
        const res = await reportsApi.getDeskStatistics({
          account_id: accountId,
          desk_id: selectedDesk?.value,
          ...params,
        });
        setAgentList(res?.data?.ageents_list ?? []);
        setReport(res?.data);
      }
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (selectedDesk) {
      getDeskStatistics();
    }
  }, [selectedDesk, filterDate]);

  useEffect(() => {
    if (!selectedDesk && desks?.length > 0) {
      setSelectedDesk(desks[0]);
    }
  }, [desks]);

  const [ deskTable, setDeskTable ]= useState([]);  
  const [ FTDTable, setFTDTable ]= useState([]);  
  const [ WDTable, setWDTable ]= useState([]);  
  const [ OpenTable, setOpenTable ]= useState([]);  
  const [ CloseTable, setCloseTable ]= useState([]);  
  const [ clientTable, setClientTable ]= useState([]);  
  const [ balanceTable, setBalanceTable ]= useState([]);  
  const [ countryTable, setCountryTable ]= useState([]);  
  const [ activityTable, setActivityTable ]= useState([]);  
  const [ reportTable, setReportTable ]= useState([]);  

  const handleGenerateDeskInfo = () => {
    const infoTable = [
      ['Desk', 'Issue Date', 'Due Date'] ,
      [`${selectedDesk?.label??""} (ID: ${selectedDesk?.value??""})`, format(filterDate?.from, "yyyy-MM-dd HH:mm"), format(filterDate?.to, "yyyy-MM-dd HH:mm")] ,
    ];
    setDeskTable(infoTable)
  };

  useEffect(() => {
    if(selectedDesk && filterDate) {
      handleGenerateDeskInfo();
    }
  }, [selectedDesk, filterDate])

  const exportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = {};
  
    let currentRow = 2; // Starting row for the first table
    const columnOffset = 1; // Starting column for the first table
    let maxColumns = 0; // Keep track of the widest table
  
    const addTable = (table, startRow, startCol, isReportTable = false, isDeskTable = false) => {
      table.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const cellAddress = XLSX.utils.encode_cell({
            r: startRow + rowIndex,
            c: startCol + colIndex,
          });
  
          let cellStyle = {
            font: {
              bold: isReportTable 
                ? rowIndex === 0 // Only the first row is bold for reportTable
                : rowIndex % 2 === 0, // Bold for every even row in other tables
              color: { rgb: "000000" },
            },
            alignment: {
              horizontal: "center",
              vertical: "center",
            },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          };
  
          // Apply background color for the first row of reportTable and deskTable
          if ((isReportTable || isDeskTable) && rowIndex === 0) {
            cellStyle.fill = {
              patternType: "solid",
              fgColor: { rgb: "6ce1a6" }, // Light green for the first row
            };
          }
  
          // Apply background color for remaining rows of reportTable
          if (isReportTable && rowIndex !== 0) {
            cellStyle.fill = {
              patternType: "solid",
              fgColor: { rgb: "d9e2f3" }, // Light blue for other rows
            };
          }
  
          // Apply standard background colors for other tables
          if (!isReportTable && !isDeskTable) {
            if (rowIndex % 2 === 0) {
              cellStyle.fill = {
                patternType: "solid",
                fgColor: { rgb: "6ce1a6" }, // Light green for even rows
              };
            } else {
              cellStyle.fill = {
                patternType: "solid",
                fgColor: { rgb: "d9e2f3" }, // Light blue for odd rows
              };
            }
          }
  
          worksheet[cellAddress] = {
            v: cell || "", // Ensure no cell is undefined
            s: cellStyle,
          };
        });
  
        // Update maxColumns to reflect the widest row
        maxColumns = Math.max(maxColumns, row.length);
      });
    };
  
    const adjustColumnWidths = (table, startCol) => {
      const columnWidths = [];
      const defaultWidth = 60; // Set a default minimum width (in characters)
  
      table.forEach((row) => {
        row.forEach((cell, colIndex) => {
          // Handle multiline content
          const cellLines = String(cell).split("\n");
          const longestLine = cellLines.reduce(
            (max, line) => Math.max(max, line.length),
            0
          );
  
          // Calculate the column width based on the longest line
          if (!columnWidths[colIndex] || longestLine > columnWidths[colIndex]) {
            columnWidths[colIndex] = longestLine;
          }
        });
      });
  
      // Map column widths and ensure they meet the default minimum width
      const cols = columnWidths.map((width) => ({
        wpx: Math.max((width + 4) * 8, defaultWidth * 8), // Ensure minimum width is applied
      }));
  
      worksheet["!cols"] = worksheet["!cols"] || [];
      cols.forEach((col, index) => {
        worksheet["!cols"][startCol + index] = col;
      });
    };
  
    // Add tables one by one
    const tables = [
      deskTable,
      FTDTable,
      WDTable,
      OpenTable,
      CloseTable,
      clientTable,
      balanceTable,
      countryTable,
      activityTable,
      reportTable,
    ];
  
    tables.forEach((table) => {
      const isReportTable = table === reportTable; // Check if this is the reportTable
      addTable(table, currentRow, columnOffset, isReportTable, false);
      adjustColumnWidths(table, columnOffset);
      currentRow += table.length + 2; // Add a gap of 2 rows between tables
    });
  
    // Set worksheet dimensions to cover all rows and max columns
    worksheet["!ref"] = XLSX.utils.encode_range({
      s: { r: 0, c: 0 }, // Start cell
      e: { r: currentRow - 1, c: columnOffset + maxColumns - 1 }, // End cell
    });
  
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  
    // Export the Excel file
    XLSX.writeFile(workbook, "desk_report.xlsx");
  };
  

    const canExport = deskTable.length > 0 || FTDTable.length > 0 || WDTable.length > 0 || OpenTable.length > 0 || CloseTable.length > 0 || clientTable.length > 0 || balanceTable.length > 0 || countryTable.length > 0 || activityTable.length > 0 || reportTable.length > 0;
    
  return (
    <Stack pt={1} direction="column" gap={3} pb={3}>
      <Stack
        sx={{ flexDirection: { md: "row", xs: "column" } }}
        width={1}
        alignItems="center"
        gap={2}
        justifyContent="flex-start"
      >
        <Stack direction="row" alignItems="center" gap={2} width={1}>
          <Typography sx={{ whiteSpace: "nowrap" }}>Desk :</Typography>
          <Autocomplete
            sx={{
              minWidth: { xs: "auto", md: 260 },
              flexGrow: { xs: 1, xl: 0 },
            }}
            options={desks}
            value={
              desks?.find((item) => item?.value == selectedDesk?.value) ?? {
                label: "",
                value: "",
              }
            }
            onChange={(event, value) => {
              if (value) {
                setSelectedDesk(value);
              }
            }}
            autoHighlight
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => (
              <Box key={option.label} value={option.label} {...props}>
                {option.label}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                hiddenLabel
                inputProps={{
                  ...params.inputProps,
                }}
              />
            )}
          />
          <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center' }}>
            <Tooltip title="Reload">
              <IconButton
                onClick={() => getDeskStatistics()}
                sx={{
                  "&:hover": {
                    color: "primary.main",
                    transform: "rotate(180deg)",
                  },
                  transition: "transform 0.3s",
                }}
              >
                <Iconify icon="ion:reload-sharp" width={24} />
              </IconButton>
            </Tooltip>
            {selectedDesk &&
              <Tooltip title="Export Report">
                <IconButton
                  disabled={!canExport}
                  onClick={() => exportExcel()}
                  sx={{ '&:hover': { color: 'primary.main' }}}
                >
                  <Iconify icon="line-md:downloading-loop" width={24}/>
                </IconButton>
              </Tooltip>
            }
          </Stack>
        </Stack>
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 2,
            width: 1,
          }}
        >
          <DatePicker
            format="dd/MM/yyyy"
            label="Issue Date"
            onChange={(val) => {
              setFilterDate((prev) => ({
                ...prev,
                from: val,
              }));
            }}
            sx={{ width: { xs: 1, md: "auto" } }}
            maxDate={filterDate?.to}
            value={filterDate?.from}
            slotProps={{ textField: { size: "small" } }}
          />
          <DatePicker
            format="dd/MM/yyyy"
            label="Due Date"
            onChange={(val) => {
              setFilterDate((prev) => ({
                ...prev,
                to: val?.setHours(23, 59, 59, 999),
              }));
            }}
            sx={{ width: { xs: 1, md: "auto" } }}
            minDate={filterDate?.from}
            value={filterDate?.to}
            slotProps={{ textField: { size: "small" } }}
          />
        </Stack>
      </Stack>
      {selectedDesk ? (
        <Grid container spacing={2}>
          <AgentFTD report={report} isLoading={isLoading} setFTDTable={setFTDTable}/>
          <AgentWD report={report} isLoading={isLoading} setWDTable={setWDTable}/>
          {company?.company_type !== 2 ? (
            <AgentOpenPositions report={report} isLoading={isLoading} setOpenTable={setOpenTable}/>
          ) : null}
          {company?.company_type !== 2 ? (
            <AgentClosePositions report={report} isLoading={isLoading} setCloseTable={setCloseTable}/>
          ) : null}
          <AgentBrand report={report} isLoading={isLoading} setClientTable={setClientTable}/>
          <AgentTotal report={report} isLoading={isLoading} setBalanceTable={setBalanceTable}/>
          <AgentCountry report={report} isLoading={isLoading} setCountryTable={setCountryTable}/>
          <AgentActivity report={report} isLoading={isLoading} setActivityTable={setActivityTable}/>
          <DeskReportContent
            agentList={agentList}
            desk={selectedDesk}
            isLoading={isLoading}
            setReportTable={setReportTable}
          />
        </Grid>
      ) : null}
    </Stack>
  );
};
