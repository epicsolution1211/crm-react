import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import SpreadItem from './spread-item';
import { Scrollbar } from 'src/components/scrollbar';
import { TableSkeleton } from '../../../table-skeleton';

const SpreadTable = ({ spreadList, onChangePage, onChangePerPage, perPage, currentPage, totalCount, isDataLoading }) => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(spreadList?.map((item) => ({ ...item, margin: 0, leverage: 0 })));
  }, [spreadList]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell align='left' sx={{whiteSpace:"nowrap"}}>
                Enabled
              </TableCell>
              <TableCell align='left' sx={{whiteSpace:"nowrap"}}>
                Ticker
              </TableCell>
              <TableCell align='left' sx={{whiteSpace:"nowrap"}}>
                Swap Rate Type
              </TableCell>
              <TableCell align='left' sx={{whiteSpace:"nowrap"}}>
                Swap Short
              </TableCell>
              <TableCell align='left' sx={{whiteSpace:"nowrap"}}>
                Swap Long
              </TableCell>
              <TableCell align='left' sx={{whiteSpace:"nowrap"}}>
                Commission
              </TableCell>
              <TableCell align='left' sx={{whiteSpace:"nowrap"}}>
                Manual Swap
              </TableCell>
              {/* <TableCell align='left' sx={{whiteSpace:"nowrap"}}>
                Swap Type
              </TableCell> */}
              <TableCell align='left' sx={{whiteSpace:"nowrap"}}>
                Lot Size
              </TableCell>
              <TableCell align='left' sx={{whiteSpace:"nowrap"}}>
                Contract Size Multiplier
              </TableCell>
              <TableCell align='left' sx={{whiteSpace:"nowrap"}}>
                Leverage
              </TableCell>
              <TableCell align='left' sx={{ whiteSpace: "nowrap" }}>
                Spread on
              </TableCell>
              <TableCell align='left' sx={{whiteSpace:"nowrap"}}>
                Spread
              </TableCell>
              <TableCell align='left' sx={{ whiteSpace: "nowrap" }}>
                Current value
              </TableCell>
              <TableCell align='left' sx={{whiteSpace:"nowrap"}}>
                Used margin
              </TableCell>
              <TableCell align='left' sx={{whiteSpace:"nowrap"}}>
                Used leverage
              </TableCell>
              <TableCell align='left' sx={{whiteSpace:"nowrap"}}>
                Result
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isDataLoading ?
            <TableSkeleton rowCount={5} cellCount={16} height={71.5}/>:
              tableData?.map((item) => (
                <SpreadItem
                  key={item?.id}
                  item={item} />
              ))}
          </TableBody>
        </Table>
      </Scrollbar>
      <Divider />
      <TablePagination
        component="div"
        labelRowsPerPage="Per page"
        count={totalCount}
        page={currentPage}
        onPageChange={(event, page) => onChangePage(page)}
        rowsPerPage={perPage}
        onRowsPerPageChange={(event) => onChangePerPage(event.target.value)}
        rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
      />
    </Box>
  );
};

export default SpreadTable;