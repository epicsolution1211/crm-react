
import { useMemo } from "react";
import Card from "@mui/material/Card";
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from "@mui/material/Stack";
import Tooltip from '@mui/material/Tooltip';
import Typography from "@mui/material/Typography";
import useMediaQuery from '@mui/material/useMediaQuery';
import { alpha } from '@mui/system/colorManipulator';
import { useTheme } from '@mui/material/styles';

import { Chart } from 'src/components/chart';
import { Iconify } from 'src/components/iconify';

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

const useBarChartOptions = () => {
  const theme = useTheme();
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));

  return {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1,
      type: 'solid',
      colors: [theme.palette.success.dark, theme.palette.info.main]
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    legend: {
      show: false
    },
    plotOptions: {
      bar: {
        columnWidth: '20px'
      }
    },
    stroke: {
      colors: ['transparent'],
      show: true,
      width: 2
    },
    theme: {
      mode: theme.palette.mode
    },
    xaxis: {
      axisBorder: {
        color: theme.palette.divider,
        show: true
      },
      axisTicks: {
        color: theme.palette.divider,
        show: true
      },
      categories: [
        'Total WD',
        'WD',
        'Credit Out',
      ],
      labels: {
        offsetY: 0,
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      labels: {
        show: mdUp? false : true,
      },
    }
  };
};

export const AgentWD = ({ report }) => {
  const barChartOptions = useBarChartOptions();
  const theme = useTheme();

  const iconStyles = (value) => ({
    mr: 1,
    p: 0.5,
    width: 24,
    minWidth: 24,
    height: 24,
    borderRadius: '50%',
    color: 'success.main',
    bgcolor: alpha(theme.palette.success.main, 0.16),
    ...(value < 0 && {
      color: 'error.main',
      bgcolor: alpha(theme.palette.error.main, 0.16),
    }),
  });

  const totalWdKeys = ['total_wd_approved', 'total_wd_pending', 'total_wd_rejected'];

  const totalWdPercent = useMemo(()=> {
    if(report) {
      const maxValue = Math.max(report?.total_wd_approved, report?.total_wd_pending, report?.total_wd_rejected);
      const approved = maxValue > 0 ? report?.total_wd_approved / maxValue * 100 : 0;
      const pending = maxValue > 0 ? report?.total_wd_pending / maxValue * 100 : 0;
      const rejected = maxValue > 0 ? report?.total_wd_rejected / maxValue * 100 : 0;
      return [approved, pending, rejected];
    } 
    return undefined;
  }, [report]);

  const wdKeys = ['wd_approved', 'wd_pending', 'wd_rejected'];

  const wdPercent = useMemo(()=> {
    if(report) {
      const maxValue = Math.max(report?.wd_approved, report?.wd_pending, report?.wd_rejected);
      const approved = maxValue > 0 ? report?.wd_approved / maxValue * 100 : 0;
      const pending = maxValue > 0 ? report?.wd_pending / maxValue * 100 : 0;
      const rejected = maxValue > 0 ? report?.wd_rejected / maxValue * 100 : 0;
      return [approved, pending, rejected];
    } 
    return undefined;
  }, [report]);

  const creditKeys = ['credit_out_approved', 'credit_out_pending', 'credit_out_rejected'];

  const creditPercent = useMemo(()=> {
    if(report) {
      const maxValue = Math.max(report?.credit_out_approved, report?.credit_out_pending, report?.credit_out_rejected);
      const approved = maxValue > 0 ? report?.credit_out_approved / maxValue * 100 : 0;
      const pending = maxValue > 0 ? report?.credit_out_pending / maxValue * 100 : 0;
      const rejected = maxValue > 0 ? report?.credit_out_rejected / maxValue * 100 : 0;
      return [approved, pending, rejected];
    } 
    return undefined;
  }, [report]);

  const donutLabels = ['Total WD', 'WD', 'Credit Out'];

  const chartOptions = useChartOptions(donutLabels);

  const donutChatSeries = useMemo(()=> {
    if(report) {
      return [ report?.total_wd_count ?? 0, report?.wd_count ?? 0, report?.credit_out_count ?? 0 ] ;
    }
    return [0, 0, 0];
  }, [report]);

  const donutPercent = useMemo(()=> {
    if(report) {
      const totalValue = report?.total_wd_count + report?.wd_count + report?.credit_out_count;
      const totalWd = totalValue > 0 ? (report?.total_wd_count / totalValue * 100)?.toFixed(2) : 0;
      const wd = totalValue > 0 ? (report?.wd_count / totalValue * 100)?.toFixed(2) : 0;
      const credit = totalValue > 0 ? (report?.credit_out_count / totalValue * 100)?.toFixed(2) : 0;
      return [totalWd, wd, credit];
    } 
    return [0, 0, 0];
  }, []);

  const averageList = [
    {
      label: 'AVG Total WD',
      key: "avg_total_wd_amount",
      change: "avg_total_wd_change",
    },
    {
      label: 'WD',
      key: "avg_wd_amount",
      change: "avg_wd_change",
    },
    {
      label: 'AVG Credit Out',
      key: "avg_credit_out_amount",
      change: "avg_credit_out_change",
    },
  ];

  const barChartSeries = useMemo(()=> {
    if(report) {
      return [
        {
          name: 'Total',
          data: [ parseFloat(report?.total_wd_amount) ?? 0, parseFloat(report?.wd_amount) ?? 0, parseFloat(report?.credit_out_amount) ?? 0 ],
        },
        {
          name: 'Average',
          data: [ parseFloat(report?.avg_total_wd_amount) ?? 0, parseFloat(report?.avg_wd_amount) ?? 0, parseFloat(report?.avg_credit_out_amount) ?? 0 ],
        },
      ]
    }
    return [
      {
        name: 'Total',
        data: [ 0, 0, 0, 0 ],
      },
      {
        name: 'Average',
        data: [ 0, 0, 0, 0 ],
      },
    ]
  }, [report]);

  return (
    <Grid xs={12} xl={6}>
      <Card sx={{ p:2, display:'flex', flexDirection:'column', gap:3, pt:3, pb:1, height:1 }}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={7}>
            <Stack>
              <Grid container spacing={2}>
                <Grid xs={3}>
                  <Typography sx={{fontSize:{md:16, xs:14}}} color='text.primary' whiteSpace='nowrap'>Total WD:</Typography>
                </Grid>
                <Grid xs={3}>
                  <Typography variant="subtitle2" color='text.primary'>${report?.total_wd_amount??""}</Typography>
                </Grid>
                <Grid xs={6}>
                  <Stack direction='row' gap={2} alignItems='center'>
                    <>
                      <Typography variant="subtitle2" color='text.primary' minWidth={18}>{report?.wd_count??""}</Typography>
                      <Tooltip 
                        title={
                          <Stack>
                            {totalWdKeys?.map((key, index)=> {
                              const color = index===0 ? theme.palette.success.main : index===1 ?theme.palette.info.main : theme.palette.error.main;
                              const label = index===0 ? "Approved" : index===1 ? "Pending" : "Rejected";
                              return (
                                <Typography 
                                  key={index}
                                  fontSize={12} color='text.primary' minWidth={18}><span style={{color:color, minWidth:'65px', display:'inline-block'}}>{label} : </span>{report[key]??""}
                                </Typography>
                              )
                            })}
                          </Stack>
                        }
                      >
                        <Stack direction='column' gap={0.5}>
                          {totalWdPercent?.map((item, index)=> (
                            <LinearProgress
                              key={index}
                              sx={{ width: 120, bgcolor: (theme) => alpha(theme.palette.grey[500], 0.16), }}
                              value={item??0}
                              color={index===0?'success':index===1?"info":"error"}
                              variant="determinate"
                          />
                          ))}
                        </Stack>
                      </Tooltip>
                    </>
                  </Stack>
                </Grid>

                <Grid xs={3}>
                  <Typography variant="subtitle2" color='text.secondary'>WD:</Typography>
                </Grid>
                <Grid xs={3}>
                  <Typography variant="subtitle2" color='text.primary'>${report?.wd_amount??""}</Typography>
                </Grid>
                <Grid xs={6}>
                  <Stack direction='row' gap={2} alignItems='center'>
                    <>
                      <Typography variant="subtitle2" color='text.primary' minWidth={18}>{report?.wd_count??""}</Typography>
                      <Tooltip title={
                        <Stack>
                          {wdKeys?.map((key, index)=> {
                            const color = index===0 ? theme.palette.success.main : index===1 ? theme.palette.info.main : theme.palette.error.main;
                            const label = index===0 ? "Approved" : index===1 ? "Pending" : "Rejected";
                            return (
                              <Typography 
                                key={index}
                                fontSize={12} color='text.primary' minWidth={18}><span style={{color:color, minWidth:'65px', display:'inline-block'}}>{label} : </span>{report[key]??""}
                              </Typography>
                            )
                          })}
                        </Stack>
                      }>
                        <Stack direction='column' gap={0.5}>
                          {wdPercent?.map((item, index)=> (
                            <LinearProgress
                              key={index}
                              sx={{ width: 120, bgcolor: (theme) => alpha(theme.palette.grey[500], 0.16), }}
                              value={item??0}
                              color={index===0?'success':index===1?"info":"error"}
                              variant="determinate"
                          />
                          ))}
                        </Stack>
                      </Tooltip>
                    </>
                  </Stack>
                </Grid>

                <Grid xs={3}>
                  <Typography variant="subtitle2" color='text.secondary'>Credit Out:</Typography>
                </Grid>
                <Grid xs={3}>
                  <Typography variant="subtitle2" color='text.primary'>${report?.credit_out_amount??""}</Typography>
                </Grid>
                <Grid xs={6}>
                  <Stack direction='row' gap={2} alignItems='center'>
                    <>
                      <Typography variant="subtitle2" color='text.primary' minWidth={18}>{report?.credit_out_count??""}</Typography>
                      <Tooltip title={
                        <Stack>
                          {creditKeys?.map((key, index)=> {
                            const color = index===0 ? theme.palette.success.main : index===1 ?theme.palette.info.main : theme.palette.error.main;
                            const label = index===0 ? "Approved" : index===1 ? "Pending" : "Rejected";
                            return (
                              <Typography 
                                key={index}
                                fontSize={12} color='text.primary' minWidth={18}><span style={{color:color, minWidth:'65px', display:'inline-block'}}>{label} : </span>{report[key]??""}
                              </Typography>
                            )
                          })}
                        </Stack>
                      }>
                        <Stack direction='column' gap={0.5}>
                          {creditPercent?.map((item, index)=> (
                            <LinearProgress
                              key={index}
                              sx={{ width: 120, bgcolor: (theme) => alpha(theme.palette.grey[500], 0.16), }}
                              value={item??0}
                              color={index===0?'success':index===1?"info":"error"}
                              variant="determinate"
                          />
                          ))}
                        </Stack>
                      </Tooltip>
                    </>
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </Grid>

          <Grid xs={12} sm={5}>
            <Stack>
              <Chart
                height={120}
                options={chartOptions}
                series={donutChatSeries}
                type="donut"
              />
              <Divider/>
              <Grid container spacing={2} pt={0.5}>
                {donutChatSeries?.map((item, index) => (
                <Grid
                  key={index}
                  xs={4}
                >
                  <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}
                  >
                    <Stack
                      sx={{
                        backgroundColor: chartOptions.colors[index],
                        borderRadius: 2,
                        height: 8,
                        minWidth: 8
                      }}
                    />
                    <Typography sx={{ fontSize: 10, whiteSpace:'nowrap' }}>
                      {donutLabels[index]}
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography variant='subtitle2'>
                      {donutPercent[index]}%
                    </Typography>
                  </Stack>
                </Grid>
                ))}
              </Grid>
            </Stack>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid xs={12} sm={7}>
            <Stack>
                {averageList?.map((item, index) => {
                  const change = report ? report[item?.change] ?? 0 : 0; 
                  return (
                    <Grid container spacing={2} key={index} pb={2}>
                      <Grid xs={3}>
                        <Typography variant="subtitle2" whiteSpace='nowrap' color='text.secondary'>{item?.label}:</Typography>
                      </Grid>
                      <Grid xs={3}>
                        <Typography variant="subtitle2" color='text.primary'>${report ? report[item?.key] ?? '0.0' : ''}</Typography>
                      </Grid>
                      <Grid xs={6}>
                      <Stack direction='row' gap={2} alignItems='center'>
                        <Typography variant="subtitle2" color='text.primary' minWidth={18}>{change}</Typography>
                          <Stack direction='row' gap={0.5} alignItems='center'>
                            <Iconify
                              icon={change < 0 ? 'ci:chevron-down-duo' : 'ci:chevron-up-duo'}
                              sx={iconStyles(change)} />
                            <Typography fontSize={10} color={change < 0 ? "error.main" : "success.main"}>{change}%</Typography>
                            <Typography fontSize={10}>{change < 0 ? "decrease" : "increase"} vs last period</Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                    </Grid>
                  );
                })}
            </Stack>
          </Grid>
          <Grid xs={12} sm={5}>
            <Chart
              height={160}
              options={barChartOptions}
              series={barChartSeries}
              type="bar"
            />
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};
