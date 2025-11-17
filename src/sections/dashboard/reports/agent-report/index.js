import { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import { startOfMonth } from "date-fns";
import * as XLSX from "xlsx-js-style";

import { useTimezone } from "src/hooks/use-timezone";
import { useAuth } from "src/hooks/use-auth";
import { AgentActivity } from "./agent-activity";
import { AgentBrand } from "./agent-brand";
import { AgentClosePositions } from "./agent-close-position";
import { AgentCountry } from "./agent-country";
import { AgentFTD } from "./agent-ftd";
import { AgentOpenPositions } from "./agent-open-position";
import { AgentOverview } from "./agent-overview";
import { AgentTotal } from "./agent-total";
import { AgentWD } from "./agent-wd";
import { AgentFilter } from "./agent-filter";
import { reportsApi } from "src/api/reports";

export const AgentReport = ({
  selectedAgent,
  setSelectedAgent = () => { },
  viewOnly = false,
}) => {
  const { toUTCTime } = useTimezone();
  const { company } = useAuth();
  const accountId = localStorage.getItem("account_id");

  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState();

  const [filterDate, setFilterDate] = useState({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  const getAgentStatistics = async () => {
    setIsLoading(true);

    const startTime = toUTCTime(filterDate?.from);
    const endTime = toUTCTime(filterDate?.to);

    try {
      let params = {};
      if (startTime) {
        params["start_time"] = startTime;
      }
      if (endTime) {
        params["end_time"] = endTime;
      }

      if (params) {
        const res = await reportsApi.getAgentStatistics({
          account_id: accountId,
          agent_id: selectedAgent?.id,
          ...params,
        });

        setReport(res?.data ?? []);
      }
    } catch (error) {
      setReport(undefined);
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (selectedAgent) {
      getAgentStatistics();
    }
  }, [selectedAgent, filterDate]);

  const [infoTable, setInfoTable] = useState([]);
  const [overViewTable, setOverViewTable] = useState([]);
  const [FTDTable, setFTDTable] = useState([]);
  const [WDTable, setWDTable] = useState([]);
  const [OpenTable, setOpenTable] = useState([]);
  const [CloseTable, setCloseTable] = useState([]);
  const [clientTable, setClientTable] = useState([]);
  const [balanceTable, setBalanceTable] = useState([]);
  const [countryTable, setCountryTable] = useState([]);
  const [activityTable, setActivityTable] = useState([]);

  const exportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = {};

    let currentRow = 2; // Starting row for the first table
    const columnOffset = 1; // Starting column for the first table
    let maxColumns = 0; // Track the widest row across all tables

    const addTable = (table, startRow, startCol) => {
      table.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const cellAddress = XLSX.utils.encode_cell({
            r: startRow + rowIndex,
            c: startCol + colIndex,
          });

          let cellStyle = {
            font: {
              bold: rowIndex % 2 === 0, // Bold for even rows only
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

          // Apply background color for even rows
          if (rowIndex % 2 === 0) {
            cellStyle.fill = {
              patternType: "solid",
              fgColor: { rgb: "6ce1a6" }, // Light green for even rows
            };
          }

          // Apply background color for odd rows
          if (rowIndex % 2 !== 0) {
            cellStyle.fill = {
              patternType: "solid",
              fgColor: { rgb: "d9e2f3" }, // Light blue for odd rows
            };
          }

          worksheet[cellAddress] = {
            v: cell || "", // Ensure no empty cells
            s: cellStyle,
          };
        });

        // Update maxColumns to track the widest row in the table
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
      infoTable,
      overViewTable,
      FTDTable,
      WDTable,
      OpenTable,
      CloseTable,
      clientTable,
      balanceTable,
      countryTable,
      activityTable,
    ];

    tables.forEach((table) => {
      addTable(table, currentRow, columnOffset);
      adjustColumnWidths(table, columnOffset);
      currentRow += table.length + 2; // Add a gap of 2 rows between tables
    });

    // Set worksheet dimensions to cover all rows and the widest columns
    worksheet["!ref"] = XLSX.utils.encode_range({
      s: { r: 0, c: 0 }, // Start cell
      e: { r: currentRow - 1, c: columnOffset + maxColumns - 1 }, // End cell
    });

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Export the Excel file
    XLSX.writeFile(workbook, "agent_report.xlsx");
  };

  const canExport = infoTable.length > 0 || overViewTable.length > 0 || FTDTable.length > 0 || OpenTable.length > 0 || CloseTable.length > 0 || clientTable.length > 0 || balanceTable.length > 0 || countryTable.length > 0 || activityTable.length > 0;

  return (
    <Stack pt={1} pb={3} direction="column" gap={3}>
      <AgentFilter
        selectedAgent={selectedAgent}
        setSelectedAgent={(val) => {
          if (selectedAgent?.id !== val?.id) {
            setSelectedAgent(val);
          }
        }}
        handleGetReports={() => {
          getAgentStatistics();
        }}
        filterDate={filterDate}
        setFilterDate={setFilterDate}
        viewOnly={viewOnly}
        setInfoTable={setInfoTable}
        exportExcel={exportExcel}
        canExport={canExport}
      />
      {selectedAgent && (
        <>
          <AgentOverview report={report} isLoading={isLoading} setOverViewTable={setOverViewTable} company={company} />
          <Grid container spacing={2}>
            <AgentFTD report={report} isLoading={isLoading} setFTDTable={setFTDTable} />
            <AgentWD report={report} isLoading={isLoading} setWDTable={setWDTable} />
            {company?.company_type !== 2 && (
              <AgentOpenPositions report={report} isLoading={isLoading} setOpenTable={setOpenTable} />
            )}
            {company?.company_type !== 2 && (
              <AgentClosePositions report={report} isLoading={isLoading} setCloseTable={setCloseTable} />
            )}
            <AgentBrand report={report} isLoading={isLoading} setClientTable={setClientTable} />
            <AgentTotal report={report} isLoading={isLoading} setBalanceTable={setBalanceTable} />
            <AgentCountry report={report} isLoading={isLoading} setCountryTable={setCountryTable} />
            <AgentActivity report={report} isLoading={isLoading} setActivityTable={setActivityTable} />
          </Grid>
        </>
      )}
    </Stack>
  );
};
