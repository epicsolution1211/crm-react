
import { useEffect, useMemo } from "react";
import Card from "@mui/material/Card";
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Chart } from 'src/components/chart';

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

const useBarChartOptions = (labels) => {
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
      categories: labels,
      labels: {
        offsetY: 0,
        style: {
          colors: theme.palette.text.secondary
        },
        show: false
      }
    },
    yaxis: {
      labels: {
        show: mdUp? false : true,
      },
    }
  };
};

export const AgentBrand = ({report, isLoading, setClientTable}) => {

  const donutInfo = useMemo(()=> {
    if(report) {
      const brands = report?.brand_status;

      const donutLabels = brands?.map((item)=> item?.status_name);
      const donutSeries = brands?.map((item)=> parseFloat(item?.total));
      const totalVolume = brands?.reduce((sum, asset) => {
        return sum + parseFloat(asset?.total);
      }, 0);
      const donutPercentages = brands?.map((asset) => {
        const assetVolume = Number(asset.total);
        const percentage = (assetVolume / totalVolume) * 100;
        return {
          asset_name: asset.status_name,
          asset_percentage: percentage?.toFixed(2)
        };
      });
      return {donutLabels, donutSeries, donutPercentages};
    } 
  }, [report]);

  const barChartInfo= useMemo(()=> {
    if(report) {
      const labels = report?.brand_status?.map((item)=> item?.status_name);
      const series = [{ name: 'Total', data:report?.brand_status?.map((item)=> item?.total)}];
      return {labels, series}
    } else {
      return {labels:[], series:[]}
    }
  }, [report])

  const chartOptions = useChartOptions(donutInfo?.donutLabels??[]);

  const barChartOptions = useBarChartOptions(barChartInfo?.labels??[]);
  
  const generateTableInfo = () => {
    const tableInfo = [
      ['Total Client Count'],
      [`${report?.total_client_count??""}`],
      ['Brand Status Breakdown'],
      [...report?.brand_status?.map((item, index)=> (`${item.total} (${donutInfo?.donutPercentages[index].asset_percentage}% of total)`))]
    ];
    setClientTable(tableInfo);
  }

  useEffect(() => {
    if(report) {
      generateTableInfo();
    }
  }, [report])

  return (
    <Grid xs={12} xl={6}>
      <Card sx={{ p:2, display:'flex', flexDirection:'column', gap:3, pt:3, height:1 }}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={7}>
          <Stack pb={6}>
            <Grid container spacing={2}>
              <Grid xs={8}>
                <Typography variant="subtitle" color='text.primary' whiteSpace='nowrap'>Total Client Count:</Typography>
              </Grid>
              <Grid xs={4}>
                {isLoading?
                <Skeleton width='50px'/>:
                report?
                <Typography variant="subtitle2" color='text.primary'>{report?.total_client_count??""}</Typography>
                :null
                }
              </Grid>
            </Grid>
          </Stack>
          <Typography variant="subtitle2" color='text.primary' whiteSpace='nowrap' pb={3}>Brand Status Breakdown:</Typography>
          {isLoading?
            [...new Array(3).keys()].map((item)=> (
            <Stack key={item} pb={2}>
              <Grid container spacing={2}>
                <Grid xs={8}>
                  <Skeleton width='100px'/>
                </Grid>
                <Grid xs={4}>
                  <Skeleton width='50px'/>
                </Grid>
              </Grid>
            </Stack>
            ))
            :report?.brand_status?.map((item, index)=>(
            <Stack key={index} pb={2}>
              <Grid container spacing={2}>
                <Grid xs={8}>
                  <Typography variant="subtitle2" color='text.secondary' whiteSpace='nowrap'>{item.status_name}:</Typography>
                </Grid>
                <Grid xs={4}>
                  {isLoading?
                  <Skeleton width='50px'/>:
                  report?
                  <Typography variant="subtitle2" color='text.primary'>{item.total}</Typography>
                  :null
                  }
                </Grid>
              </Grid>
            </Stack>
          ))
          }
          </Grid>

          <Grid xs={12} sm={5} pr={2} sx={{display:"flex", flexDirection:"column", gap:2, pr:3 }}>
            <Chart
              height={160}
              options={barChartOptions}
              series={isLoading?[]: barChartInfo?.series}
              type="bar"
            />
            <Stack>
              {isLoading?
                <Stack direction='row' justifyContent='center' pt={1} pb={2}>
                  <Skeleton height='80px' width='80px' variant="circular"/>
                </Stack>:
                donutInfo?
                <Chart
                    height={120}
                    options={chartOptions}
                    series={donutInfo?.donutSeries}
                    type="donut"
                />
                :null
              }
              <Divider/>
              <Grid container spacing={2} pt={0.5}>
              {isLoading?
                [...new Array(4).keys()].map((item)=> (
                  <Grid
                  key={item}
                  xs={3}
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
                        {item?.asset_percentage ?? ""}%
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
