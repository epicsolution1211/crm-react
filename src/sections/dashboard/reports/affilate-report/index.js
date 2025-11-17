import { useEffect, useState } from "react";
import * as XLSX from "xlsx-js-style";
import { startOfMonth } from "date-fns";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";

import { useTimezone } from "src/hooks/use-timezone";
import { AffilateFilter } from "./affiliate-filter";
import { AffiliateBalance } from "./affiliate-balance";
import { AffiliateBrand } from "./affiliate-brand";
import { AffiliateClosePositions } from "./affiliate-close-position";
import { AffiliateCountry } from "./affiliate-country";
import { AffiliateOpenPositions } from "./affiliate-open-position";
import { AffiliateOverview } from "./affiliate-overview";
import { AffiliateTotal } from "./affiliate-total";
import { reportsApi } from "src/api/reports";
import { useAuth } from "src/hooks/use-auth";

export const AffilateReport = ({
  selectedAffiliate,
  setSelectedAffiliate = () => {},
  viewOnly = false,
}) => {
  const accountId = localStorage.getItem("account_id");
  const { toUTCTime } = useTimezone();
  const { company } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState();

  const [filterDate, setFilterDate] = useState({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  const getAffilateStatistics = async () => {
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
        const res = await reportsApi.getAffilateStatistics({
          account_id: accountId,
          affiliate_id: selectedAffiliate?.id,
          ...params,
        });
        setReport(res?.data);
      }
    } catch (error) {
      setReport(undefined);
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (selectedAffiliate) {
      getAffilateStatistics();
    }
  }, [selectedAffiliate, filterDate]);
  
  const [ infoTable, setInfoTable ]= useState([]);  
  const [ overViewTable1, setOverViewTable1 ]= useState([]);  
  const [ overViewTable2, setOverViewTable2 ]= useState([]);  
  const [ totalTable, setTotalTable ]= useState([]); 
  const [ countryTable, setCountryTable ]= useState([]);
  const [ OpenTable, setOpenTable ]= useState([]);  
  const [ CloseTable, setCloseTable ]= useState([]);
  const [ clientTable, setClientTable ]= useState([]);
  const [ balanceTable, setBalanceTable ]= useState([]);  

  const exportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = {};
  
    let currentRow = 2;
    const columnOffset = 1; 
    let maxColumns = 0;
  
    const addTable = (table, startRow, startCol) => {
      table.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const cellAddress = XLSX.utils.encode_cell({
            r: startRow + rowIndex,
            c: startCol + colIndex,
          });
  
          let cellStyle = {
            font: {
              bold: rowIndex % 2 === 0, 
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
      overViewTable1,
      overViewTable2,
      totalTable,
      countryTable,
      OpenTable,
      CloseTable,
      clientTable,
      balanceTable,
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
    XLSX.writeFile(workbook, "affiliate_report.xlsx");
  };

  const canExport = infoTable.length > 0 || overViewTable1.length > 0 || overViewTable2.length > 0 || totalTable.length > 0 || countryTable.length > 0 || OpenTable.length > 0 || CloseTable.length > 0 || clientTable.length > 0 || balanceTable.length > 0;

  return (
    <Stack pt={1} pb={3} direction="column" gap={3}>
      <AffilateFilter
        selectedAffiliate={selectedAffiliate}
        setSelectedAffiliate={(val) => {
          if (selectedAffiliate?.id !== val?.id) {
            setSelectedAffiliate(val);
          }
        }}
        handleGetReports={() => {
          getAffilateStatistics();
        }}
        filterDate={filterDate}
        setFilterDate={setFilterDate}
        viewOnly={viewOnly}
        setInfoTable={setInfoTable}
        exportExcel={exportExcel}
        canExport={canExport}
      />

      {selectedAffiliate && (
        <>
          <AffiliateOverview report={report} isLoading={isLoading} setOverViewTable1={setOverViewTable1} setOverViewTable2={setOverViewTable2}/>
          <Grid container spacing={2}>
            <AffiliateTotal report={report} isLoading={isLoading} setTotalTable={setTotalTable}/>
            <AffiliateCountry report={report} isLoading={isLoading} setCountryTable={setCountryTable}/>
            {company?.company_type !== 2 ? (
              <AffiliateOpenPositions report={report} isLoading={isLoading} setOpenTable={setOpenTable}/>
            ) : null}
            {company?.company_type !== 2 ? (
              <AffiliateClosePositions report={report} isLoading={isLoading} setCloseTable={setCloseTable}/>
            ) : null}
            <AffiliateBrand report={report} isLoading={isLoading} setClientTable={setClientTable}/>
            <AffiliateBalance report={report} isLoading={isLoading} setBalanceTable={setBalanceTable}/>
          </Grid>
        </>
      )}
    </Stack>
  );
};
