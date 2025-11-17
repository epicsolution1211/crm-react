
import { useEffect, useMemo } from "react";
import Card from "@mui/material/Card";
import Grid from '@mui/material/Unstable_Grid2';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from '@mui/material/styles';

import { Chart } from 'src/components/chart';
import useChart from 'src/hooks/use-chart';

export const AffiliateTotal = ({report, isLoading, setTotalTable}) => {
  const theme = useTheme();
  const colors = [theme.palette.info.main, theme.palette.info.dark];

  const totalValidLeads = useMemo(()=> {
    if(report?.total_leads > 0) {
      return ((report.total_verified_leads / report.total_leads) * 100)?.toFixed(2);
    }
    return 0
  }, [report])

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
            label: 'Valid Leads',
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
    { key: "total_ftd_amount",
      label: "Total FTD"
    },
    { key: "total_deposit_amount",
      label: "Deposit"
    },
    { key: "net_deposit_amount",
      label: "Net Deposit"
    },
    { key: "total_wd_amount",
      label: "Total WD"
    },
    { key: "player_avg_value",
      label: "Average Player Value"
    },
  ];

  const generateTableInfo = () => {
    const tableInfo = [
      [...totalKeys.map((item)=> (item.label))],
      [...totalKeys.map((item)=> (`${report[item.key]<0?"-":""}$${Math.abs(report[item.key])??""}`))],
      ['Client with deposit', 'Valid Leads'],
      [`${report?.client_with_deposit_percentage ?? '0'}%`, `${totalValidLeads}%`],
    ];
    setTotalTable(tableInfo);
  }

  useEffect(() => {
    if(report) {
      generateTableInfo();
    }
  }, [report, totalValidLeads])

  return (
    <Grid xs={12} xl={6}>
      <Card sx={{ p:2, display:'flex', flexDirection:'column', gap:3, pt:3, height:1 }}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={7}>
          {totalKeys?.map((item, index)=>(
            <Stack key={index} pb={3}>
              <Grid container spacing={2}>
                <Grid xs={6}>
                  <Typography variant="subtitle2" color='text.primary' whiteSpace='nowrap'>{item.label}:</Typography>
                </Grid>
                <Grid xs={6}>
                  {isLoading?
                  <Skeleton width='50px'/>:
                  report?
                  <Typography variant="subtitle2" color='text.primary'>{report[item.key]<0?"-":""}${Math.abs(report[item.key])??""}</Typography>
                  :null
                  }
                </Grid>
              </Grid>
            </Stack>
          ))}
          </Grid>

          <Grid xs={12} sm={5} pr={3}>
            <Stack direction='column' alignItems='center' justifyContent='center' gap={2}>
              <Typography variant="subtitle2">Clients with deposit</Typography>
              <Typography variant="h4" color="success.main">{report?.client_with_deposit_percentage ?? '0'}%</Typography>
            </Stack>
            <Chart
              dir="ltr"
              type="radialBar"
              series={[isLoading? 0 : totalValidLeads]}
              options={radialChartOptions}
              width="100%"
              height={260}
            />
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};
