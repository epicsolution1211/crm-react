
import { useEffect, useMemo } from "react";
import Card from "@mui/material/Card";
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from "@mui/material/Stack";
import Tooltip from '@mui/material/Tooltip';
import Typography from "@mui/material/Typography";
import useMediaQuery from '@mui/material/useMediaQuery';
import Skeleton from "@mui/material/Skeleton";
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
        'FTD',
        'Deposit',
        'Credit In',
        'Bonus',
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
        show: mdUp ? false : true,
      },
    }
  };
};

export const AgentFTD = ({ report, isLoading, setFTDTable }) => {
  const barChartOptions = useBarChartOptions();
  const theme = useTheme();

  const iconStyles = (value) => ({
    mr: 1,
    p: 0.5,
    width: 24,
    height: 24,
    minWidth: 24,
    borderRadius: '50%',
    color: 'success.main',
    bgcolor: alpha(theme.palette.success.main, 0.16),
    ...(value < 0 && {
      color: 'error.main',
      bgcolor: alpha(theme.palette.error.main, 0.16),
    }),
  });

  const ftdKeys = ['total_ftd_approved', 'total_ftd_pending', 'total_ftd_rejected'];

  const ftdPercent = useMemo(() => {
    if (report) {
      const maxValue = Math.max(report?.total_ftd_approved, report?.total_ftd_pending, report?.total_ftd_rejected);
      const approved = maxValue > 0 ? report?.total_ftd_approved / maxValue * 100 : 0;
      const pending = maxValue > 0 ? report?.total_ftd_pending / maxValue * 100 : 0;
      const rejected = maxValue > 0 ? report?.total_ftd_rejected / maxValue * 100 : 0;
      return [approved, pending, rejected];
    }
    return undefined;
  }, [report]);

  const depositKeys = ['total_ftd_approved', 'total_ftd_pending', 'total_ftd_pending'];

  const depositPercent = useMemo(() => {
    if (report) {
      const maxValue = Math.max(report?.total_deposit_approved, report?.total_deposit_pending, report?.total_deposit_rejected);
      const approved = maxValue > 0 ? report?.total_deposit_approved / maxValue * 100 : 0;
      const pending = maxValue > 0 ? report?.total_deposit_pending / maxValue * 100 : 0;
      const rejected = maxValue > 0 ? report?.total_deposit_rejected / maxValue * 100 : 0;
      return [approved, pending, rejected];
    }
    return undefined;
  }, [report]);

  const netDepositKeys = ['total_ftd_approved', 'total_ftd_pending', 'total_ftd_pending'];

  const netDepositPercent = useMemo(() => {
    if (report) {
      const maxValue = Math.max(report?.net_deposit_approved, report?.net_deposit_pending, report?.net_deposit_rejected);
      const approved = maxValue > 0 ? report?.net_deposit_approved / maxValue * 100 : 0;
      const pending = maxValue > 0 ? report?.net_deposit_pending / maxValue * 100 : 0;
      const rejected = maxValue > 0 ? report?.net_deposit_rejected / maxValue * 100 : 0;
      return [approved, pending, rejected];
    }
    return undefined;
  }, [report]);

  const creditKeys = ['total_credit_in_approved', 'total_credit_in_pending', 'total_credit_in_pending'];

  const creditPercent = useMemo(() => {
    if (report) {
      const maxValue = Math.max(report?.total_credit_in_approved, report?.total_credit_in_pending, report?.total_credit_in_pending);
      const approved = maxValue > 0 ? report?.total_credit_in_approved / maxValue * 100 : 0;
      const pending = maxValue > 0 ? report?.total_credit_in_pending / maxValue * 100 : 0;
      const rejected = maxValue > 0 ? report?.total_credit_in_pending / maxValue * 100 : 0;
      return [approved, pending, rejected];
    }
    return undefined;
  }, [report]);

  const bonusKeys = ['total_bonus_approved', 'total_bonus_pending', 'total_bonus_pending'];

  const bonusPercent = useMemo(() => {
    if (report) {
      const maxValue = Math.max(report?.total_bonus_approved, report?.total_bonus_pending, report?.total_bonus_pending);
      const approved = maxValue > 0 ? report?.total_bonus_approved / maxValue * 100 : 0;
      const pending = maxValue > 0 ? report?.total_bonus_pending / maxValue * 100 : 0;
      const rejected = maxValue > 0 ? report?.total_bonus_pending / maxValue * 100 : 0;
      return [approved, pending, rejected];
    }
    return undefined;
  }, [report]);

  const donutLabels = ['FTD', 'Deposit', 'Credit In', 'Bonus'];

  const chartOptions = useChartOptions(donutLabels);

  const donutChatSeries = useMemo(() => {
    if (report) {
      return [report?.total_ftd_count ?? 0, report?.total_deposit_count ?? 0, report?.total_credit_in_count ?? 0, report?.total_bonus_count ?? 0];
    }
    return [0, 0, 0, 0];
  }, [report]);

  const donutPercent = useMemo(() => {
    if (report) {
      const totalValue = report?.total_ftd_count + report?.total_deposit_count + report?.total_credit_in_count + report?.total_bonus_count;
      const ftd = totalValue > 0 ? (report?.total_ftd_count / totalValue * 100)?.toFixed(2) : 0;
      const deposit = totalValue > 0 ? (report?.total_deposit_count / totalValue * 100)?.toFixed(2) : 0;
      const credit = totalValue > 0 ? (report?.total_credit_in_count / totalValue * 100)?.toFixed(2) : 0;
      const bonus = totalValue > 0 ? (report?.total_bonus_count / totalValue * 100)?.toFixed(2) : 0;
      return [ftd, deposit, credit, bonus];
    }
    return [0, 0, 0, 0];
  }, [report]);

  const averageList = [
    {
      label: 'AVG FTD',
      key: "avg_ftd_amount",
      change: "avg_ftd_change",
    },
    {
      label: 'AVG Deposit',
      key: "avg_deposit_amount",
      change: "avg_deposit_change",
    },
    {
      label: 'AVG Credit In',
      key: "avg_credit_in_amount",
      change: "avg_credit_in_change",
    },
    {
      label: 'AVG Bonus',
      key: "av_bonus_amount",
      change: "avg_bonus_change",
    },
  ];

  const generateTableInfo = () => {
    const tableInfo = [
      ['Total FTD', 'Deposit', 'Net Deposit', 'Credit In', 'Bonus'],
      [`Amount: ${report?.total_ftd_amount ?? ""}, Count: ${report?.total_ftd_count ?? ""}(${ftdKeys?.map((key, index) => {
        const label = index === 0 ? "Approved" : index === 1 ? "Pending" : "Rejected";
        return (
          `${label} : ${report[key] ?? ""}`
        )
      }).join(', ')}), Percent: ${donutPercent[0]}% of total`, `Amount: ${report?.total_deposit_amount ?? ""}, Count: ${report?.total_deposit_count ?? ""}(${depositKeys?.map((key, index) => {
        const label = index === 0 ? "Approved" : index === 1 ? "Pending" : "Rejected";
        return (
          `${label} : ${report[key] ?? ""}`
        )
      }).join(', ')}), Percent: ${donutPercent[1]}% of total`, `Amount: ${report?.net_deposit ?? ""}, Count: ${report?.net_deposit_count ?? ""}(${netDepositKeys?.map((key, index) => {
        const label = index === 0 ? "Approved" : index === 1 ? "Pending" : "Rejected";
        return (
          `${label} : ${report[key] ?? ""}`
        )
      }).join(', ')})`, `Amount: ${report?.total_credit_in_amount ?? ""}, Count: ${report?.total_credit_in_count ?? ""}(${creditKeys?.map((key, index) => {
        const label = index === 0 ? "Approved" : index === 1 ? "Pending" : "Rejected";
        return (
          `${label} : ${report[key] ?? ""}`
        )
      }).join(', ')}), Percent: ${donutPercent[2]}% of total`, `Amount: ${report?.total_bonus_amount ?? ""}, Count: ${report?.total_bonus_count ?? ""}(${bonusKeys?.map((key, index) => {
        const label = index === 0 ? "Approved" : index === 1 ? "Pending" : "Rejected";
        return (
          `${label} : ${report[key] ?? ""}`
        )
      }).join(', ')}), Percent: ${donutPercent[3]}% of total`],
      ['AVG FTD', 'AVG Deposit', 'AVG Credit In', 'AVG Bonus'],
      [...averageList.map((item)=> {
        const change = report ? report[item?.change] ?? 0 : 0;
        return (
          `${report ? report[item?.key] ?? '0.0' : ''} (${change}% ${change < 0 ? "decreased" : "increased"} vs last period)`
        )
      })],
    ];

    setFTDTable(tableInfo);
  }

  useEffect(() => {
    if(report) {
      generateTableInfo();
    }
  }, [report])

  const barChartSeries = useMemo(() => {
    if (report) {
      return [
        {
          name: 'Total',
          data: [parseFloat(report?.total_ftd_amount) ?? 0, parseFloat(report?.total_deposit_amount) ?? 0, parseFloat(report?.total_credit_in_amount) ?? 0, parseFloat(report?.total_bonus_amount) ?? 0],
        },
        {
          name: 'Average',
          data: [parseFloat(report?.avg_ftd_amount) ?? 0, parseFloat(report?.avg_deposit_amount) ?? 0, parseFloat(report?.avg_credit_in_amount) ?? 0, parseFloat(report?.avg_bonus_amount) ?? 0],
        },
      ]
    }
    return [
      {
        name: 'Total',
        data: [0, 0, 0, 0],
      },
      {
        name: 'Average',
        data: [0, 0, 0, 0],
      },
    ]
  }, [report]);

  return (
    <Grid xs={12} xl={6}>
      <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3, pt: 3, pb: 1 }}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={7}>
            <Stack>
              <Grid container spacing={2}>
                <Grid xs={3}>
                  <Typography sx={{ fontSize: { md: 16, xs: 14 } }} color='text.primary' whiteSpace='nowrap'>Total FTD:</Typography>
                </Grid>
                <Grid xs={3}>
                  {isLoading ?
                    <Skeleton width='50px' /> :
                    <Typography variant="subtitle2" color='text.primary'>${report?.total_ftd_amount ?? ""}</Typography>
                  }
                </Grid>
                <Grid xs={6}>
                  <Stack direction='row' gap={2} alignItems='center'>
                    {isLoading ?
                      <Stack direction='row' gap={2}>
                        <Skeleton width='20px' />
                        <Skeleton width='120px' />
                      </Stack>
                      :
                      report ?
                        <>
                          <Typography variant="subtitle2" color='text.primary' minWidth={18}>{report?.total_ftd_count ?? ""}</Typography>
                          <Tooltip
                            title={
                              <Stack>
                                {ftdKeys?.map((key, index) => {
                                  const color = index === 0 ? theme.palette.success.main : index === 1 ? theme.palette.info.main : theme.palette.error.main;
                                  const label = index === 0 ? "Approved" : index === 1 ? "Pending" : "Rejected";
                                  return (
                                    <Typography
                                      key={index}
                                      fontSize={12} color='text.primary' minWidth={18}><span style={{ color: color, minWidth: '65px', display: 'inline-block' }}>{label} : </span>{report[key] ?? ""}
                                    </Typography>
                                  )
                                })}
                              </Stack>
                            }
                          >
                            <Stack direction='column' gap={0.5}>
                              {ftdPercent?.map((item, index) => (
                                <LinearProgress
                                  key={index}
                                  sx={{ width: 120, bgcolor: (theme) => alpha(theme.palette.grey[500], 0.16), }}
                                  value={item ?? 0}
                                  color={index === 0 ? 'success' : index === 1 ? "info" : "error"}
                                  variant="determinate"
                                />
                              ))}
                            </Stack>
                          </Tooltip>
                        </> : null
                    }
                  </Stack>
                </Grid>

                <Grid xs={3}>
                  <Typography variant="subtitle2" color='text.secondary'>Deposit:</Typography>
                </Grid>
                <Grid xs={3}>
                  {isLoading ?
                    <Skeleton width='50px' /> :
                    <Typography variant="subtitle2" color='text.primary'>${report?.total_deposit_amount ?? ""}</Typography>
                  }
                </Grid>
                <Grid xs={6}>
                  <Stack direction='row' gap={2} alignItems='center'>
                    {isLoading ?
                      <Stack direction='row' gap={2}>
                        <Skeleton width='20px' />
                        <Skeleton width='120px' />
                      </Stack>
                      :
                      report ?
                        <>
                          <Typography variant="subtitle2" color='text.primary' minWidth={18}>{report?.total_deposit_count ?? ""}</Typography>
                          <Tooltip title={
                            <Stack>
                              {depositKeys?.map((key, index) => {
                                const color = index === 0 ? theme.palette.success.main : index === 1 ? theme.palette.info.main : theme.palette.error.main;
                                const label = index === 0 ? "Approved" : index === 1 ? "Pending" : "Rejected";
                                return (
                                  <Typography
                                    key={index}
                                    fontSize={12} color='text.primary' minWidth={18}><span style={{ color: color, minWidth: '65px', display: 'inline-block' }}>{label} : </span>{report[key] ?? ""}
                                  </Typography>
                                )
                              })}
                            </Stack>
                          }>
                            <Stack direction='column' gap={0.5}>
                              {depositPercent?.map((item, index) => (
                                <LinearProgress
                                  key={index}
                                  sx={{ width: 120, bgcolor: (theme) => alpha(theme.palette.grey[500], 0.16), }}
                                  value={item ?? 0}
                                  color={index === 0 ? 'success' : index === 1 ? "info" : "error"}
                                  variant="determinate"
                                />
                              ))}
                            </Stack>
                          </Tooltip>
                        </> : null
                    }
                  </Stack>
                </Grid>

                <Grid xs={3}>
                  <Typography variant="subtitle2" color='text.secondary'>Net Deposit:</Typography>
                </Grid>
                <Grid xs={3}>
                  {isLoading ?
                    <Skeleton width='50px' /> :
                    <Typography variant="subtitle2" color='text.primary'>${report?.net_deposit ?? ""}</Typography>
                  }
                </Grid>
                <Grid xs={6}>
                  <Stack direction='row' gap={2} alignItems='center'>
                    {isLoading ?
                      <Stack direction='row' gap={2}>
                        <Skeleton width='20px' />
                        <Skeleton width='120px' />
                      </Stack>
                      :
                      report ?
                        <>
                          <Typography variant="subtitle2" color='text.primary' minWidth={18}>{report?.net_deposit_count ?? ""}</Typography>
                          <Tooltip title={
                            <Stack>
                              {netDepositKeys?.map((key, index) => {
                                const color = index === 0 ? theme.palette.success.main : index === 1 ? theme.palette.info.main : theme.palette.error.main;
                                const label = index === 0 ? "Approved" : index === 1 ? "Pending" : "Rejected";
                                return (
                                  <Typography
                                    key={index}
                                    fontSize={12} color='text.primary' minWidth={18}><span style={{ color: color, minWidth: '65px', display: 'inline-block' }}>{label} : </span>{report[key] ?? ""}
                                  </Typography>
                                )
                              })}
                            </Stack>
                          }>
                            <Stack direction='column' gap={0.5}>
                              {netDepositPercent?.map((item, index) => (
                                <LinearProgress
                                  key={index}
                                  sx={{ width: 120, bgcolor: (theme) => alpha(theme.palette.grey[500], 0.16), }}
                                  value={item ?? 0}
                                  color={index === 0 ? 'success' : index === 1 ? "info" : "error"}
                                  variant="determinate"
                                />
                              ))}
                            </Stack>
                          </Tooltip>
                        </> : null
                    }
                  </Stack>
                </Grid>

                <Grid xs={3}>
                  <Typography variant="subtitle2" color='text.secondary'>Credit In:</Typography>
                </Grid>
                <Grid xs={3}>
                  {isLoading ?
                    <Skeleton width='50px' /> :
                    <Typography variant="subtitle2" color='text.primary'>${report?.total_credit_in_amount ?? ""}</Typography>
                  }
                </Grid>
                <Grid xs={6}>
                  <Stack direction='row' gap={2} alignItems='center'>
                    {isLoading ?
                      <Stack direction='row' gap={2}>
                        <Skeleton width='20px' />
                        <Skeleton width='120px' />
                      </Stack>
                      :
                      report ?
                        <>
                          <Typography variant="subtitle2" color='text.primary' minWidth={18}>{report?.total_credit_in_count ?? ""}</Typography>
                          <Tooltip title={
                            <Stack>
                              {creditKeys?.map((key, index) => {
                                const color = index === 0 ? theme.palette.success.main : index === 1 ? theme.palette.info.main : theme.palette.error.main;
                                const label = index === 0 ? "Approved" : index === 1 ? "Pending" : "Rejected";
                                return (
                                  <Typography
                                    key={index}
                                    fontSize={12} color='text.primary' minWidth={18}><span style={{ color: color, minWidth: '65px', display: 'inline-block' }}>{label} : </span>{report[key] ?? ""}
                                  </Typography>
                                )
                              })}
                            </Stack>
                          }>
                            <Stack direction='column' gap={0.5}>
                              {creditPercent?.map((item, index) => (
                                <LinearProgress
                                  key={index}
                                  sx={{ width: 120, bgcolor: (theme) => alpha(theme.palette.grey[500], 0.16), }}
                                  value={item ?? 0}
                                  color={index === 0 ? 'success' : index === 1 ? "info" : "error"}
                                  variant="determinate"
                                />
                              ))}
                            </Stack>
                          </Tooltip>
                        </> : null
                    }
                  </Stack>
                </Grid>

                <Grid xs={3}>
                  <Typography variant="subtitle2" color='text.secondary'>Bonus:</Typography>
                </Grid>
                <Grid xs={3}>
                  {isLoading ?
                    <Skeleton width='50px' /> :
                    <Typography variant="subtitle2" color='text.primary'>${report?.total_bonus_amount ?? ""}</Typography>
                  }
                </Grid>
                <Grid xs={6}>
                  <Stack direction='row' gap={2} alignItems='center'>
                    {isLoading ?
                      <Stack direction='row' gap={2}>
                        <Skeleton width='20px' />
                        <Skeleton width='120px' />
                      </Stack>
                      :
                      report ?
                        <>
                          <Typography variant="subtitle2" color='text.primary' minWidth={18}>{report?.total_bonus_count ?? ""}</Typography>
                          <Tooltip title={
                            <Stack>
                              {bonusKeys?.map((key, index) => {
                                const color = index === 0 ? theme.palette.success.main : index === 1 ? theme.palette.info.main : theme.palette.error.main;
                                const label = index === 0 ? "Approved" : index === 1 ? "Pending" : "Rejected";
                                return (
                                  <Typography
                                    key={index}
                                    fontSize={12} color='text.primary' minWidth={18}><span style={{ color: color, minWidth: '65px', display: 'inline-block' }}>{label} : </span>{report[key] ?? ""}
                                  </Typography>
                                )
                              })}
                            </Stack>
                          }>
                            <Stack direction='column' gap={0.5}>
                              {bonusPercent?.map((item, index) => (
                                <LinearProgress
                                  key={index}
                                  sx={{ width: 120, bgcolor: (theme) => alpha(theme.palette.grey[500], 0.16), }}
                                  value={item ?? 0}
                                  color={index === 0 ? 'success' : index === 1 ? "info" : "error"}
                                  variant="determinate"
                                />
                              ))}
                            </Stack>
                          </Tooltip>
                        </> : null
                    }
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </Grid>

          <Grid xs={12} sm={5}>
            <Stack>
              {isLoading ?
                <Stack direction='row' justifyContent='center' pt={1} pb={2}>
                  <Skeleton height='80px' width='80px' variant="circular" />
                </Stack> :
                <Chart
                  height={120}
                  options={chartOptions}
                  series={donutChatSeries}
                  type="donut"
                />
              }
              <Divider />
              <Grid container spacing={2} pt={0.5}>
                {donutChatSeries?.map((item, index) => (
                  <Grid
                    key={index}
                    xs={3}
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
                      <Typography sx={{ fontSize: 10, whiteSpace: 'nowrap' }}>
                        {donutLabels[index]}
                      </Typography>
                    </Stack>
                    <Stack>
                      {isLoading ?
                        <Skeleton width='30px' height='20px' /> :
                        <Typography variant='subtitle2'>
                          {donutPercent[index]}%
                        </Typography>
                      }
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
                  <Grid container spacing={2} pb={2} key={index}>
                    <Grid xs={3} key={`${index}-label`}>
                      <Typography variant="subtitle2" color='text.secondary'>{item?.label}:</Typography>
                    </Grid>
                    <Grid xs={3} key={`${index}-amount`}>
                      {isLoading ?
                        <Skeleton width='50px' /> :
                        <Typography variant="subtitle2" color='text.primary'>${report ? report[item?.key] ?? '0.0' : ''}</Typography>
                      }
                    </Grid>
                    <Grid xs={6} key={`${index}-changes`}>
                      {isLoading ?
                        <Stack direction='row' gap={2}>
                          <Skeleton width='20px' />
                          <Skeleton width='120px' />
                        </Stack>
                        :
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
                      }
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
              series={isLoading ? [] : barChartSeries}
              type="bar"
            />
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};
