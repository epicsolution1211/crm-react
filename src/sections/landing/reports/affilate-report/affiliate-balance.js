
import { useMemo } from "react";
import Card from "@mui/material/Card";
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from '@mui/material/styles';

import { Chart } from 'src/components/chart';
import useChart from 'src/hooks/use-chart';

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


export const AffiliateBalance = ({report}) => {
  const theme = useTheme();
  const colors = [theme.palette.info.main, theme.palette.info.dark];

  const radialChartOptions = useChart({
    chart: {
      offsetY: -16,
      sparkline: {
        enabled: true,
      },
    },
    grid: {
      padding: {
        top: 24,
        bottom: 24,
      },
    },
    legend: {
      show: false,
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: '56%',
        },
        dataLabels: {
          name: {
            offsetY: 8,
          },
          value: {
            offsetY: -40,
          },
          total: {
            label: 'Active Client',
            color: theme.palette.text.disabled,
            fontSize: theme.typography.body2.fontSize,
            fontWeight: theme.typography.body2.fontWeight,
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: colors[0], opacity: 1 },
          { offset: 100, color: colors[1], opacity: 1 },
        ],
      },
    },
  });

  const totalKeys = [
    { key: "total_balance",
      label: "Total Balance"
    },
    { key: "total_pnl",
      label: "Total PLN"
    },
    { key: "total_volume",
      label: "Total Volume"
    },
    { key: "total_leveraged_volume",
      label: "Total Leveraged Volume"
    },
  ];

  const positionKeys = [
    { key: "total_open_positions",
      label: "Total Balance"
    },
    { key: "total_close_positions",
      label: "Total PLN"
    },
    { key: "total_pending_positions",
      label: "Total Volume"
    },
  ];

  const donutLabels = ['Open', 'Closed', 'Pending'];

  const chartOptions = useChartOptions(donutLabels);

  const donutChatSeries = useMemo(()=> {
    if(report) {
      return [report?.total_open_positions ?? 0, report?.total_close_positions ?? 0, report?.total_pending_positions ?? 0 ];
    }
    return [0, 0, 0];
  }, [report]);

  const donutPercent = useMemo(()=> {
    if(report) {
      const totalValue = report?.total_open_positions + report?.total_close_positions + report?.total_pending_positions;
      const open = totalValue > 0 ? (report?.total_open_positions / totalValue * 100)?.toFixed(2) : 0;
      const closed = totalValue > 0 ? (report?.total_close_positions / totalValue * 100)?.toFixed(2) : 0;
      const pending = totalValue > 0 ? (report?.total_pending_positions / totalValue * 100)?.toFixed(2) : 0;
      return [open, closed, pending];
    } 
    return [0, 0, 0];
  }, [report]);

  return (
    <Grid xs={12} xl={6}>
      <Card sx={{ p:2, display:'flex', flexDirection:'column', gap:3, pt:3, height:1 }}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={7}>
          {totalKeys?.map((item, index)=>(
            <Stack key={index} pb={2}>
              <Grid container spacing={2}>
                <Grid xs={6.5}>
                  <Typography variant="subtitle2" color='text.primary' whiteSpace='nowrap'>{item.label}:</Typography>
                </Grid>
                <Grid xs={5.5}>
                  <Typography variant="subtitle2" color='text.primary'>{report[item.key]<0?"-":""}${Math.abs(report[item.key])??""}</Typography>
                </Grid>
              </Grid>
            </Stack>
          ))}
          </Grid>

          <Grid xs={12} sm={5} pr={3}>
          <Chart
            dir="ltr"
            type="radialBar"
            series={[report?.online_client_count]}
            options={radialChartOptions}
            width="100%"
            height={280}
          />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid xs={12} sm={7} pt={2}>
            {positionKeys?.map((item, index)=>(
              <Stack key={index} pb={2}>
                <Grid container spacing={2}>
                  <Grid xs={6.5}>
                    <Typography variant="subtitle2" color='text.primary' whiteSpace='nowrap'>{item.label}:</Typography>
                  </Grid>
                  <Grid xs={5.5}>
                    <Typography variant="subtitle2" color='text.primary'>{report[item.key]<0?"-":""}{Math.abs(report[item.key])??""}</Typography>
                  </Grid>
                </Grid>
              </Stack>
            ))}
          </Grid>
          <Grid xs={12} sm={5} sx={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", pr:3}}>
            <Stack>
              <Chart
                  height={100}
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
      </Card>
    </Grid>
  );
};
