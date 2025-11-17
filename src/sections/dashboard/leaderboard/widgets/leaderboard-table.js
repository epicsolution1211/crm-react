import { useEffect, useMemo, useState } from "react"
import { isEqual, map } from 'lodash';

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Badge from "@mui/material/Badge";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import SvgIcon from "@mui/material/SvgIcon";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import TablePagination from "@mui/material/TablePagination";
import { alpha } from '@mui/system/colorManipulator';

// Components
import { Chart } from "src/components/chart";
import { PageNumberSelect } from "src/components/pagination/page-selector";
import { Scrollbar } from "src/components/scrollbar"
import { TableModal } from "src/components/table-settings-modal";
import { TableNoData } from "src/components/table-empty"
import { TableSkeleton } from "src/components/table-skeleton";
import SettingIcon from "src/icons/untitled-ui/duocolor/setting";

// API
import { authApi } from "src/api/auth";
import { userApi } from "src/api/user";

// Hooks
import { useAreaChartOptions } from "../hooks";


export const LeaderboardTable = ({ tableData, isLoading }) => {
  const accountId = localStorage.getItem("account_id");
  const chartOptions = useAreaChartOptions();

  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('deposit_amount');
  const [rule, setRule] = useState([]);
  const [tableModal, setTableModal] = useState(false);
  const [tableSetting, setTableSetting] = useState({});

  const getTableSetting = async () => {
    try {
      const localTableSetting = localStorage.getItem("tableSetting");
      const { account } = await authApi.me({ accountId });
      if (account?.column_setting) {
        setTableSetting(JSON.parse(account?.column_setting));
        setRule(JSON.parse(account?.column_setting)?.leaderboardTable ?? []);
      } else if (localTableSetting) {
        const { account: _account } = await userApi.updateUser(accountId, {
          column_setting: localTableSetting,
        });
        setTableSetting(JSON.parse(_account?.column_setting));
        setRule(JSON.parse(_account?.column_setting)?.leaderboardTable ?? []);
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getTableSetting();
  }, []);

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

  const updateRule = async (rule) => {
    setRule(rule);

    if (tableSetting) {
      const updateSetting = {
        ...tableSetting,
        leaderboardTable: rule,
      };
      await userApi.updateUser(accountId, {
        column_setting: JSON.stringify(updateSetting),
      });
      setTableSetting(updateSetting);
    } else {
      const updateSetting = {
        leaderboardTable: rule,
      };
      await userApi.updateUser(accountId, {
        column_setting: JSON.stringify(updateSetting),
      });
      setTableSetting(updateSetting);
    }
  };
  
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
          sx={{ fontWeight: '600', cursor: 'pointer' }}
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
          sx={{ fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}
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
          <Typography sx={{ minWidth: 50 }}>
            {`$${row?.deposit_amount ?? 0}`}
          </Typography>
          <Stack
            direction='row'
            sx={{ alignItems: 'center' }}
            gap={2}
          >
            <Stack direction='column' sx={{ minWidth: 30 }}>
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
          sx={{ fontWeight: '600', cursor: 'pointer' }}
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
          sx={{ fontWeight: '600', cursor: 'pointer' }}
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
      id: "total_clients",
      label: "Total Clients",
      enabled: false,
      headerRender: () => (
        <Typography 
          onClick={() => setSorting('total_clients')} 
          variant="subtitle2" 
          color={sortBy === 'total_clients' ? "primary" : ""}
          sx={{ fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          TOTAL CLIENTS
        </Typography>
      ),
      render: (row) => (
        <Typography>
          {`${row?.total_clients ?? 0}`}
        </Typography>
      )
    },
    {
      id: "total_positions",
      label: "Total Positions",
      enabled: false,
      headerRender: () => (
        <Typography 
          onClick={() => setSorting('total_positions')} 
          variant="subtitle2" 
          color={sortBy === 'total_positions' ? "primary" : ""}
          sx={{ fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          TOTAL POSITIONS
        </Typography>
      ),
      render: (row) => (
        <Typography>
          {`${Number(row?.total_positions ?? 0).toFixed(2)}`}
        </Typography>
      )
    },
    {
      id: "turnover",
      label: "Turnover",
      enabled: true,
      headerRender: () => (
        <Typography 
          onClick={() => setSorting('turnover')} 
          variant="subtitle2" 
          color={sortBy === 'turnover' ? "primary" : ""}
          sx={{ fontWeight: '600', cursor: 'pointer' }}
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
    {
      id: "total_net_deposit",
      label: "Total Net Deposit",
      enabled: true,
      headerRender: () => (
        <Typography 
          onClick={() => setSorting('total_net_deposit')} 
          variant="subtitle2" 
          color={sortBy === 'total_net_deposit' ? "primary" : ""}
          sx={{ fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          TOTAL NET DEPOSIT
        </Typography>
      ),
      render: (row) => (
        <Typography>
          {`$${row.total_net_deposit ?? 0}`}
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

  const tableColumn = useMemo(() => {
    if (rule?.length) {
      const updateColumn = DEFAULT_COLUMN
        ?.map((item) => ({
          ...item,
          enabled: rule?.find((ruleItem) => item?.id === ruleItem?.id)?.enabled,
          order: rule?.find((ruleItem) => item?.id === ruleItem?.id)?.order,
        }))
        ?.sort((a, b) => a.order - b.order);
      return updateColumn;
    } else {
      return DEFAULT_COLUMN?.map((item, index) => ({ ...item, order: index }));
    }
  }, [rule, sortBy]);

  const isDefaultSetting = useMemo(() => {
    return rule?.length === 0 || isEqual(
      map(DEFAULT_COLUMN, (item, index) => ({
        id: item?.id,
        enabled: item?.enabled,
        order: index,
      })),
      map(rule, (item, index) => ({
        id: item?.id,
        enabled: item?.enabled,
        order: index,
      }))
    );
  }, [rule, DEFAULT_COLUMN]);

  return (
    <Card sx={{ pt: 1 }}>
      <Box sx={{ position: "relative" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 1.5 }}>
          <Typography variant="body1" sx={{ p: 2, fontWeight: 600 }}>Total Info</Typography>
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
        </Stack>
        <Scrollbar>
          <Table sx={{ minWidth: 700, p: 1 }}>
            <TableHead>
              <TableRow>
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
              {isLoading ? (
                <TableSkeleton
                  cellCount={tableColumn?.filter((item) => item?.enabled)?.length ?? 0}
                  rowCount={perPage > 15 ? 15 : 10}
                />
              ) : (
                sortedTableData?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((row, rowIndex) => (
                  <TableRow hover key={rowIndex} sx={{ borderRadius: 1, mx: 2, py: 2, boxShadow: (theme) => theme.shadows[5] }}>
                    {tableColumn
                      ?.filter((item) => item.enabled)
                      ?.map((column, index) => (
                        <TableCell 
                          key={row?.agent_id + index}
                          
                        >
                          {column?.render
                            ? column?.render(row, rowIndex)
                            : row[column?.id]}
                        </TableCell>
                      ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Scrollbar>
        {(!tableData?.length && !isLoading) ? <TableNoData /> : null}
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
          <TableModal
            open={tableModal}
            onClose={() => setTableModal(false)}
            tableColumn={tableColumn}
            defaultColumn={DEFAULT_COLUMN}
            updateRule={updateRule}
          />
        </Stack>
      </Box>
    </Card>
  )
}