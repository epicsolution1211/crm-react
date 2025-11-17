
import { useMemo } from "react";
import Card from "@mui/material/Card";
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from '@mui/system/colorManipulator';
import { useTheme } from '@mui/material/styles';

import { Chart } from 'src/components/chart';
import { Iconify } from 'src/components/iconify';
import { AgentStats } from './agent-stats';

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

export const AgentClosePositions = ({report}) => {
  const theme = useTheme();

  const openKeys = [
    { key: "total_closed_positions",
      label: "Total Close Positions"
    },
    { key: "closed_volume",
      label: "Close Volume"
    },
    { key: "closed_leveraged_amount",
      label: "Close Leveraged Volume"
    },
    { key: "closed_pnl",
      label: "Close PNL"
    },
  ];

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

  const closeTopAssets = useMemo(()=> {
    if(report) {
      return report?.close_top_assets;
    }
    return undefined;
  }, [report]);


  const donutInfo = useMemo(()=> {
    if(report) {
      const topOpens = report?.close_top_assets;

      const donutLabels = topOpens?.map((item)=> item?.asset_name);
      const donutSeries = topOpens?.map((item)=> parseFloat(item?.asset_volume));
      const totalVolume = topOpens?.reduce((sum, asset) => {
        return sum + parseFloat(asset?.asset_volume);
      }, 0);
      const donutPercentages = topOpens?.map((asset) => {
        const assetVolume = Number(asset.asset_volume);
        const percentage = (assetVolume / totalVolume) * 100;
        return {
          asset_name: asset.asset_name,
          asset_percentage: percentage?.toFixed(2)
        };
      });
      return {donutLabels, donutSeries, donutPercentages};
    } 
  }, [report]);

  const chartOptions = useChartOptions(donutInfo?.donutLabels??[]);

  return (
    <Grid xs={12} xl={6}>
      <Card sx={{ p:2, display:'flex', flexDirection:'column', gap:3, pt:3, height:1 }}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={7}>
          {openKeys?.map((item, index)=>(
            <Stack key={index} pb={2}>
              <Grid container spacing={2}>
                <Grid xs={6.5}>
                  <Typography variant="subtitle2" color='text.primary' whiteSpace='nowrap'>{item.label}:</Typography>
                </Grid>
                <Grid xs={5.5}>
                  {report?
                    <Typography variant="subtitle2" color='text.primary'>{report[item.key]<0?"-":""}${Math.abs(report[item.key])??""}</Typography>
                  :null}
                </Grid>
              </Grid>
            </Stack>
          ))}
          </Grid>

          <Grid xs={12} sm={5} pr={2}>
            <AgentStats
              chartSeries={[
                {
                  data: report?.closed_position_chart??[]
                }
              ]}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid xs={12} sm={7}>
            <Stack>
              <Typography variant="subtitle2" whiteSpace='nowrap' color='text.primary' pb={2}>Top Assets:</Typography>
                {closeTopAssets?.map((item, index) => (
                  <Grid container spacing={2} key={index} pb={2}>
                    <Grid xs={4}>
                      <Typography variant="subtitle2" whiteSpace='nowrap' color='text.secondary'>{item?.asset_name}</Typography>
                    </Grid>
                    <Grid xs={4}>
                      <Stack direction='row' alignItems='center'>
                        <Iconify
                          icon={item?.asset_price < 0 ? 'ci:chevron-down-duo' : 'ci:chevron-up-duo'}
                          sx={iconStyles(item?.asset_price)} />
                        <Typography fontSize={10} color={item?.asset_price < 0 ? "error.main" : "success.main"}>{item?.asset_price?.toFixed(2)}</Typography>
                      </Stack>
                    </Grid>
                    <Grid xs={4}>
                      <Typography variant="subtitle2" color='text.primary'>${report ? item?.asset_volume ?? '0.0' : ''}</Typography>
                    </Grid>
                  </Grid>
                ))}
            </Stack>
          </Grid>
          <Grid xs={12} sm={5} sx={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
            <Stack>
              {donutInfo?
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
                {donutInfo?.donutPercentages?.map((item, index) => (
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
                      <Typography variant='subtitle2'>
                        {item?.asset_percentage ?? ""}%
                      </Typography>
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
