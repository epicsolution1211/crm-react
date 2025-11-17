import { useMemo, useState } from "react"

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { alpha } from '@mui/system/colorManipulator';

import { Chart } from "src/components/chart";
import { useAreaChartOptions } from "../hooks";
import { Scrollbar } from "src/components/scrollbar"
import { PageNumberSelect } from "src/components/pagination/page-selector";

export const LeaderboardTable = ({ tableData }) => {
  const chartOptions = useAreaChartOptions();

  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const [sortBy, setSortBy] = useState('deposit_amount');

  const setSorting = (param) => {
    setSortBy(param);
  }

  const sortedTableData = useMemo(() => {
    if (!tableData) return [];

    const result = tableData.slice().sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue == null) return bValue == null ? 0 : -1;
      if (bValue == null) return 1;

      if (sortBy == 'agent_first_name') return aValue.localeCompare(bValue, undefined, { sensitivity: 'base' });

      const aNum = parseFloat(aValue);
      const bNum = parseFloat(bValue);

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      }

      return aValue.toString().localeCompare(bValue.toString(), undefined, { sensitivity: 'base' });
    });

    return result?.reverse();

  }, [tableData, sortBy]);

  
  const DEFAULT_COLUMN = [
    {
      id: "agent",
      label: "Agent",
      enabled: true,
      headerRender: () => (
        <Typography 
          onClick={() => setSorting('agent_first_name')} 
          variant="subtitle2" 
          color={sortBy === 'agent_first_name' ? "primary" : ""}
          sx={{ fontWeight: '600' }}
        >
          AGENT
        </Typography>
      ),
      render: (row, index) => (
        <Stack 
          direction='row' 
          sx={{ alignItems: 'center' }} 
          onClick={() => setSorting('agent_first_name')}
        >
          <Typography sx={{ whiteSpace: 'nowrap' }}>
            {index + 1}. {row?.agent_first_name ?? ''} {row?.agent_last_name ?? ''}
          </Typography>
        </Stack>
      ),
    },
    {
      id: "deposit_amount",
      label: "Deposit Amount",
      enabled: true,
      headerRender: () => (
        <Typography 
          onClick={() => setSorting('deposit_amount')} 
          variant="subtitle2" 
          color={sortBy === 'deposit_amount' ? "primary" : ""}
        >
          DEPOSIT AMOUNT
        </Typography>
      ),
      render: (row) => (
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          <Typography>
            {`$${row?.deposit_amount ?? 0}`}
          </Typography>
          <Stack
            direction='row'
            sx={{ alignItems: 'center' }}
            gap={2}
          >
            <Stack direction='column'>
              {getDepositPercent(row)?.map((item, index) => (
                <Typography
                  key={index}
                  fontSize={12}
                  lineHeight={1}
                >
                  {index == 0 ? row?.deposit_amount_approved : (index == 1 ? row?.deposit_amount_pending : row?.deposit_amount_rejected)}
                </Typography>
              ))}
            </Stack>
            <Stack direction='column' gap={0.5}>
              {getDepositPercent(row)?.map((item, index) => (
                <LinearProgress
                  key={index}
                  sx={{ width: 100, height: 7, bgcolor: (theme) => alpha(theme.palette.grey[500], 0.16), }}
                  value={item ?? 0}
                  color={index === 0 ? 'success' : index === 1 ? "info" : "error"}
                  variant="determinate" />
              ))}
            </Stack>
          </Stack>
          {row?.transaction_chart?.length > 1 ?
            <Stack sx={{ height: 50, overflow: 'hidden', justifyContent: 'center' }}>
              <Chart
                height='auto'
                width={100}
                options={chartOptions}
                series={[
                  {
                    data: row?.transaction_chart ?? []
                  }
                ]}
                type="area" />
            </Stack>
            : null}
        </Stack>
      ),
    },
    {
      id: "deposits",
      label: "Deposits",
      enabled: true,
      headerRender: () => (
        <Typography 
          onClick={() => setSorting('deposit_count')} 
          variant="subtitle2" 
          color={sortBy === 'deposit_count' ? "primary" : ""}
        >
          DEPOSITS
        </Typography>
      ),
      render: (row) => (
        <Typography>{row?.deposit_count}</Typography>
      ),
    },
    {
      id: "withdraw",
      label: "Withdraw",
      enabled: true,
      headerRender: () => (
        <Typography 
          onClick={() => setSorting('withdraw_amount')} 
          variant="subtitle2" 
          color={sortBy === 'withdraw_amount' ? "primary" : ""}
        >
          WITHDRAW
        </Typography>
      ),
      render: (row) => (
        <Stack 
          alignItems="center" 
          direction="row" 
          spacing={2} 
        >
          <Typography>
            {`$${row?.withdraw_amount ?? 0}`}
          </Typography>
          <Stack
              direction='row'
              sx={{ alignItems: 'center' }}
              gap={2}
            >
            <Stack direction='column' gap={0.3}>
              {getWithdrawPercent(row)?.map((item, index) => (
                <Typography
                  key={index}
                  fontSize={12}
                  lineHeight={1}
                >
                  {index == 0 ? row?.withdraw_amount_approved : (index == 1 ? row?.withdraw_amount_pending : row?.withdraw_amount_rejected)}
                </Typography>
              ))}
            </Stack>
            <Stack direction='column' gap={0.7}>
              {getWithdrawPercent(row)?.map((item, index) => (
                <LinearProgress
                  key={index}
                  sx={{ width: 100, height: 7, bgcolor: (theme) => alpha(theme.palette.grey[500], 0.16), }}
                  value={item ?? 0}
                  color={index === 0 ? 'success' : index === 1 ? "info" : "error"}
                  variant="determinate" 
                />
              ))}
            </Stack>
          </Stack>
        </Stack>
      ),
    },
    {
      id: "turnover",
      label: "Turnover",
      enabled: true,
      headerRender: () => (
        <Typography 
          onClick={() => setSorting('total_positions')} 
          variant="subtitle2" 
          color={sortBy === 'total_positions' ? "primary" : ""}
        >
          TURNOVER
        </Typography>
      ),
      render: (row) => (
        <Typography>
          {`$${row.total_positions ?? 0}`}
        </Typography>
      )
    },
  ];

  const getDepositPercent = (row) => {
    if (row) {
      const maxValue = Math.max(row?.deposit_amount_approved, row?.deposit_amount_pending, row?.deposit_amount_rejected);
      const approved = maxValue > 0 ? row?.deposit_amount_approved / maxValue * 100 : 0;
      const pending = maxValue > 0 ? row?.deposit_amount_pending / maxValue * 100 : 0;
      const rejected = maxValue > 0 ? row?.deposit_amount_rejected / maxValue * 100 : 0;
      return [approved, pending, rejected];
    }
    return undefined;
  }

  const getWithdrawPercent = (row) => {
    if (row) {
      const maxValue = Math.max(row?.withdraw_amount_approved, row?.withdraw_amount_pending, row?.withdraw_amount_rejected);
      const approved = maxValue > 0 ? row?.withdraw_amount_approved / maxValue * 100 : 0;
      const pending = maxValue > 0 ? row?.withdraw_amount_pending / maxValue * 100 : 0;
      const rejected = maxValue > 0 ? row?.withdraw_amount_rejected / maxValue * 100 : 0;
      return [approved, pending, rejected];
    }
    return undefined;
  }


  return (
    <Card sx={{ pt: 1 }}>
      <Box sx={{ position: "relative" }}>
        <Typography variant="body1" sx={{ p: 2, fontWeight: 600 }}>Total Info</Typography>
        <Scrollbar>
          <Table sx={{ minWidth: 700, p: 1 }}>
            <TableHead>
              <TableRow>
                {DEFAULT_COLUMN
                  ?.filter((item) => item.enabled)
                  ?.map((item) => (
                    <TableCell sx={{ whiteSpace: "nowrap", cursor: 'pointer' }} key={item.id}>
                      {item.headerRender ? item.headerRender() : item?.label}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedTableData?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((row, rowIndex) => (
                <TableRow hover key={rowIndex} sx={{ borderRadius: 1, mx: 2, py: 2, boxShadow: (theme) => theme.shadows[5] }}>
                  {DEFAULT_COLUMN
                    ?.filter((item) => item.enabled)
                    ?.map((column, index) => (
                      <TableCell key={row?.agent_id + index}>
                        {column?.render
                          ? column?.render(row, rowIndex)
                          : row[column?.id]}
                      </TableCell>
                    ))}
                </TableRow>
                ))}
            </TableBody>
          </Table>
        </Scrollbar>
        <Divider/>
        <Stack sx={{  flexDirection: { md: 'row', xs: 'column' }, gap: 0, justifyContent: 'flex-end', alignItems: { md: 'center', xs: 'start' } }}>
          <PageNumberSelect 
            currentPage={currentPage} 
            totalPage={tableData?.length ? Math.ceil(tableData?.length/perPage) : 0}
            onUpdate={setCurrentPage}
          />
          <TablePagination
            component="div"
            labelRowsPerPage="Per page"
            count={tableData?.length ?? 0}
            page={currentPage ?? 0}
            rowsPerPage={perPage ?? 5}
            onPageChange={(event, index) => setCurrentPage(index)}
            onRowsPerPageChange={(event) =>
              setPerPage(event?.target?.value)
            }
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Stack>
      </Box>
    </Card>
  )
}