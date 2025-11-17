import { useEffect, useMemo, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from '@mui/material/Box';
import Card from "@mui/material/Card";
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Skeleton from '@mui/material/Skeleton';
import Stack from "@mui/material/Stack";
import Table from '@mui/material/Table';
import TableBody from "@mui/material/TableBody";
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useTheme } from '@mui/material/styles';

import { Chart } from 'src/components/chart';
import { Scrollbar } from "src/components/scrollbar";
import { agentsMockList } from "src/utils/constant/mock-data";
import { getAPIUrl } from "src/config";
import { TableSkeleton } from "src/components/table-skeleton";

const useChartOptions = (donutLabels) => {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    colors: [
      theme.palette.success.main,
      theme.palette.info.main,
      theme.palette.warning.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.success.dark,
      theme.palette.info.dark,
      theme.palette.warning.dark,
      theme.palette.secondary.dark,
      theme.palette.error.dark,
    ],
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1,
      type: 'solid'
    },
    labels: donutLabels,
    legend: {
      show: false
    },
    stroke: {
      colors: [theme.palette.background.paper],
      width: 1
    },
    theme: {
      mode: theme.palette.mode
    },
    tooltip: {
      fillSeriesColor: false
    }
  };
};

const defaultColumn = [
  {
    id: "name",
    label: "Agent By",
    render: (row, desk) => (
      <Stack alignItems="center" direction="row" spacing={1}>
        <Avatar
          src={row?.avatar ? row?.avatar?.includes('http') ? row?.avatar : `${getAPIUrl()}/${row?.avatar}` : ""}
          sx={{
            height: 42,
            width: 42,
          }}
        />
        <Stack sx={{ whiteSpace: "nowrap" }}>
          {row?.agent_first_name ? `${row?.agent_first_name} ${row?.agent_last_name}`: desk?.label??"" }
        </Stack>
      </Stack>
    ),
    tableRender: (row, desk) => (
      `${row?.agent_first_name ? `${row?.agent_first_name} ${row?.agent_last_name}`: desk?.label??"" }`
    ),
  },
  {
    id: "deposit_amount",
    label: "Deposit Amount",
    sort: true,
  },
  {
    id: "deposit_count",
    label: "Deposit",
    sort: true,
  },
  {
    id: "ftd_count",
    label: "FTD",
    sort: true,
  },
  {
    id: "ftd_amount",
    label: "FTD Amount",
    sort: true,
  },
  {
    id: "total_clients",
    label: "Clients",
    sort: true,
  },
  {
    id: "total_positions",
    label: "Positions",
    sort: true,
  },
  {
    id: "a_total_wd_amount",
    label: "Withdraw",
    sort: true,
  },
];

export const DeskReportContent = ({ agentList, desk, isLoading, setReportTable }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const [currentSort, setCurrentSort] = useState("deposit_amount");

  const sortedAgentList = useMemo(()=> {
    return agentList?.sort((a, b) => parseFloat(b[currentSort]) - parseFloat(a[currentSort]));
  }, [agentList, currentSort]);

  const donutInfo = useMemo(()=> {
    if(sortedAgentList || currentSort) {
      const topList = sortedAgentList?.slice(0, 5);
      const donutLabels = topList?.map((item)=> item?.agent_first_name ? `${item?.agent_first_name} ${item?.agent_last_name}`: desk?.label??"" );
      const donutSeries = topList?.map((item)=> parseFloat(item[currentSort]));
      const totalVolume = topList?.reduce((sum, asset) => {
        return sum + parseFloat(asset[currentSort]);
      }, 0);
      const donutPercentages = topList?.map((asset) => {
        const assetVolume = Number(asset[currentSort]);
        const percentage = totalVolume > 0 ? (assetVolume / totalVolume) * 100 : 0;
        return {
          asset_name: asset?.agent_first_name ? `${asset?.agent_first_name} ${asset?.agent_last_name}`: desk?.label??"",
          asset_percentage: percentage?.toFixed(2)
        };
      });
      return { donutLabels: donutLabels??0, donutSeries: donutSeries??0 , donutPercentages: donutPercentages??0 };
    } 
  }, [sortedAgentList, currentSort]);

  const chartOptions = useChartOptions(donutInfo?.donutLabels??[]);

  const donutTitle = useMemo(()=> {
    return defaultColumn?.find((item)=> item.id===currentSort)?.label ?? "";
  }, [defaultColumn, currentSort]);

  const generateTableInfo = () => {
    const tableInfo = [
      ['No', ...defaultColumn?.map((item)=> item.label)],
      ...sortedAgentList.map((agent, index) =>([`${index+1}`, ...defaultColumn
        ?.map((column) => (
            `${column?.tableRender
              ? column?.tableRender(agent, desk)
              : agent[column?.id]}`
        ))])),
    ];
    setReportTable(tableInfo);
  }

  useEffect(() => {
    if(sortedAgentList && desk) {
      generateTableInfo();
    }
  }, [sortedAgentList, desk]);

  return (
    <Grid xs={12}>
      <Card sx={{ p: 3, display:'flex', flexDirection:'column', gap: 3 }}>
        <Grid container spacing={2}>
          <Grid xs={12} xl={9} sx={{ order:{ xl:0, xs:1 } }}>
            <Box sx={{ position: "relative", borderRadius: 1, overflow:'hidden' }}>
              <Scrollbar>
                <Table sx={{ minWidth: 700 }}>
                  <TableHead>
                    <TableRow>
                      {defaultColumn
                        ?.map((item) => (
                          <TableCell  key={item.id}
                            onClick={()=> {
                              if(item?.sort) {
                                setCurrentSort(item?.id);
                              }
                            }}
                            >
                            <Tooltip title={ item?.sort?`Sort by ${item?.label}` : null }>
                              <Typography sx={{ whiteSpace: "nowrap", cursor:item?.sort? "pointer" : "default", color: item?.id===currentSort ? "primary.main" :"text.secondary", fontSize: 14, fontWeight: 600, userSelect:'none' }}>
                              {item.headerRender ? item.headerRender() : item?.label}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                        ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      isLoading?
                      <TableSkeleton rowCount={5} cellCount={8} />
                      :
                      sortedAgentList?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((agent, index) => (
                      <TableRow hover key={index}>
                        {defaultColumn
                          ?.map((column, index) => (
                            <TableCell key={index}>
                              {column?.render
                                ? column?.render(agent, desk)
                                : agent[column?.id]}
                            </TableCell>
                          ))}
                      </TableRow>
                    ))
                    }
                  </TableBody>
                </Table>
              </Scrollbar>
              <TablePagination
                component="div"
                labelRowsPerPage="Per page"
                count={agentsMockList?.length ?? 0}
                page={currentPage ?? 0}
                rowsPerPage={perPage ?? 5}
                onPageChange={(event, index) => setCurrentPage(index)}
                onRowsPerPageChange={(event) =>
                  setPerPage(event?.target?.value)
                }
                rowsPerPageOptions={[5, 10, 25]}
              />
            </Box>
          </Grid>
          <Grid xs={12} xl={3} sx={{ py:2, px: 2, display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'flex-start' }}>
            <Stack sx={{ flexDirection : { xl: 'column', md: 'row', xs: 'column' }, alignItems:'center', gap: 2}}>
              {isLoading?
                <Skeleton width='60px' height='30px' />:
                agentList?.length>0?
                <Typography variant="subtitle1" textAlign="center" sx={{py:{md:2, xs:0}}}>{donutTitle??""}</Typography>:null
              }
              <Box>
                {isLoading?
                    <Stack direction='row' justifyContent='center' pt={1} pb={2}>
                      <Skeleton height='200px' width='200px' variant="circular"/>
                    </Stack>:
                    donutInfo?
                    <Chart
                        height={200}
                        options={chartOptions}
                        series={donutInfo?.donutSeries}
                        type="donut"
                    />
                    :null
                }
              </Box>
              <Divider />
              <Grid container spacing={2}>
              {isLoading?
                [...new Array(6).keys()].map((item)=> (
                <Grid
                  key={item}
                  xs={4}
                >
                  <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}
                  >
                    <Skeleton width='30px' height='20px' />
                  </Stack>
                  <Skeleton width='60px' height='20px' />
                </Grid>
                )):
                donutInfo?.donutPercentages?.map((item, index) => (
                  <Grid
                    key={index}
                    xs={4}
                    px={2}
                  >
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={0.5}
                    >
                      <Stack
                        sx={{
                          backgroundColor: chartOptions.colors[index],
                          borderRadius: 2,
                          height: 8,
                          minWidth: 8
                        }} />
                      <Typography sx={{ fontSize: 10, whiteSpace: 'nowrap' }}>
                        {item?.asset_name ?? ""}
                      </Typography>
                    </Stack>
                    <Stack>
                      {isLoading ?
                        <Skeleton width='30px' height='20px' /> :
                        <Typography variant='subtitle2'>
                          {item?.asset_percentage ?? 0}%
                        </Typography>}
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};
